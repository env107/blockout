/**
 * Context-sensitive right panel. Content is driven by store.selection and the
 * current mode: nothing selected → scene/lighting/shot; an entity, the shot
 * camera, or a single mark → their editors. Every write goes through
 * store.mutate or a store action; angles are radians in the doc and shown as
 * degrees where a filmmaker expects degrees.
 */

import { useStore } from '../store'
import { emit } from '../bus'
import { useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { SENSORS, LENS_SET } from '@engine/camera'
import { GAITS } from '@engine/gaits'
import { RIGS } from '@engine/rigs'
import { MOTION_PRESETS, type MotionPreset } from '@engine/motions'
import { CAMERA_MOVE_PRESETS } from '@engine/camera-moves'
import { ACTION_PRESETS } from '@engine/action-presets'
import { ShotEvaluator } from '@engine/evaluate'
import { newId } from '@engine/ids'
import { getSceneManager } from '../export/scene-access'
import {
  gaitLabel,
  motionLabel,
  motionCategoryLabel,
  cameraMoveLabel,
  cameraMoveDescription,
  cameraMoveCategoryLabel,
  actionLabel,
  actionDescription,
  actionCategoryLabel
} from '../../shared/i18n/engine-labels'
import { CameraMarkFields } from './camera-mark-fields'
import type {
  ActorMark,
  CameraMark,
  Entity,
  GaitId,
  LightingPresetId,
  RigId,
  SensorId,
  ShotSizeId,
  AspectId,
  ProjectDoc,
  Scene,
  Shot
} from '@engine/types'

const clamp = (v: number, lo: number, hi: number): number => Math.min(Math.max(v, lo), hi)
const toDeg = (rad: number): number => Math.round((rad * 180) / Math.PI)
const toRad = (deg: number): number => (deg * Math.PI) / 180

const SWATCHES = ['#e5484d', '#f5a524', '#46a758', '#3b82f6', '#a855f7', '#ec4899', '#14b8a6', '#f97316']

const LIGHTING_IDS: LightingPresetId[] = [
  'day',
  'goldenHour',
  'night',
  'interiorWarm',
  'interiorCool',
  'club'
]

const ASPECTS: AspectId[] = ['16:9', '9:16', '2.39:1', '4:3', '1:1']
const SHOT_SIZE_BTNS: ShotSizeId[] = ['WS', 'FS', 'MS', 'MCU', 'CU']

function num(v: string): number | null {
  const n = Number(v)
  return Number.isNaN(n) ? null : n
}

/* ---------------------------------------------------------------------- */

export function Inspector(): JSX.Element {
  const { t } = useTranslation()
  const selection = useStore((s) => s.selection)
  const scene = useStore((s) => s.scene())
  const shot = useStore((s) => s.shot())
  // Pinned tabs: camera controls and character animation reachable at ANY
  // time, whatever is selected.
  const [tab, setTab] = useState<'auto' | 'camera' | 'animate'>('auto')

  if (!scene || !shot) return <div />

  let body: JSX.Element
  if (tab === 'camera') {
    body = <CameraInspector scene={scene} shot={shot} />
  } else if (tab === 'animate') {
    body = <AnimateTab scene={scene} shot={shot} />
  } else if (selection === null) {
    body = <SceneInspector scene={scene} shot={shot} />
  } else if (selection.kind === 'entity') {
    body = <EntityInspector scene={scene} shot={shot} entityId={selection.entityId} />
  } else if (selection.kind === 'entities') {
    body = <MultiEntityInspector scene={scene} entityIds={selection.entityIds} />
  } else if (selection.kind === 'camera') {
    body = <CameraInspector scene={scene} shot={shot} />
  } else if (selection.kind === 'marks') {
    body = (
      <MultiMarkInspector
        scene={scene}
        shot={shot}
        entityId={selection.entityId}
        markIds={selection.markIds}
      />
    )
  } else {
    body = (
      <MarkInspector
        scene={scene}
        shot={shot}
        entityId={selection.entityId}
        markId={selection.markId}
      />
    )
  }

  return (
    <div>
      <div className="panel-section" style={{ paddingBottom: 0 }}>
        <div className="seg">
          <button
            className={tab === 'auto' ? 'active' : ''}
            onClick={() => setTab('auto')}
            title={t('ui.inspector.tabs.selectionTitle')}
          >
            {t('ui.inspector.tabs.selection')}
          </button>
          <button
            className={tab === 'camera' ? 'active' : ''}
            onClick={() => setTab('camera')}
            title={t('ui.inspector.tabs.cameraTitle')}
          >
            {t('ui.inspector.tabs.camera')}
          </button>
          <button
            className={tab === 'animate' ? 'active' : ''}
            onClick={() => setTab('animate')}
            title={t('ui.inspector.tabs.animateTitle')}
          >
            {t('ui.inspector.tabs.animate')}
          </button>
        </div>
      </div>
      {body}
    </div>
  )
}

/* --------------------------- ✨ Animate tab ---------------------------- */

/**
 * One obvious place to make things PERFORM. Single character → the full
 * motion + action libraries. A shift-click group → restyle everyone at
 * once (swap the dance, change the chase). Nothing selected → how-to.
 */
function AnimateTab({ scene, shot }: { scene: Scene; shot: Shot }): JSX.Element {
  const { t } = useTranslation()
  const selection = useStore((s) => s.selection)

  if (selection?.kind === 'entity') {
    const entity = scene.entities.find((e) => e.id === selection.entityId)
    if (!entity) return <div className="panel-section">{t('ui.inspector.entityNotFound')}</div>
    return (
      <div>
        <div className="panel-section">
          <div className="panel-title">
            {t('ui.inspector.animate.animating', { name: entity.label?.text || entity.name })}
          </div>
          <p style={{ color: 'var(--text-faint)', fontSize: 11, lineHeight: 1.4 }}>
            {t('ui.inspector.animate.presetsHint')}
          </p>
        </div>
        {entity.assetId.startsWith('person.') && (
          <MotionPresetsSection scene={scene} shot={shot} entity={entity} />
        )}
        <ActionPresetsSection scene={scene} shot={shot} entity={entity} />
      </div>
    )
  }

  if (selection?.kind === 'entities') {
    return <GroupAnimateSection entityIds={selection.entityIds} />
  }

  return (
    <div className="panel-section">
      <div className="panel-title">{t('ui.inspector.animate.title')}</div>
      <p style={{ color: 'var(--text-dim)', fontSize: 12, lineHeight: 1.6 }}>
        <Trans i18nKey="ui.inspector.animate.emptyHint" components={{ b: <b /> }} />
      </p>
    </div>
  )
}

/** Restyle a whole selected group in one click. */
function GroupAnimateSection({ entityIds }: { entityIds: string[] }): JSX.Element {
  const { t } = useTranslation()
  const scene = useStore((s) => s.scene())
  const applyMotionToEntities = useStore((s) => s.applyMotionToEntities)
  const applyActionToEntities = useStore((s) => s.applyActionToEntities)
  const [motionId, setMotionId] = useState(MOTION_PRESETS[0]!.id)
  const [actionId, setActionId] = useState(ACTION_PRESETS[0]!.id)

  const people = entityIds.filter((id) =>
    scene?.entities.find((e) => e.id === id)?.assetId.startsWith('person.')
  )
  const motionCats = [...new Set(MOTION_PRESETS.map((p) => p.category))]
  const actionCats = [...new Set(ACTION_PRESETS.map((p) => p.category))]

  return (
    <div>
      <div className="panel-section">
        <div className="panel-title">{t('ui.inspector.animate.groupTitle', { count: entityIds.length })}</div>
        <p style={{ color: 'var(--text-faint)', fontSize: 11, lineHeight: 1.4 }}>
          {t('ui.inspector.animate.groupHint')}
        </p>
      </div>
      {people.length > 0 && (
        <div className="panel-section">
          <div className="panel-title">
            {t('ui.inspector.animate.everyonePerforms', { count: people.length })}
          </div>
          <div className="field">
            <select value={motionId} onChange={(e) => setMotionId(e.target.value)}>
              {motionCats.map((cat) => (
                <optgroup key={cat} label={motionCategoryLabel(cat)}>
                  {MOTION_PRESETS.filter((p) => p.category === cat).map((p) => (
                    <option key={p.id} value={p.id}>
                      {motionLabel(p)}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
          <button
            className="btn primary"
            style={{ width: '100%' }}
            onClick={() => applyMotionToEntities(people, motionId)}
          >
            {t('ui.inspector.animate.applyToAll', { count: people.length })}
          </button>
        </div>
      )}
      <div className="panel-section">
        <div className="panel-title">
          {t('ui.inspector.animate.everyoneTravels', { count: entityIds.length })}
        </div>
        <div className="field">
          <select value={actionId} onChange={(e) => setActionId(e.target.value)}>
            {actionCats.map((cat) => (
              <optgroup key={cat} label={actionCategoryLabel(cat)}>
                {ACTION_PRESETS.filter((p) => p.category === cat).map((p) => (
                  <option key={p.id} value={p.id}>
                    {actionLabel(p)}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
        <button
          className="btn"
          style={{ width: '100%' }}
          onClick={() => applyActionToEntities(entityIds, actionId)}
          title={t('ui.inspector.animate.applyPathToAllTitle')}
        >
          {t('ui.inspector.animate.applyPathToAll')}
        </button>
      </div>
    </div>
  )
}

/* ------------------------------ helpers -------------------------------- */

function useMutate(): (label: string, fn: (doc: ProjectDoc) => void) => void {
  return useStore((s) => s.mutate)
}

function findScene(doc: ProjectDoc, sceneId: string): Scene | undefined {
  return doc.scenes.find((s) => s.id === sceneId)
}
function findShot(doc: ProjectDoc, sceneId: string, shotId: string): Shot | undefined {
  return findScene(doc, sceneId)?.shots.find((s) => s.id === shotId)
}
/** Find a shot that may live in scene.shots OR scene.drafts (a draft is the current shot). */
function findShotOrDraft(doc: ProjectDoc, sceneId: string, shotId: string): Shot | undefined {
  const sc = findScene(doc, sceneId)
  return sc?.shots.find((s) => s.id === shotId) ?? sc?.drafts?.find((s) => s.id === shotId)
}
function findEntity(doc: ProjectDoc, sceneId: string, entityId: string): Entity | undefined {
  return findScene(doc, sceneId)?.entities.find((e) => e.id === entityId)
}

/* =========================== A) Scene =============================== */

function SceneInspector({ scene, shot }: { scene: Scene; shot: Shot }): JSX.Element {
  const { t } = useTranslation()
  const mode = useStore((s) => s.mode)
  const mutate = useMutate()
  const env = scene.environment

  const setEnv = (label: string, fn: (e: Scene['environment']) => void): void => {
    mutate(label, (doc) => {
      const sc = findScene(doc, scene.id)
      if (sc) fn(sc.environment)
    })
  }

  return (
    <div>
      <div className="panel-section">
        <div className="panel-title">{t('ui.inspector.scene.title')}</div>
        <div className="field">
          <label>{t('ui.inspector.scene.name')}</label>
          <input
            type="text"
            value={scene.name}
            onChange={(e) =>
              mutate('scene name', (doc) => {
                const sc = findScene(doc, scene.id)
                if (sc) sc.name = e.target.value
              })
            }
          />
        </div>
        {mode === 'stage' && (
          <p style={{ color: 'var(--text-faint)', fontSize: 12, lineHeight: 1.5 }}>
            {t('ui.inspector.scene.stageHint')}
          </p>
        )}
      </div>

      <div className="panel-section">
        <div className="panel-title">{t('ui.inspector.scene.lighting')}</div>
        <div className="seg" style={{ marginBottom: 10 }}>
          {LIGHTING_IDS.map((id) => (
            <button
              key={id}
              className={env.lighting === id ? 'active' : ''}
              onClick={() => setEnv('lighting', (e) => (e.lighting = id))}
            >
              {t(`ui.inspector.scene.lightingPresets.${id}`)}
            </button>
          ))}
        </div>
        <div className="field">
          <label>{t('ui.inspector.scene.sunAzimuth')}</label>
          <input
            type="range"
            min={0}
            max={Math.PI * 2}
            step={0.01}
            value={env.sunAzimuth}
            onChange={(e) => {
              const v = num(e.target.value)
              if (v !== null) setEnv('sun azimuth', (env2) => (env2.sunAzimuth = v))
            }}
          />
        </div>
        <div className="field">
          <label>{t('ui.inspector.scene.sunElevation')}</label>
          <input
            type="range"
            min={0.1}
            max={1.5}
            step={0.01}
            value={env.sunElevation}
            onChange={(e) => {
              const v = num(e.target.value)
              if (v !== null) setEnv('sun elevation', (env2) => (env2.sunElevation = v))
            }}
          />
        </div>
        <div className="field">
          <label>{t('ui.inspector.scene.fog')}</label>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={env.fog}
            onChange={(e) => {
              const v = num(e.target.value)
              if (v !== null) setEnv('fog', (env2) => (env2.fog = v))
            }}
          />
        </div>
      </div>

      <ShotSection scene={scene} shot={shot} />
    </div>
  )
}

function ShotSection({ scene, shot }: { scene: Scene; shot: Shot }): JSX.Element {
  const { t } = useTranslation()
  const mutate = useMutate()
  const setTime = useStore((s) => s.setTime)
  const time = useStore((s) => s.time)

  return (
    <div className="panel-section">
      <div className="panel-title">{t('ui.inspector.shot.title')}</div>
      <div className="field">
        <label>{t('ui.inspector.shot.duration')}</label>
        <input
          type="number"
          min={0.5}
          max={60}
          step={0.5}
          value={shot.duration}
          onChange={(e) => {
            const v = num(e.target.value)
            if (v === null) return
            const next = clamp(v, 0.5, 60)
            mutate('shot duration', (doc) => {
              const sh = findShot(doc, scene.id, shot.id)
              if (!sh) return
              // Duration only — never clamp marks: the blocking take is
              // shared across shots (coverage model) and out-of-range marks
              // are harmless to the evaluator.
              sh.duration = next
            })
            if (time > next) setTime(next)
          }}
        />
      </div>
      <div className="field">
        <label>{t('ui.inspector.shot.aspect')}</label>
        <div className="seg">
          {ASPECTS.map((a) => (
            <button
              key={a}
              className={shot.aspect === a ? 'active' : ''}
              onClick={() =>
                mutate('shot aspect', (doc) => {
                  const sh = findShot(doc, scene.id, shot.id)
                  if (sh) sh.aspect = a
                })
              }
            >
              {a}
            </button>
          ))}
        </div>
      </div>
      <div className="field">
        <label>{t('ui.inspector.shot.notes')}</label>
        <textarea
          rows={3}
          value={shot.notes ?? ''}
          onChange={(e) =>
            mutate('shot notes', (doc) => {
              const sh = findShot(doc, scene.id, shot.id)
              if (sh) sh.notes = e.target.value
            })
          }
        />
      </div>
    </div>
  )
}

/* =========================== B) Entity ============================= */

function EntityInspector({
  scene,
  shot,
  entityId
}: {
  scene: Scene
  shot: Shot
  entityId: string
}): JSX.Element {
  const { t } = useTranslation()
  const mode = useStore((s) => s.mode)
  const mutate = useMutate()
  const setSelection = useStore((s) => s.setSelection)
  const setDroppingMarks = useStore((s) => s.setDroppingMarks)

  const entity = scene.entities.find((e) => e.id === entityId)
  if (!entity) return <div className="panel-section">{t('ui.inspector.entityNotFound')}</div>

  const isPerson = entity.assetId.startsWith('person.')

  const editEntity = (label: string, fn: (e: Entity) => void): void => {
    mutate(label, (doc) => {
      const en = findEntity(doc, scene.id, entityId)
      if (en) fn(en)
    })
  }

  const heightParam = typeof entity.params?.height === 'number' ? entity.params.height : 1
  const buildParam = typeof entity.params?.build === 'number' ? entity.params.build : 1

  // Marks for this entity in the current take.
  const take = scene.blocking.find((b) => b.id === shot.blockingTakeId)
  const track = take?.tracks.find((t) => t.entityId === entityId)
  const marks = [...(track?.marks ?? [])].sort((a, b) => a.time - b.time)

  return (
    <div>
      <div className="panel-section">
        <div className="panel-title">{t('ui.inspector.entity.title')}</div>
        <div className="field">
          <label>{t('ui.inspector.entity.name')}</label>
          <input
            type="text"
            value={entity.name}
            onChange={(e) => editEntity('entity name', (en) => (en.name = e.target.value))}
          />
        </div>
        <div className="field-row">
          <div className="field" style={{ flex: 1 }}>
            <label>{t('ui.inspector.entity.x')}</label>
            <input
              type="number"
              step={0.1}
              value={entity.transform.position.x}
              onChange={(e) => {
                const v = num(e.target.value)
                if (v !== null) editEntity('move entity', (en) => (en.transform.position.x = v))
              }}
            />
          </div>
          <div className="field" style={{ flex: 1 }}>
            <label>{t('ui.inspector.entity.y')}</label>
            <input
              type="number"
              step={0.1}
              value={entity.transform.position.y}
              onChange={(e) => {
                const v = num(e.target.value)
                if (v !== null) editEntity('move entity', (en) => (en.transform.position.y = v))
              }}
            />
          </div>
          <div className="field" style={{ flex: 1 }}>
            <label>{t('ui.inspector.entity.z')}</label>
            <input
              type="number"
              step={0.1}
              value={entity.transform.position.z}
              onChange={(e) => {
                const v = num(e.target.value)
                if (v !== null) editEntity('move entity', (en) => (en.transform.position.z = v))
              }}
            />
          </div>
        </div>
        <div className="field">
          <label>{t('ui.inspector.entity.rotation')}</label>
          <input
            type="number"
            step={1}
            value={toDeg(entity.transform.rotationY)}
            onChange={(e) => {
              const v = num(e.target.value)
              if (v !== null) editEntity('rotate entity', (en) => (en.transform.rotationY = toRad(v)))
            }}
          />
        </div>
        <div className="field">
          <label>{t('ui.inspector.entity.scale', { value: entity.transform.scale.toFixed(2) })}</label>
          <input
            type="range"
            min={0.3}
            max={3}
            step={0.01}
            value={entity.transform.scale}
            onChange={(e) => {
              const v = num(e.target.value)
              if (v !== null) editEntity('scale entity', (en) => (en.transform.scale = v))
            }}
          />
        </div>
        {isPerson && (
          <>
            <div className="field">
              <label>{t('ui.inspector.entity.height', { value: heightParam.toFixed(2) })}</label>
              <input
                type="range"
                min={0.8}
                max={1.2}
                step={0.01}
                value={heightParam}
                onChange={(e) => {
                  const v = num(e.target.value)
                  if (v !== null)
                    editEntity('entity height', (en) => {
                      en.params = { ...en.params, height: v }
                    })
                }}
              />
            </div>
            <div className="field">
              <label>{t('ui.inspector.entity.build', { value: buildParam.toFixed(2) })}</label>
              <input
                type="range"
                min={0.8}
                max={1.3}
                step={0.01}
                value={buildParam}
                onChange={(e) => {
                  const v = num(e.target.value)
                  if (v !== null)
                    editEntity('entity build', (en) => {
                      en.params = { ...en.params, build: v }
                    })
                }}
              />
            </div>
          </>
        )}
        <div className="field">
          <label>
            <input
              type="checkbox"
              checked={entity.excludeFromExport === true}
              onChange={(e) => {
                const hide = e.target.checked
                editEntity('hide in exports', (en) => {
                  if (hide) en.excludeFromExport = true
                  else delete en.excludeFromExport
                })
              }}
              style={{ width: 'auto', marginRight: 6 }}
            />
            {t('ui.inspector.entity.hideInExports')}
          </label>
        </div>
      </div>

      {isPerson && <PoseSection entity={entity} editEntity={editEntity} />}

      <MarriageSection scene={scene} entity={entity} />


      <div className="panel-section">
        <div className="panel-title">{t('ui.inspector.entity.label')}</div>
        <div className="field-row" style={{ marginBottom: 8 }}>
          <input
            type="text"
            placeholder={t('ui.inspector.entity.labelPlaceholder')}
            value={entity.label?.text ?? ''}
            onChange={(e) => {
              const text = e.target.value
              editEntity('entity label', (en) => {
                if (text.trim() === '') {
                  delete en.label
                } else {
                  en.label = { text, color: en.label?.color ?? '#f5a524' }
                }
              })
            }}
          />
          <input
            type="color"
            value={entity.label?.color ?? '#f5a524'}
            onChange={(e) => {
              const color = e.target.value
              editEntity('label color', (en) => {
                en.label = { text: en.label?.text ?? '', color }
              })
            }}
          />
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {SWATCHES.map((c) => (
            <button
              key={c}
              className="swatch"
              style={{ background: c }}
              onClick={() =>
                editEntity('label color', (en) => {
                  en.label = { text: en.label?.text ?? '', color: c }
                })
              }
            />
          ))}
        </div>
      </div>

      {mode === 'shoot' && (
        <div className="panel-section">
          <div className="panel-title">{t('ui.inspector.entity.blocking')}</div>
          <button
            className="btn"
            style={{ width: '100%', marginBottom: 8 }}
            onClick={() => setDroppingMarks(true)}
          >
            {t('ui.inspector.entity.dropMarks')}
          </button>
          {marks.map((m, i) => (
            <div
              key={m.id}
              className="mark-row"
              onClick={() => setSelection({ kind: 'mark', entityId, markId: m.id })}
            >
              {t('ui.inspector.entity.markRow', {
                index: i + 1,
                time: m.time.toFixed(1),
                gait: gaitLabel((m as ActorMark).gait)
              })}
            </div>
          ))}
        </div>
      )}

      {mode === 'shoot' && entity.assetId.startsWith('person.') && (
        <MotionPresetsSection scene={scene} shot={shot} entity={entity} />
      )}

      {mode === 'shoot' && <ActionPresetsSection scene={scene} shot={shot} entity={entity} />}

      <div className="panel-section">
        <div className="panel-title">{t('ui.inspector.entity.dangerZone')}</div>
        <button
          className="btn danger"
          style={{ width: '100%' }}
          onClick={() => {
            mutate('delete entity', (doc) => {
              const sc = findScene(doc, scene.id)
              if (!sc) return
              sc.entities = sc.entities.filter((e) => e.id !== entityId)
              for (const take2 of sc.blocking) {
                take2.tracks = take2.tracks.filter((t) => t.entityId !== entityId)
              }
              // Unmount any camera parented to the deleted entity — its
              // local-frame marks would otherwise re-base to world space.
              for (const sh of sc.shots) {
                if (sh.camera.mountEntityId === entityId) delete sh.camera.mountEntityId
              }
            })
            setSelection(null)
          }}
        >
          {t('ui.inspector.entity.deleteEntity')}
        </button>
      </div>
    </div>
  )
}

/* ------------------------- motion presets ------------------------------ */

const MOTION_CATEGORIES: MotionPreset['category'][] = ['fight', 'dance', 'gesture', 'stunt']

/**
 * Mixamo-style motion library: applying a preset lays down pose keyframes
 * as marks starting at the playhead — punch, dance, dodge without hand-
 * animating every joint. Marks stay editable afterwards.
 */
function MotionPresetsSection({
  scene,
  shot,
  entity
}: {
  scene: Scene
  shot: Shot
  entity: Entity
}): JSX.Element {
  const { t } = useTranslation()
  const mutate = useMutate()
  const time = useStore((s) => s.time)
  const toast = useStore((s) => s.toast)
  const [category, setCategory] = useState<MotionPreset['category']>('fight')

  const apply = (preset: MotionPreset): void => {
    // Where the character stands at the playhead — the motion plays from
    // there. Keyframe `move` offsets (jump height, crawl distance, stair
    // climb) are applied along the character's heading.
    const state = new ShotEvaluator(scene, shot).evaluate(time)
    const es = state.entities.find((e) => e.entityId === entity.id)
    const pos = es
      ? { x: es.position.x, y: es.position.y, z: es.position.z }
      : { ...entity.transform.position }
    const heading = es?.heading ?? entity.transform.rotationY
    const fwd = { x: -Math.sin(heading), z: -Math.cos(heading) }
    let added = 0
    mutate(`motion: ${preset.name}`, (doc) => {
      const sc = findScene(doc, scene.id)
      const sh = findShot(doc, scene.id, shot.id)
      const take = sc?.blocking.find((b) => b.id === sh?.blockingTakeId)
      if (!sc || !sh || !take) return
      let track = take.tracks.find((t) => t.entityId === entity.id)
      if (!track) {
        track = { entityId: entity.id, marks: [] }
        take.tracks.push(track)
      }
      for (const kf of preset.keyframes) {
        const t = time + kf.t
        if (t > sh.duration + 1e-6) break
        const forward = kf.move?.forward ?? 0
        const up = kf.move?.up ?? 0
        track.marks.push({
          id: newId('mark'),
          time: t,
          hold: 0,
          easeIn: 0,
          easeOut: 0,
          position: {
            x: pos.x + fwd.x * forward,
            y: Math.max(0, pos.y + up),
            z: pos.z + fwd.z * forward
          },
          gait: 'stand',
          joints: { ...kf.joints }
        })
        added++
      }
    })
    if (added > 0) {
      toast(
        t('toasts.motionApplied', {
          name: motionLabel(preset),
          time: time.toFixed(1),
          count: added,
          extendNote:
            added < preset.keyframes.length ? t('toasts.motionExtendNote') : ''
        }),
        'success'
      )
    } else {
      toast(t('toasts.motionNoRoom'), 'info')
    }
  }

  const items = MOTION_PRESETS.filter((p) => p.category === category)
  return (
    <div className="panel-section">
      <div className="panel-title">{t('ui.inspector.motionPresets.title')}</div>
      <div className="seg" style={{ marginBottom: 8 }}>
        {MOTION_CATEGORIES.map((c) => (
          <button
            key={c}
            className={category === c ? 'active' : ''}
            onClick={() => setCategory(c)}
          >
            {t(`ui.inspector.motionPresets.categories.${c}`)}
          </button>
        ))}
      </div>
      {items.map((p) => (
        <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
          <span style={{ flex: 1, fontSize: 12 }}>
            {motionLabel(p)}
            <span style={{ opacity: 0.55 }}>
              {t('ui.inspector.motionPresets.durationSuffix', { duration: p.duration.toFixed(1) })}
            </span>
          </span>
          <button
            className="btn small"
            onClick={() => apply(p)}
            title={t('ui.inspector.motionPresets.applyTitle', { name: motionLabel(p) })}
          >
            {t('ui.inspector.motionPresets.apply')}
          </button>
        </div>
      ))}
    </div>
  )
}

/* --------------------------- action presets ---------------------------- */

/**
 * Motion-path presets for anything that flies, drives, falls, or gets
 * thrown: plane takeoffs and landings, helicopter orbits, bird swoops, car
 * chases, collapsing debris. Applying one lays a full flight/drive path of
 * marks (with altitude) from the entity's pose at the playhead.
 */
function ActionPresetsSection({
  scene,
  shot,
  entity
}: {
  scene: Scene
  shot: Shot
  entity: Entity
}): JSX.Element {
  const { t } = useTranslation()
  const mutate = useMutate()
  const time = useStore((s) => s.time)
  const toast = useStore((s) => s.toast)
  const [presetId, setPresetId] = useState(ACTION_PRESETS[0]!.id)
  const preset = ACTION_PRESETS.find((p) => p.id === presetId)
  const categories = [...new Set(ACTION_PRESETS.map((p) => p.category))]

  const apply = (): void => {
    if (!preset) return
    const remaining = shot.duration - time
    if (remaining < 1) {
      toast(t('toasts.actionNotEnoughRoom'), 'info')
      return
    }
    // Pose at the playhead: the path starts where the entity IS.
    const state = new ShotEvaluator(scene, shot).evaluate(time)
    const es = state.entities.find((e) => e.entityId === entity.id)
    const start = es
      ? { x: es.position.x, y: es.position.y, z: es.position.z, heading: es.heading }
      : {
          x: entity.transform.position.x,
          y: entity.transform.position.y,
          z: entity.transform.position.z,
          heading: entity.transform.rotationY
        }
    const specs = preset.generate({ start, duration: remaining })
    mutate(`action: ${preset.name}`, (doc) => {
      const sc = findScene(doc, scene.id)
      const sh = findShot(doc, scene.id, shot.id)
      const take = sc?.blocking.find((b) => b.id === sh?.blockingTakeId)
      if (!sc || !take) return
      let track = take.tracks.find((t) => t.entityId === entity.id)
      if (!track) {
        track = { entityId: entity.id, marks: [] }
        take.tracks.push(track)
      }
      // The action owns the timeline from the playhead on — clear the way.
      track.marks = track.marks.filter((m) => m.time < time - 1e-6)
      for (const spec of specs) {
        track.marks.push({
          id: newId('mark'),
          time: time + spec.time,
          hold: spec.hold,
          easeIn: spec.easeIn,
          easeOut: spec.easeOut,
          position: { ...spec.position },
          gait: spec.gait
        })
      }
    })
    toast(
      t('toasts.actionApplied', { name: actionLabel(preset), time: time.toFixed(1) }),
      'success'
    )
  }

  return (
    <div className="panel-section">
      <div className="panel-title">{t('ui.inspector.actionPresets.title')}</div>
      <div className="field">
        <label>{t('ui.inspector.actionPresets.label')}</label>
        <select value={presetId} onChange={(e) => setPresetId(e.target.value)}>
          {categories.map((cat) => (
            <optgroup key={cat} label={actionCategoryLabel(cat).toUpperCase()}>
              {ACTION_PRESETS.filter((p) => p.category === cat).map((p) => (
                <option key={p.id} value={p.id}>
                  {actionLabel(p)}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>
      {preset && (
        <p style={{ color: 'var(--text-faint)', fontSize: 11, lineHeight: 1.4, marginBottom: 8 }}>
          {actionDescription(preset)}
        </p>
      )}
      <button className="btn primary" style={{ width: '100%' }} onClick={apply}>
        {t('ui.inspector.actionPresets.apply')}
      </button>
    </div>
  )
}

/* ---------------------------- marriage --------------------------------- */

function MarriageSection({ scene, entity }: { scene: Scene; entity: Entity }): JSX.Element {
  const { t } = useTranslation()
  const unmarryEntities = useStore((s) => s.unmarryEntities)
  const marryEntities = useStore((s) => s.marryEntities)

  const parent = entity.attachedTo
    ? scene.entities.find((e) => e.id === entity.attachedTo)
    : undefined
  const parentName = parent ? parent.label?.text || parent.name : entity.attachedTo

  return (
    <div className="panel-section">
      <div className="panel-title">{t('ui.inspector.marriage.title')}</div>
      {entity.attachedTo ? (
        <>
          <p style={{ color: 'var(--text-dim)', fontSize: 12, marginBottom: 4 }}>
            {t('ui.inspector.marriage.marriedTo', { name: parentName })}
          </p>
          <p style={{ color: 'var(--text-faint)', fontSize: 11, lineHeight: 1.4, marginBottom: 8 }}>
            {t('ui.inspector.marriage.marriedHint')}
          </p>
          <button
            className="btn"
            style={{ width: '100%' }}
            onClick={() => unmarryEntities([entity.id])}
          >
            {t('ui.inspector.marriage.unmarry')}
          </button>
        </>
      ) : (
        <div className="field">
          <label>{t('ui.inspector.marriage.marryTo')}</label>
          <select
            value=""
            onChange={(e) => {
              const id = e.target.value
              if (id) marryEntities([entity.id], id)
            }}
          >
            <option value="">{t('ui.inspector.marriage.chooseAnchor')}</option>
            {scene.entities
              .filter((e) => e.id !== entity.id)
              .map((e) => (
                <option key={e.id} value={e.id}>
                  {e.label?.text || e.name}
                </option>
              ))}
          </select>
        </div>
      )}
    </div>
  )
}

/* ===================== B2) Multi-entity selection ==================== */

function MultiEntityInspector({
  scene,
  entityIds
}: {
  scene: Scene
  entityIds: string[]
}): JSX.Element {
  const { t } = useTranslation()
  const mutate = useMutate()
  const setSelection = useStore((s) => s.setSelection)
  const marryEntities = useStore((s) => s.marryEntities)
  const unmarryEntities = useStore((s) => s.unmarryEntities)

  const entities = entityIds
    .map((id) => scene.entities.find((e) => e.id === id))
    .filter((e): e is Entity => e != null)

  const anchor = entities[entities.length - 1]
  const anchorName = anchor ? anchor.label?.text || anchor.name : '—'
  const anyMarried = entities.some((e) => e.attachedTo)

  return (
    <div>
      <div className="panel-section">
        <div className="panel-title">{t('ui.inspector.multiEntity.selected', { count: entities.length })}</div>
        {entities.map((e) => (
          <div key={e.id} style={{ color: 'var(--text-dim)', fontSize: 11, padding: '2px 0' }}>
            {e.label?.text || e.name}
          </div>
        ))}
      </div>

      {entities.length >= 2 && (
        <div className="panel-section">
          <div className="panel-title">{t('ui.inspector.marriage.title')}</div>
          <p style={{ color: 'var(--text-faint)', fontSize: 11, lineHeight: 1.4, marginBottom: 8 }}>
            {t('ui.inspector.multiEntity.marryHint')}
          </p>
          <button
            className="btn primary"
            style={{ width: '100%', marginBottom: anyMarried ? 8 : 0 }}
            onClick={() => marryEntities(entityIds.slice(0, -1), entityIds[entityIds.length - 1]!)}
          >
            {t('ui.inspector.multiEntity.marryTo', { name: anchorName })}
          </button>
          {anyMarried && (
            <button
              className="btn"
              style={{ width: '100%' }}
              onClick={() => unmarryEntities(entityIds)}
            >
              {t('ui.inspector.multiEntity.unmarrySelected')}
            </button>
          )}
        </div>
      )}

      <div className="panel-section">
        <div className="panel-title">{t('ui.inspector.entity.dangerZone')}</div>
        <button
          className="btn danger"
          style={{ width: '100%' }}
          onClick={() => {
            const idSet = new Set(entityIds)
            mutate('delete entities', (doc) => {
              const sc = findScene(doc, scene.id)
              if (!sc) return
              sc.entities = sc.entities.filter((e) => !idSet.has(e.id))
              // Clean blocking tracks for the removed entities.
              for (const take of sc.blocking) {
                take.tracks = take.tracks.filter((t) => !idSet.has(t.entityId))
              }
              // Widow any attachedTo pointers into the removed set.
              for (const e of sc.entities) {
                if (e.attachedTo && idSet.has(e.attachedTo)) {
                  delete e.attachedTo
                  delete e.attachedLocal
                }
              }
              // Clear camera mounts across both shots and drafts.
              const clearMounts = (shots: Shot[] | undefined): void => {
                for (const sh of shots ?? []) {
                  if (sh.camera.mountEntityId && idSet.has(sh.camera.mountEntityId)) {
                    delete sh.camera.mountEntityId
                  }
                  for (const b of sh.cameraBank ?? []) {
                    if (b.camera.mountEntityId && idSet.has(b.camera.mountEntityId)) {
                      delete b.camera.mountEntityId
                    }
                  }
                }
              }
              clearMounts(sc.shots)
              clearMounts(sc.drafts)
            })
            setSelection(null)
          }}
        >
          {t('ui.inspector.multiEntity.deleteEntities', { count: entities.length })}
        </button>
      </div>
    </div>
  )
}

/* ===================== D2) Multi-mark selection ===================== */

function MultiMarkInspector({
  scene,
  shot,
  entityId,
  markIds
}: {
  scene: Scene
  shot: Shot
  entityId: string | 'camera'
  markIds: string[]
}): JSX.Element {
  const { t } = useTranslation()
  const mutate = useMutate()
  const [offset, setOffset] = useState(0)

  const isCamera = entityId === 'camera'
  const allLanes = entityId === '*' // "select all marks" spans every lane
  const idSet = new Set(markIds)

  /** Every mark array this selection can touch (camera and/or tracks). */
  const eachTargetList = (
    doc: ProjectDoc,
    fn: (marks: { id: string; time: number }[]) => void
  ): void => {
    const sh = findShotOrDraft(doc, scene.id, shot.id)
    if (!sh) return
    if (allLanes || isCamera) fn(sh.camera.marks)
    if (allLanes || !isCamera) {
      const sc = findScene(doc, scene.id)
      const tk = sc?.blocking.find((b) => b.id === sh.blockingTakeId)
      for (const tr of tk?.tracks ?? []) {
        if (allLanes || tr.entityId === entityId) fn(tr.marks)
      }
    }
  }

  return (
    <div>
      <div className="panel-section">
        <div className="panel-title">{t('ui.inspector.multiMark.selected', { count: markIds.length })}</div>
      </div>

      <div className="panel-section">
        <div className="panel-title">{t('ui.inspector.multiMark.shiftTimes')}</div>
        <div className="field-row">
          <div className="field" style={{ flex: 1 }}>
            <label>{t('ui.inspector.multiMark.offset')}</label>
            <input
              type="number"
              step={0.1}
              value={offset}
              onChange={(e) => {
                const v = num(e.target.value)
                if (v !== null) setOffset(v)
              }}
            />
          </div>
          <button
            className="btn"
            style={{ alignSelf: 'flex-end' }}
            onClick={() => {
              mutate('shift marks', (doc) => {
                eachTargetList(doc, (marks) => {
                  for (const m of marks) {
                    if (idSet.has(m.id)) m.time = Math.max(0, m.time + offset)
                  }
                })
              })
            }}
          >
            {t('ui.inspector.multiMark.apply')}
          </button>
        </div>
      </div>

      <div className="panel-section">
        <button
          className="btn danger"
          style={{ width: '100%' }}
          onClick={() => useStore.getState().deleteSelectedMarks()}
        >
          {t('ui.inspector.multiMark.deleteMarks', { count: markIds.length })}
        </button>
      </div>
    </div>
  )
}

/* ------------------------ camera pose fields ------------------------ */

/**
 * Direct numeric control of the camera: position, aim, and lens of the
 * ACTIVE camera mark (the one at/before the playhead) — always available
 * from the pinned 🎥 Camera tab, no viewport clicking required.
 */
function CameraPoseSection({ scene, shot }: { scene: Scene; shot: Shot }): JSX.Element {
  const { t } = useTranslation()
  const mutate = useMutate()
  const time = useStore((s) => s.time)

  const ordered = [...shot.camera.marks].sort((a, b) => a.time - b.time)
  let active: CameraMark | undefined = ordered[0]
  for (const m of ordered) if (m.time <= time + 1e-6) active = m

  const editActive = (label: string, fn: (m: CameraMark) => void): void => {
    if (!active) return
    const id = active.id
    mutate(label, (doc) => {
      const sh = findShotOrDraft(doc, scene.id, shot.id)
      const m = sh?.camera.marks.find((x) => x.id === id)
      if (m) fn(m)
    })
  }

  if (!active) {
    return (
      <div className="panel-section">
        <div className="panel-title">{t('ui.inspector.camera.positionAim')}</div>
        <p style={{ color: 'var(--text-faint)', fontSize: 11, lineHeight: 1.4, marginBottom: 8 }}>
          {t('ui.inspector.camera.noMarksYet')}
        </p>
        <button
          className="btn"
          style={{ width: '100%' }}
          onClick={() => emit('dropCameraMarkAtView', {})}
        >
          {t('ui.inspector.camera.dropMarkAtView')}
        </button>
      </div>
    )
  }

  const numField = (
    label: string,
    value: number,
    step: number,
    apply: (m: CameraMark, v: number) => void,
    unit?: string
  ): JSX.Element => (
    <div className="field" style={{ flex: 1 }}>
      <label>
        {label}
        {unit ? ` (${unit})` : ''}
      </label>
      <input
        type="number"
        step={step}
        value={Number(value.toFixed(2))}
        onChange={(e) => {
          const v = num(e.target.value)
          if (v !== null) editActive(`camera ${label.toLowerCase()}`, (m) => apply(m, v))
        }}
      />
    </div>
  )

  const markIndex = ordered.findIndex((m) => m.id === active!.id) + 1
  return (
    <div className="panel-section">
      <div className="panel-title">
        {t('ui.inspector.camera.positionAimMark', { index: markIndex, total: ordered.length })}
      </div>
      <div className="field-row">
        {numField(t('ui.inspector.entity.x'), active.position.x, 0.1, (m, v) => (m.position.x = v))}
        {numField(t('ui.inspector.camera.height'), active.position.y, 0.1, (m, v) => (m.position.y = Math.max(0, v)))}
        {numField(t('ui.inspector.entity.z'), active.position.z, 0.1, (m, v) => (m.position.z = v))}
      </div>
      <div className="field-row">
        {numField(t('ui.inspector.camera.pan'), toDeg(active.pan), 1, (m, v) => (m.pan = toRad(v)), '°')}
        {numField(t('ui.inspector.camera.tilt'), toDeg(active.tilt), 1, (m, v) => (m.tilt = toRad(clamp(v, -89, 89))), '°')}
        {numField(t('ui.inspector.camera.roll'), toDeg(active.roll), 1, (m, v) => (m.roll = toRad(clamp(v, -180, 180))), '°')}
      </div>
      <div className="field-row">
        {numField(t('ui.inspector.camera.lensMm'), active.focalLength, 1, (m, v) => (m.focalLength = clamp(v, 8, 300)), 'mm')}
        {numField(t('ui.inspector.camera.atTime'), active.time, 0.1, (m, v) => (m.time = clamp(v, 0, shot.duration)), 's')}
      </div>
      <p style={{ color: 'var(--text-faint)', fontSize: 11, lineHeight: 1.4 }}>
        {t('ui.inspector.camera.positionAimHint')}
      </p>
    </div>
  )
}

/* ----------------------- camera move presets ------------------------ */

/**
 * Classic camera moves as one-click starting points: pick one, it lays down
 * a full set of marks built around your subject (riding along if the subject
 * moves), then every mark stays editable. Track-style moves also switch on
 * the aim lock.
 */
function CameraMovesSection({ scene }: { scene: Scene }): JSX.Element {
  const { t } = useTranslation()
  const [presetId, setPresetId] = useState(CAMERA_MOVE_PRESETS[0]!.id)
  const selection = useStore((s) => s.selection)
  const preset = CAMERA_MOVE_PRESETS.find((p) => p.id === presetId)

  const categories = [...new Set(CAMERA_MOVE_PRESETS.map((p) => p.category))]
  const subjectHint =
    selection?.kind === 'entity'
      ? scene.entities.find((e) => e.id === selection.entityId)
      : scene.entities.find((e) => e.assetId.startsWith('person.'))

  return (
    <div className="panel-section">
      <div className="panel-title">{t('ui.inspector.camera.movesTitle')}</div>
      <div className="field">
        <label>
          {t('ui.inspector.camera.movesLabel', {
            count: CAMERA_MOVE_PRESETS.length,
            subject: subjectHint
              ? subjectHint.label?.text || subjectHint.name
              : t('ui.inspector.camera.yourSubject')
          })}
        </label>
        <select value={presetId} onChange={(e) => setPresetId(e.target.value)}>
          {categories.map((cat) => (
            <optgroup key={cat} label={cameraMoveCategoryLabel(cat).toUpperCase()}>
              {CAMERA_MOVE_PRESETS.filter((p) => p.category === cat).map((p) => (
                <option key={p.id} value={p.id}>
                  {cameraMoveLabel(p)}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>
      {preset && (
        <p style={{ color: 'var(--text-faint)', fontSize: 11, lineHeight: 1.4, marginBottom: 8 }}>
          {cameraMoveDescription(preset)}
          {preset.track ? t('ui.inspector.camera.aimLocksSuffix') : ''}
        </p>
      )}
      <button
        className="btn primary"
        style={{ width: '100%' }}
        onClick={() => getSceneManager()?.applyCameraMove(presetId)}
        title={t('ui.inspector.camera.applyMoveTitle')}
      >
        {t('ui.inspector.camera.applyMove')}
      </button>
    </div>
  )
}

/* =========================== C) Camera ============================= */

function CameraInspector({ scene, shot }: { scene: Scene; shot: Shot }): JSX.Element {
  const { t } = useTranslation()
  const mutate = useMutate()
  const setSelection = useStore((s) => s.setSelection)
  const switchCamera = useStore((s) => s.switchCamera)
  const addCameraToShot = useStore((s) => s.addCameraToShot)
  const clearCameraMarks = useStore((s) => s.clearCameraMarks)

  const cam = shot.camera
  const orderedMarks = [...cam.marks].sort((a, b) => a.time - b.time)
  const lastMark = orderedMarks[orderedMarks.length - 1]
  const currentFocal = lastMark?.focalLength ?? 35
  const rigSpec = RIGS[cam.rig]
  const activeCamName = shot.cameraName ?? 'A'

  // A camera edit may target the current shot even when it is a draft.
  const editCam = (label: string, fn: (c: Shot['camera']) => void): void => {
    mutate(label, (doc) => {
      const sh = findShotOrDraft(doc, scene.id, shot.id)
      if (sh) fn(sh.camera)
    })
  }

  return (
    <div>
      <div className="panel-section">
        <div className="panel-title">{t('ui.inspector.camera.camerasTitle')}</div>
        <div className="seg">
          <button
            className="active"
            onClick={() => switchCamera(activeCamName)}
          >
            {activeCamName}
          </button>
          {(shot.cameraBank ?? []).map((b) => (
            <button key={b.name} onClick={() => switchCamera(b.name)}>
              {b.name}
            </button>
          ))}
          <button onClick={() => addCameraToShot()} title={t('ui.inspector.camera.addCameraTitle')}>
            {t('ui.inspector.camera.addCamera')}
          </button>
        </div>
      </div>

      <div className="panel-section">
        <div className="panel-title">{t('ui.inspector.camera.title')}</div>
        <div className="field">
          <label>{t('ui.inspector.camera.sensor')}</label>
          <select
            value={cam.sensorId}
            onChange={(e) => {
              const id = e.target.value as SensorId
              editCam('sensor', (c) => (c.sensorId = id))
            }}
          >
            {Object.values(SENSORS).map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label>{t('ui.inspector.camera.lens')}</label>
          <div className="seg">
            {LENS_SET.map((fl) => (
              <button
                key={fl}
                className={currentFocal === fl ? 'active' : ''}
                onClick={() => emit('setLens', { focalLength: fl })}
              >
                {fl}
              </button>
            ))}
          </div>
        </div>
        <div className="field">
          <label>{t('ui.inspector.camera.autoFrame')}</label>
          <div className="seg">
            {SHOT_SIZE_BTNS.map((sz) => (
              <button key={sz} onClick={() => emit('frameSubject', { size: sz })}>
                {sz}
              </button>
            ))}
          </div>
        </div>
      </div>

      <CameraPoseSection scene={scene} shot={shot} />

      <div className="panel-section">
        <div className="panel-title">{t('ui.inspector.camera.trackSubject')}</div>
        <div className="field">
          <label>{t('ui.inspector.camera.keepAimedAt')}</label>
          <select
            value={cam.trackEntityId ?? ''}
            onChange={(e) =>
              editCam('track subject', (c) => {
                if (e.target.value) c.trackEntityId = e.target.value
                else delete c.trackEntityId
              })
            }
            title={t('ui.inspector.camera.trackSubjectTitle')}
          >
            <option value="">{t('ui.inspector.camera.aimByMarksOff')}</option>
            {scene.entities.map((e) => (
              <option key={e.id} value={e.id}>
                {e.label?.text || e.name}
              </option>
            ))}
          </select>
        </div>
        {cam.trackEntityId && (
          <p style={{ color: 'var(--text-faint)', fontSize: 11, lineHeight: 1.4 }}>
            {t('ui.inspector.camera.trackingOnHint')}
          </p>
        )}
      </div>

      <CameraMovesSection scene={scene} />

      <div className="panel-section">
        <div className="panel-title">{t('ui.inspector.camera.rig')}</div>
        <div className="seg" style={{ marginBottom: 10 }}>
          {(Object.keys(RIGS) as RigId[]).map((id) => (
            <button
              key={id}
              className={cam.rig === id ? 'active' : ''}
              onClick={() => editCam('rig', (c) => (c.rig = id))}
            >
              {RIGS[id].name}
            </button>
          ))}
        </div>
        <p style={{ color: 'var(--text-faint)', fontSize: 11, marginBottom: 10 }}>
          {rigSpec.description}
        </p>
        {(cam.rig === 'handheld' || cam.rig === 'steadicam') && (
          <div className="field">
            <label>{t('ui.inspector.camera.intensity', { value: cam.rigIntensity.toFixed(2) })}</label>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={cam.rigIntensity}
              onChange={(e) => {
                const v = num(e.target.value)
                if (v !== null) editCam('rig intensity', (c) => (c.rigIntensity = v))
              }}
            />
          </div>
        )}
        {cam.rig === 'carMount' && (
          <div className="field">
            <label>{t('ui.inspector.camera.mountTo')}</label>
            <select
              value={cam.mountEntityId ?? ''}
              onChange={(e) => {
                const id = e.target.value || undefined
                editCam('mount entity', (c) => (c.mountEntityId = id))
              }}
            >
              <option value="">{t('ui.inspector.camera.none')}</option>
              {scene.entities.map((en) => (
                <option key={en.id} value={en.id}>
                  {en.label?.text || en.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="panel-section">
        <div className="panel-title">{t('ui.inspector.camera.marks')}</div>
        <button
          className="btn primary"
          style={{ width: '100%', marginBottom: 8 }}
          onClick={() => emit('dropCameraMarkAtView', {})}
        >
          {t('ui.inspector.camera.dropMarkAtViewOrM')}
        </button>
        {orderedMarks.map((m, i) => (
          <div
            key={m.id}
            className="mark-row"
            onClick={() => setSelection({ kind: 'mark', entityId: 'camera', markId: m.id })}
          >
            {t('ui.inspector.camera.cameraMarkRow', {
              index: i + 1,
              time: m.time.toFixed(1),
              focal: m.focalLength
            })}
          </div>
        ))}
        {orderedMarks.length > 0 && (
          <button
            className="btn danger"
            style={{ width: '100%', marginTop: 8 }}
            onClick={() => clearCameraMarks()}
          >
            {t('ui.inspector.camera.clearCameraMove')}
          </button>
        )}
      </div>
    </div>
  )
}

/* =========================== D) Mark =============================== */

function MarkInspector({
  scene,
  shot,
  entityId,
  markId
}: {
  scene: Scene
  shot: Shot
  entityId: string | 'camera'
  markId: string
}): JSX.Element {
  const { t } = useTranslation()
  const mutate = useMutate()
  const setSelection = useStore((s) => s.setSelection)

  const isCamera = entityId === 'camera'
  const take = scene.blocking.find((b) => b.id === shot.blockingTakeId)
  const track = isCamera ? null : take?.tracks.find((t) => t.entityId === entityId)
  const list: (CameraMark | ActorMark)[] = isCamera ? shot.camera.marks : (track?.marks ?? [])
  const ordered = [...list].sort((a, b) => a.time - b.time)
  const mark = list.find((m) => m.id === markId)

  if (!mark) return <div className="panel-section">{t('ui.inspector.markNotFound')}</div>

  const index = ordered.findIndex((m) => m.id === markId) + 1
  const actorMark = isCamera ? null : (mark as ActorMark)
  const cameraMark = isCamera ? (mark as CameraMark) : null
  const duration = shot.duration

  const editMark = (label: string, fn: (m: CameraMark | ActorMark) => void): void => {
    mutate(label, (doc) => {
      const sh = findShot(doc, scene.id, shot.id)
      if (!sh) return
      let target: (CameraMark | ActorMark) | undefined
      if (isCamera) {
        target = sh.camera.marks.find((m) => m.id === markId)
      } else {
        const sc = findScene(doc, scene.id)
        const tk = sc?.blocking.find((b) => b.id === sh.blockingTakeId)
        target = tk?.tracks.find((t) => t.entityId === entityId)?.marks.find((m) => m.id === markId)
      }
      if (target) fn(target)
    })
  }

  const editCameraMark = (label: string, fn: (m: CameraMark) => void): void => {
    editMark(label, fn as (m: CameraMark | ActorMark) => void)
  }

  if (cameraMark) {
    return (
      <div>
        <div className="panel-section">
          <div className="panel-title">{t('ui.inspector.mark.title', { index })}</div>
        </div>
        <CameraMarkFields mark={cameraMark} duration={duration} editMark={editCameraMark} />
        <div className="panel-section">
          <button
            className="btn danger"
            style={{ width: '100%' }}
            onClick={() => {
              mutate('delete mark', (doc) => {
                const sh = findShot(doc, scene.id, shot.id)
                if (sh) sh.camera.marks = sh.camera.marks.filter((m) => m.id !== markId)
              })
              setSelection(null)
            }}
          >
            {t('ui.inspector.mark.deleteMark')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="panel-section">
        <div className="panel-title">{t('ui.inspector.mark.title', { index })}</div>
        <div className="field-row">
          <div className="field" style={{ flex: 1 }}>
            <label>{t('ui.inspector.mark.arrive')}</label>
            <input
              type="number"
              min={0}
              max={duration}
              step={0.1}
              value={mark.time}
              onChange={(e) => {
                const v = num(e.target.value)
                if (v !== null) editMark('mark time', (m) => (m.time = clamp(v, 0, duration)))
              }}
            />
          </div>
          <div className="field" style={{ flex: 1 }}>
            <label>{t('ui.inspector.mark.hold')}</label>
            <input
              type="number"
              min={0}
              max={duration}
              step={0.1}
              value={mark.hold}
              onChange={(e) => {
                const v = num(e.target.value)
                if (v !== null) editMark('mark hold', (m) => (m.hold = clamp(v, 0, duration)))
              }}
            />
          </div>
        </div>
        <div className="field">
          <label>{t('ui.inspector.mark.easeOut', { value: mark.easeOut.toFixed(2) })}</label>
          <input
            type="range"
            min={0}
            max={0.5}
            step={0.01}
            value={mark.easeOut}
            onChange={(e) => {
              const v = num(e.target.value)
              if (v !== null) editMark('ease out', (m) => (m.easeOut = v))
            }}
          />
        </div>
        <div className="field">
          <label>{t('ui.inspector.mark.easeIn', { value: mark.easeIn.toFixed(2) })}</label>
          <input
            type="range"
            min={0}
            max={0.5}
            step={0.01}
            value={mark.easeIn}
            onChange={(e) => {
              const v = num(e.target.value)
              if (v !== null) editMark('ease in', (m) => (m.easeIn = v))
            }}
          />
        </div>
      </div>

      {actorMark && (
        <div className="panel-section">
          <div className="panel-title">{t('ui.inspector.mark.gait')}</div>
          <div className="seg gait-grid">
            {(Object.keys(GAITS) as GaitId[]).map((g) => (
              <button
                key={g}
                className={actorMark.gait === g ? 'active' : ''}
                onClick={() => editMark('gait', (m) => ((m as ActorMark).gait = g))}
              >
                {gaitLabel(g)}
              </button>
            ))}
          </div>
          <div className="field" style={{ marginTop: 8 }}>
            <label>{t('ui.inspector.mark.altitude')}</label>
            <input
              type="number"
              min={0}
              max={200}
              step={0.1}
              value={actorMark.position.y}
              onChange={(e) => {
                const v = num(e.target.value)
                if (v !== null) editMark('mark altitude', (m) => (m.position.y = clamp(v, 0, 200)))
              }}
            />
          </div>
        </div>
      )}

      {actorMark && (
        <div className="panel-section">
          <div className="panel-title">{t('ui.inspector.mark.boardOnArrival')}</div>
          <div className="field">
            <label>{t('ui.inspector.mark.boardAfterMark')}</label>
            <select
              value={actorMark.attachTo ?? ''}
              onChange={(e) =>
                editMark('board target', (m) => {
                  (m as ActorMark).attachTo = e.target.value || undefined
                })
              }
              title={t('ui.inspector.mark.boardTitle')}
            >
              <option value="">{t('ui.inspector.mark.stayOnFoot')}</option>
              {scene.entities
                .filter((e) => e.id !== entityId)
                .map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.name}
                  </option>
                ))}
            </select>
          </div>
        </div>
      )}

      {actorMark && <MarkPoseSection mark={actorMark} editMark={editMark} />}

      {!cameraMark && (
        <div className="panel-section">
          <div className="panel-title">{t('ui.inspector.mark.position')}</div>
          <div className="field-row">
            <div className="field" style={{ flex: 1 }}>
              <label>{t('ui.inspector.entity.x')}</label>
              <input
                type="number"
                step={0.1}
                value={mark.position.x}
                onChange={(e) => {
                  const v = num(e.target.value)
                  if (v !== null) editMark('mark X', (m) => (m.position.x = v))
                }}
              />
            </div>
            <div className="field" style={{ flex: 1 }}>
              <label>{t('ui.inspector.entity.z')}</label>
              <input
                type="number"
                step={0.1}
                value={mark.position.z}
                onChange={(e) => {
                  const v = num(e.target.value)
                  if (v !== null) editMark('mark Z', (m) => (m.position.z = v))
                }}
              />
            </div>
          </div>
        </div>
      )}

      <div className="panel-section">
        <button
          className="btn danger"
          style={{ width: '100%' }}
          onClick={() => {
            mutate('delete mark', (doc) => {
              const sh = findShot(doc, scene.id, shot.id)
              if (!sh) return
              if (isCamera) {
                sh.camera.marks = sh.camera.marks.filter((m) => m.id !== markId)
              } else {
                const sc = findScene(doc, scene.id)
                const tk = sc?.blocking.find((b) => b.id === sh.blockingTakeId)
                const tr = tk?.tracks.find((t) => t.entityId === entityId)
                if (tr) tr.marks = tr.marks.filter((m) => m.id !== markId)
              }
            })
            setSelection(null)
          }}
        >
          {t('ui.inspector.mark.deleteMark')}
        </button>
      </div>
    </div>
  )
}

/* ------------------------------- pose ----------------------------------- */

const POSES: GaitId[] = ['stand', 'sit', 'crouch', 'lie', 'gesture', 'fall']

const POSE_I18N: Partial<Record<GaitId, string>> = {
  gesture: 'talk',
  fall: 'fallen'
}

const JOINTS: { key: string; range: number }[] = [
  { key: 'shoulderLX', range: 180 },
  { key: 'shoulderRX', range: 180 },
  { key: 'shoulderLZ', range: 150 },
  { key: 'shoulderRZ', range: 150 },
  { key: 'elbowL', range: 150 },
  { key: 'elbowR', range: 150 },
  { key: 'hipLX', range: 120 },
  { key: 'hipRX', range: 120 },
  { key: 'kneeL', range: 150 },
  { key: 'kneeR', range: 150 },
  { key: 'torsoX', range: 60 },
  { key: 'torsoY', range: 80 },
  { key: 'headY', range: 80 },
  { key: 'headX', range: 45 }
]

const DEG = 180 / Math.PI

function PoseSection({
  entity,
  editEntity
}: {
  entity: Entity
  editEntity: (label: string, fn: (e: Entity) => void) => void
}): JSX.Element {
  const { t } = useTranslation()
  const pose = typeof entity.params?.pose === 'string' ? entity.params.pose : 'stand'
  const hasOverrides = Object.keys(entity.params ?? {}).some(
    (k) => k.startsWith('joint_') && entity.params![k] !== 0
  )

  return (
    <div className="panel-section">
      <div className="panel-title">{t('ui.inspector.pose.title')}</div>
      <div className="seg gait-grid" style={{ marginBottom: 10 }}>
        {POSES.map((id) => (
          <button
            key={id}
            className={pose === id ? 'active' : ''}
            onClick={() =>
              editEntity('entity pose', (en) => {
                en.params = { ...en.params, pose: id }
              })
            }
          >
            {t(`ui.inspector.pose.${POSE_I18N[id] ?? id}`)}
          </button>
        ))}
      </div>
      <p style={{ color: 'var(--text-faint)', fontSize: 11, lineHeight: 1.4, marginBottom: 8 }}>
        {t('ui.inspector.pose.hint')}
      </p>
      <details open={hasOverrides}>
        <summary
          style={{ cursor: 'pointer', fontSize: 11, fontWeight: 600, color: 'var(--text-dim)', marginBottom: 8 }}
        >
          {t('ui.inspector.pose.limbsSummary')}
        </summary>
        {JOINTS.map((j) => {
          const raw = entity.params?.[`joint_${j.key}`]
          const rad = typeof raw === 'number' ? raw : 0
          const deg = Math.round(rad * DEG)
          const jointLabel = t(`ui.inspector.pose.joints.${j.key}`)
          return (
            <div className="field" key={j.key} style={{ marginBottom: 6 }}>
              <label>{t('ui.inspector.pose.joints.degrees', { label: jointLabel, deg })}</label>
              <input
                type="range"
                min={-j.range}
                max={j.range}
                step={1}
                value={deg}
                onChange={(e) => {
                  const v = Number(e.target.value)
                  if (Number.isNaN(v)) return
                  editEntity('pose joint', (en) => {
                    en.params = { ...en.params, [`joint_${j.key}`]: v / DEG }
                  })
                }}
              />
            </div>
          )
        })}
        <button
          className="btn small"
          style={{ width: '100%', marginTop: 4 }}
          onClick={() =>
            editEntity('reset pose', (en) => {
              if (!en.params) return
              for (const k of Object.keys(en.params)) {
                if (k.startsWith('joint_')) delete en.params[k]
              }
            })
          }
        >
          {t('ui.inspector.pose.resetLimbs')}
        </button>
      </details>
    </div>
  )
}

/**
 * Pose at a mark: joint offsets held at this mark and interpolated between
 * marks by the evaluator — keyframed limb choreography (fights, dances).
 * Reuses the same JOINTS table as the entity-level PoseSection.
 */
function MarkPoseSection({
  mark,
  editMark
}: {
  mark: ActorMark
  editMark: (label: string, fn: (m: CameraMark | ActorMark) => void) => void
}): JSX.Element {
  const { t } = useTranslation()
  const hasPose = Object.values(mark.joints ?? {}).some((v) => v !== 0)

  return (
    <div className="panel-section">
      <div className="panel-title">{t('ui.inspector.mark.poseAtMark')}</div>
      <p style={{ color: 'var(--text-faint)', fontSize: 11, lineHeight: 1.4, marginBottom: 8 }}>
        {t('ui.inspector.mark.poseAtMarkHint')}
      </p>
      <details open={hasPose}>
        <summary
          style={{ cursor: 'pointer', fontSize: 11, fontWeight: 600, color: 'var(--text-dim)', marginBottom: 8 }}
        >
          {t('ui.inspector.mark.jointKeyframes')}
        </summary>
        {JOINTS.map((j) => {
          const rad = mark.joints?.[j.key] ?? 0
          const deg = Math.round(rad * DEG)
          const jointLabel = t(`ui.inspector.pose.joints.${j.key}`)
          return (
            <div className="field" key={j.key} style={{ marginBottom: 6 }}>
              <label>{t('ui.inspector.pose.joints.degrees', { label: jointLabel, deg })}</label>
              <input
                type="range"
                min={-j.range}
                max={j.range}
                step={1}
                value={deg}
                onChange={(e) => {
                  const v = Number(e.target.value)
                  if (Number.isNaN(v)) return
                  editMark('mark pose', (m) => {
                    const am = m as ActorMark
                    am.joints = { ...am.joints, [j.key]: v / DEG }
                  })
                }}
              />
            </div>
          )
        })}
        <button
          className="btn small"
          style={{ width: '100%', marginTop: 4 }}
          onClick={() =>
            editMark('reset mark pose', (m) => {
              delete (m as ActorMark).joints
            })
          }
        >
          {t('ui.inspector.mark.resetPoseAtMark')}
        </button>
      </details>
    </div>
  )
}
