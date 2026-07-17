// Modified for cross-platform Windows support in 2026; see MODIFICATIONS.md.
/**
 * Viewport — React shell around SceneManager: canvas lifecycle, the shot
 * HUD, look-through framing overlays (thirds grid), placement/mark hints,
 * empty states, and the reference-video underlay.
 */

import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useStore } from '../store'
import { emit, type FramingKind } from '../bus'
import { SceneManager } from './SceneManager'
import { registerSceneManager, getSceneManager as getSceneManagerSafe } from '../export/scene-access'
import { ReferenceUnderlay, ReferenceControls } from './ReferenceUnderlay'
import { LENS_SET, SHOT_SIZES } from '@engine/camera'
import type { AspectId } from '@engine/types'

const ASPECT_ORDER: AspectId[] = ['16:9', '9:16', '2.39:1', '4:3', '1:1']

function Hud(): JSX.Element | null {
  const { t } = useTranslation()
  const doc = useStore((s) => s.doc)
  const sceneId = useStore((s) => s.sceneId)
  const shotId = useStore((s) => s.shotId)
  const time = useStore((s) => s.time)
  const mutate = useStore((s) => s.mutate)
  const mode = useStore((s) => s.mode)

  const scene = doc?.scenes.find((s) => s.id === sceneId)
  const shot = scene?.shots.find((s) => s.id === shotId)
  if (!shot) return null

  // Lens at playhead (from marks; default 35).
  const sorted = [...shot.camera.marks].sort((a, b) => a.time - b.time)
  let lens = sorted[0]?.focalLength ?? 35
  for (const m of sorted) if (m.time <= time + 1e-6) lens = m.focalLength

  const cycleLens = (): void => {
    const idx = LENS_SET.findIndex((l) => l >= Math.round(lens))
    const next = LENS_SET[(Math.max(0, idx) + 1) % LENS_SET.length]!
    emit('setLens', { focalLength: next })
  }

  const cycleAspect = (): void => {
    const idx = ASPECT_ORDER.indexOf(shot.aspect)
    const next = ASPECT_ORDER[(idx + 1) % ASPECT_ORDER.length]!
    mutate('aspect', (doc) => {
      for (const sc of doc.scenes) {
        const sh = sc.shots.find((x) => x.id === shot.id)
        if (sh) sh.aspect = next
      }
    })
  }

  return (
    <div className="hud">
      <button onClick={cycleLens} title={t('ui.viewport.hud.lensTitle')}>
        <span className="hud-label">{t('ui.viewport.hud.lens')}</span>
        {t('ui.viewport.hud.lensValue', { value: Math.round(lens) })}
      </button>
      <button onClick={cycleAspect} title={t('ui.viewport.hud.aspectTitle')}>
        <span className="hud-label">{t('ui.viewport.hud.aspect')}</span>
        {shot.aspect}
      </button>
      <button title={t('ui.viewport.hud.durationTitle')}>
        <span className="hud-label">{t('ui.viewport.hud.duration')}</span>
        {shot.duration.toFixed(1)}s
      </button>
      <button title={t('ui.viewport.hud.fpsTitle')}>
        <span className="hud-label">{t('ui.viewport.hud.fps')}</span>
        {shot.fps}
      </button>
      {mode === 'shoot' && (
        <button title={t('ui.viewport.hud.marksTitle')}>
          <span className="hud-label">{t('ui.viewport.hud.marks')}</span>
          {shot.camera.marks.length}
        </button>
      )}
    </div>
  )
}

type FramedShotSize = 'WS' | 'FS' | 'MS' | 'MCU' | 'CU'

const SHOT_SIZE_KEYS: Record<FramedShotSize, string> = {
  WS: 'ws',
  FS: 'fs',
  MS: 'ms',
  MCU: 'mcu',
  CU: 'cu'
}

function ShotSizeRow(): JSX.Element {
  const { t } = useTranslation()
  const sizes: FramedShotSize[] = ['WS', 'FS', 'MS', 'MCU', 'CU']
  return (
    <div className="tool-row">
      {sizes.map((size) => (
        <button
          key={size}
          className="btn small"
          title={t('ui.viewport.shotSizes.autoFrameTitle', { name: SHOT_SIZES[size].name })}
          onClick={() => emit('frameSubject', { size })}
        >
          {t(`ui.viewport.shotSizes.${SHOT_SIZE_KEYS[size]}`)}
        </button>
      ))}
    </div>
  )
}

/** Recording feel: how tightly recordings chase the mouse. */
function RecordControlToggle(): JSX.Element {
  const { t } = useTranslation()
  const recordControl = useStore((s) => s.recordControl)
  const setRecordControl = useStore((s) => s.setRecordControl)
  const next = { precise: 'normal', normal: 'fast', fast: 'precise' } as const
  return (
    <button
      className="btn small"
      onClick={() => setRecordControl(next[recordControl])}
      title={t('ui.viewport.recordControl.title')}
    >
      {t(`ui.viewport.recordControl.${recordControl}`)}
    </button>
  )
}

/** One-click cinematography framings — writes the active camera mark. */
function FramingRow(): JSX.Element {
  const { t } = useTranslation()
  const framings: { kind: FramingKind; key: 'twoShot' | 'ots' | 'rev' | 'top' | 'low' | 'dutch' }[] = [
    { kind: '2S', key: 'twoShot' },
    { kind: 'OTS', key: 'ots' },
    { kind: 'REV', key: 'rev' },
    { kind: 'TOP', key: 'top' },
    { kind: 'LOW', key: 'low' },
    { kind: 'DUTCH', key: 'dutch' }
  ]
  return (
    <div className="tool-row">
      {framings.map((f) => (
        <button
          key={f.kind}
          className="btn small"
          title={t(`ui.viewport.framing.${f.key}Title`)}
          onClick={() => emit('applyFraming', { kind: f.kind })}
        >
          {t(`ui.viewport.framing.${f.key}`)}
        </button>
      ))}
    </div>
  )
}

function GizmoModeRow(): JSX.Element {
  const { t } = useTranslation()
  const [mode, setMode] = useState<'translate' | 'rotate'>('translate')
  const apply = (m: 'translate' | 'rotate'): void => {
    setMode(m)
    getSceneManagerSafe()?.setGizmoMode(m)
  }
  return (
    <div className="tool-row">
      <button
        className={`btn small ${mode === 'translate' ? 'active' : ''}`}
        onClick={() => apply('translate')}
        title={t('ui.viewport.gizmo.moveTitle')}
      >
        {t('ui.viewport.gizmo.move')}
      </button>
      <button
        className={`btn small ${mode === 'rotate' ? 'active' : ''}`}
        onClick={() => apply('rotate')}
        title={t('ui.viewport.gizmo.rotateTitle')}
      >
        {t('ui.viewport.gizmo.rotate')}
      </button>
    </div>
  )
}

export function Viewport(): JSX.Element {
  const { t } = useTranslation()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [viewRect, setViewRect] = useState<{ x: number; y: number; w: number; h: number } | null>(null)
  const [pipRect, setPipRect] = useState<{ x: number; y: number; w: number; h: number } | null>(null)

  const mode = useStore((s) => s.mode)
  const lookThrough = useStore((s) => s.lookThrough)
  const setLookThrough = useStore((s) => s.setLookThrough)
  const pipSize = useStore((s) => s.pipSize)
  const setPipSize = useStore((s) => s.setPipSize)
  const recording = useStore((s) => s.recording)
  const setRecording = useStore((s) => s.setRecording)
  const placingAssetId = useStore((s) => s.placingAssetId)
  const placingSequence = useStore((s) => s.placingSequence)
  const droppingMarks = useStore((s) => s.droppingMarks)
  const selection = useStore((s) => s.selection)
  const doc = useStore((s) => s.doc)
  const sceneId = useStore((s) => s.sceneId)
  const setSelection = useStore((s) => s.setSelection)
  const setDroppingMarks = useStore((s) => s.setDroppingMarks)

  const scene = doc?.scenes.find((s) => s.id === sceneId)
  const hasEntities = (scene?.entities.length ?? 0) > 0
  const hasMarks =
    (scene?.shots.some((sh) => sh.camera.marks.length > 0) ?? false) ||
    (scene?.blocking.some((b) => b.tracks.some((t) => t.marks.length > 0)) ?? false)

  useEffect(() => {
    if (!canvasRef.current) return
    const manager = new SceneManager(canvasRef.current)
    manager.onViewRect = (rect) => setViewRect(rect)
    manager.onPipRect = (rect) =>
      setPipRect((prev) =>
        prev?.x === rect?.x && prev?.y === rect?.y && prev?.w === rect?.w && prev?.h === rect?.h
          ? prev
          : rect
      )
    registerSceneManager(manager)
    return () => {
      registerSceneManager(null)
      manager.dispose()
    }
  }, [])

  const showLetterbox = (lookThrough || mode === 'deliver') && viewRect

  const singleEntitySelected = selection?.kind === 'entity'

  const alt = window.blockout.platform.alternateModifier

  let hint: string | null = null
  if (placingSequence)
    hint = t('ui.viewport.hints.placingSequence', { count: placingSequence.count })
  else if (placingAssetId)
    hint = t('ui.viewport.hints.placingAsset', { alt })
  else if (droppingMarks && selection?.kind === 'entity') hint = t('ui.viewport.hints.droppingMarksEntity')
  else if (droppingMarks && selection?.kind === 'camera')
    hint = t('ui.viewport.hints.droppingMarksCamera')
  else if (selection?.kind === 'entities')
    hint = t('ui.viewport.hints.multiSelect', { count: selection.entityIds.length })

  return (
    <>
      <canvas ref={canvasRef} />
      {mode !== 'deliver' && <Hud />}
      {mode !== 'deliver' && (
        <div className="viewport-tools">
          {mode === 'shoot' && (
            <div className="tool-row">
              <button
                className="btn small primary"
                onClick={() => {
                  const s = useStore.getState()
                  s.setLookThrough(true)
                  s.setTime(0)
                  s.setPlaying(true)
                }}
                title={t('ui.viewport.tools.playShotTitle')}
              >
                {t('ui.viewport.tools.playShot')}
              </button>
              <button
                className={`btn small ${lookThrough ? 'active' : ''}`}
                onClick={() => setLookThrough(!lookThrough)}
                title={t('ui.viewport.tools.lookThroughTitle')}
              >
                {t('ui.viewport.tools.lookThrough')}
              </button>
              <button
                className="btn small"
                onClick={() => {
                  setSelection({ kind: 'camera' })
                  emit('dropCameraMarkAtView', {})
                }}
                title={t('ui.viewport.tools.camMarkTitle')}
              >
                {t('ui.viewport.tools.camMark')}
              </button>
              <button
                className={`btn small ${droppingMarks ? 'active' : ''}`}
                onClick={() => setDroppingMarks(!droppingMarks)}
                disabled={!selection}
                title={t('ui.viewport.tools.marksTitle')}
              >
                {t('ui.viewport.tools.marks')}
              </button>
              <button
                className={`btn small ${recording ? 'active' : ''}`}
                style={recording ? { color: 'var(--danger)', borderColor: 'var(--danger)' } : undefined}
                onClick={() => setRecording(!recording)}
                title={
                  singleEntitySelected
                    ? t('ui.viewport.tools.recordPerformerTitle')
                    : t('ui.viewport.tools.recordCameraTitle')
                }
              >
                {recording
                  ? t('ui.viewport.tools.stop')
                  : singleEntitySelected
                    ? t('ui.viewport.tools.recordPerformer')
                    : t('ui.viewport.tools.recordCamera')}
              </button>
              <RecordControlToggle />
              <ReferenceControls />
            </div>
          )}
          {mode === 'shoot' && <ShotSizeRow />}
          {mode === 'shoot' && <FramingRow />}
          <GizmoModeRow />
          <div className="tool-row">
            <button
              className="btn small"
              disabled={!selection || (selection.kind !== 'entity' && selection.kind !== 'entities')}
              onClick={() => getSceneManagerSafe()?.snapSelectionToGround()}
              title={t('ui.viewport.tools.groundTitle')}
            >
              {t('ui.viewport.tools.ground')}
            </button>
          </div>
        </div>
      )}
      {mode === 'shoot' && <ReferenceUnderlay />}

      {/* PiP live shot preview chrome */}
      {pipRect && !lookThrough && mode !== 'deliver' && (
        <div
          style={{
            position: 'absolute',
            left: pipRect.x - 1,
            top: pipRect.y - 1,
            width: pipRect.w + 2,
            height: pipRect.h + 2,
            border: '1px solid var(--border-strong)',
            borderRadius: 4,
            zIndex: 5,
            pointerEvents: 'none'
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: -26,
              left: 0,
              right: 0,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              pointerEvents: 'auto'
            }}
          >
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--text-faint)' }}>
              {t('ui.viewport.shotPreview.label')}
            </span>
            <span style={{ flex: 1 }} />
            <button
              className="btn small"
              style={{ padding: '2px 7px', fontSize: 10 }}
              title={t('ui.viewport.shotPreview.cycleSizeTitle')}
              onClick={() =>
                setPipSize(pipSize === 'small' ? 'medium' : pipSize === 'medium' ? 'large' : 'small')
              }
            >
              {pipSize === 'small'
                ? t('ui.viewport.shotPreview.sizes.small')
                : pipSize === 'medium'
                  ? t('ui.viewport.shotPreview.sizes.medium')
                  : t('ui.viewport.shotPreview.sizes.large')}
            </button>
            <button
              className="btn small"
              style={{ padding: '2px 7px', fontSize: 10 }}
              title={t('ui.viewport.shotPreview.hideTitle')}
              onClick={() => setPipSize('off')}
            >
              ✕
            </button>
          </div>
        </div>
      )}
      {pipSize === 'off' && !lookThrough && mode !== 'deliver' && (
        <button
          className="btn small"
          style={{ position: 'absolute', right: 14, bottom: 14, zIndex: 5 }}
          onClick={() => setPipSize('medium')}
          title={t('ui.viewport.shotPreview.showTitle')}
        >
          {t('ui.viewport.shotPreview.preview')}
        </button>
      )}
      {recording && (
        <div className="viewport-hint" style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }}>
          {singleEntitySelected
            ? t('ui.viewport.hints.recordingPerformer')
            : t('ui.viewport.hints.recordingCamera')}
        </div>
      )}

      {showLetterbox && viewRect && (
        <div
          style={{
            position: 'absolute',
            left: viewRect.x,
            top: viewRect.y,
            width: viewRect.w,
            height: viewRect.h,
            pointerEvents: 'none',
            zIndex: 4
          }}
        >
          {/* Rule-of-thirds grid */}
          {[1, 2].map((i) => (
            <div
              key={`v${i}`}
              style={{
                position: 'absolute',
                left: `${(i / 3) * 100}%`,
                top: 0,
                bottom: 0,
                width: 1,
                background: 'rgba(255,255,255,0.14)'
              }}
            />
          ))}
          {[1, 2].map((i) => (
            <div
              key={`h${i}`}
              style={{
                position: 'absolute',
                top: `${(i / 3) * 100}%`,
                left: 0,
                right: 0,
                height: 1,
                background: 'rgba(255,255,255,0.14)'
              }}
            />
          ))}
          {/* Action-safe area */}
          <div
            style={{
              position: 'absolute',
              inset: '5%',
              border: '1px solid rgba(255,255,255,0.10)'
            }}
          />
        </div>
      )}

      {hint && <div className="viewport-hint">{hint}</div>}

      {!hasEntities && mode === 'stage' && (
        <div className="empty-state">
          <div style={{ fontSize: 36 }}>🎬</div>
          <div>{t('ui.viewport.empty.stage')}</div>
        </div>
      )}
      {hasEntities && !hasMarks && mode === 'shoot' && !droppingMarks && (
        <div className="empty-state">
          <div>{t('ui.viewport.empty.shoot')}</div>
        </div>
      )}
    </>
  )
}
