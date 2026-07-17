// Modified for cross-platform Windows support in 2026; see MODIFICATIONS.md.
/**
 * Deliver mode: pick a generator profile, choose passes, export the
 * package, copy the generated prompt, and hand off to Blender/ComfyUI.
 */

import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useStore } from '../store'
import { BUILTIN_PROFILES, getProfile } from '@engine/profiles'
import { generatePrompt } from '@engine/prompt'
import { profileLabel, profileAttachHint } from '../../shared/i18n/engine-labels'
import {
  exportShot,
  exportAnimatic,
  exportContactSheet,
  exportDims,
  exportStillAtPlayhead,
  type ExportResolution
} from '../export/exporter'
import { exportGlb } from '../export/gltf'

export function DeliverPanel(): JSX.Element {
  const { t } = useTranslation()
  const doc = useStore((s) => s.doc)
  const sceneId = useStore((s) => s.sceneId)
  const shotId = useStore((s) => s.shotId)
  const progress = useStore((s) => s.exportProgress)
  const setExportProgress = useStore((s) => s.setExportProgress)
  const toast = useStore((s) => s.toast)
  const mutate = useStore((s) => s.mutate)

  const scene = doc?.scenes.find((s) => s.id === sceneId)
  const shot = scene?.shots.find((s) => s.id === shotId)

  const [profileId, setProfileId] = useState(doc?.settings.defaultProfileId ?? 'seedance-2')
  const [passes, setPasses] = useState({ clean: true, depth: true, normal: false })
  const [labels, setLabels] = useState<'on' | 'stillsOnly' | 'off'>('stillsOnly')
  const [resolution, setResolution] = useState<ExportResolution>('auto')

  const profile = getProfile(profileId)
  const prompt = useMemo(
    () => (scene && shot ? generatePrompt(scene, shot, profile) : ''),
    [scene, shot, profile]
  )

  if (!scene || !shot) {
    return (
      <div className="deliver-panel">
        <div className="panel-title">{t('ui.deliver.title')}</div>
        <p style={{ color: 'var(--text-dim)' }}>{t('ui.deliver.selectShot')}</p>
      </div>
    )
  }

  const dims = exportDims(profile, shot.aspect, resolution)
  const overCap = profile.maxDuration !== undefined && shot.duration > profile.maxDuration
  const pct =
    progress.totalFrames > 0 ? Math.round((progress.frame / progress.totalFrames) * 100) : 0

  const run = async (): Promise<void> => {
    const res = await exportShot({ profileId, passes, labels, resolution })
    if (res.ok && res.packagePath) {
      toast(t('ui.deliver.toastExportComplete'), 'success')
      void window.blockout.showFolder(res.packagePath)
    } else if (res.error && res.error !== 'cancelled') {
      toast(t('ui.deliver.toastExportFailed', { error: res.error }), 'error')
    }
  }

  return (
    <div className="deliver-panel">
      <div className="panel-title">
        {t('ui.deliver.titleWithScene', { scene: scene.name, shot: shot.name })}
      </div>

      <div className="field">
        <label>{t('ui.deliver.targetGenerator')}</label>
        <select
          value={profileId}
          onChange={(e) => {
            setProfileId(e.target.value)
            mutate('default profile', (doc) => {
              doc.settings.defaultProfileId = e.target.value
            })
          }}
        >
          {BUILTIN_PROFILES.map((p) => (
            <option key={p.id} value={p.id}>
              {profileLabel(p)} ({p.vendor})
            </option>
          ))}
        </select>
      </div>

      <p style={{ color: 'var(--text-dim)', fontSize: 12, marginBottom: 12, lineHeight: 1.5 }}>
        {profileAttachHint(profile)}
      </p>

      {overCap && (
        <div className="warning-chip" style={{ marginBottom: 10 }}>
          {t('ui.deliver.durationWarning', {
            duration: shot.duration.toFixed(1),
            profile: profileLabel(profile),
            max: profile.maxDuration
          })}
        </div>
      )}

      <div className="field">
        <label>
          {t('ui.deliver.output', {
            width: dims.width,
            height: dims.height,
            fps: shot.fps,
            aspect: shot.aspect
          })}
        </label>
        <div className="seg">
          <button className={passes.clean ? 'active' : ''} onClick={() => setPasses((p) => ({ ...p, clean: !p.clean }))}>
            {t('ui.deliver.passes.clean')}
          </button>
          <button className={passes.depth ? 'active' : ''} onClick={() => setPasses((p) => ({ ...p, depth: !p.depth }))}>
            {t('ui.deliver.passes.depth')}
          </button>
          <button className={passes.normal ? 'active' : ''} onClick={() => setPasses((p) => ({ ...p, normal: !p.normal }))}>
            {t('ui.deliver.passes.normal')}
          </button>
        </div>
      </div>

      <div className="field">
        <label>{t('ui.deliver.resolution')}</label>
        <div className="seg">
          <button
            className={resolution === 'auto' ? 'active' : ''}
            onClick={() => setResolution('auto')}
            title={t('ui.deliver.resolutionAutoTitle')}
          >
            {t('ui.deliver.resolutionAuto')}
          </button>
          <button
            className={resolution === '720p' ? 'active' : ''}
            onClick={() => setResolution('720p')}
            title={t('ui.deliver.resolution720pTitle')}
          >
            {t('ui.deliver.resolution720p')}
          </button>
          <button
            className={resolution === '1080p' ? 'active' : ''}
            onClick={() => setResolution('1080p')}
            title={t('ui.deliver.resolution1080pTitle')}
          >
            {t('ui.deliver.resolution1080p')}
          </button>
        </div>
      </div>

      <div className="field">
        <label>{t('ui.deliver.labels')}</label>
        <div className="seg">
          <button className={labels === 'on' ? 'active' : ''} onClick={() => setLabels('on')}>
            {t('ui.deliver.labelsInVideo')}
          </button>
          <button className={labels === 'stillsOnly' ? 'active' : ''} onClick={() => setLabels('stillsOnly')}>
            {t('ui.deliver.labelsStillsOnly')}
          </button>
          <button className={labels === 'off' ? 'active' : ''} onClick={() => setLabels('off')}>
            {t('ui.deliver.labelsOff')}
          </button>
        </div>
      </div>

      {progress.running ? (
        <div className="field">
          <label>
            {t('ui.deliver.progress', {
              label: progress.label,
              frame: progress.frame,
              total: progress.totalFrames
            })}
          </label>
          <div className="progress-bar">
            <div style={{ width: `${pct}%` }} />
          </div>
          <button
            className="btn small danger"
            style={{ marginTop: 8 }}
            onClick={() => setExportProgress({ cancelRequested: true })}
          >
            {t('ui.deliver.cancel')}
          </button>
        </div>
      ) : (
        <button
          className="btn primary"
          style={{ width: '100%', marginBottom: 10 }}
          disabled={!passes.clean && !passes.depth && !passes.normal}
          onClick={() => void run()}
        >
          {t('ui.deliver.exportShotPackage')}
        </button>
      )}

      <button
        className="btn"
        style={{ width: '100%', marginBottom: 10 }}
        disabled={progress.running}
        onClick={() =>
          void exportStillAtPlayhead(profileId, resolution, labels !== 'off').then((r) => {
            if (r.ok && r.packagePath) {
              toast(t('ui.deliver.toastFrameExported'), 'success')
              void window.blockout.showFolder(r.packagePath)
            } else if (r.error) toast(t('ui.deliver.toastFrameExportFailed', { error: r.error }), 'error')
          })
        }
        title={t('ui.deliver.exportThisFrameTitle')}
      >
        {t('ui.deliver.exportThisFrame')}
      </button>

      {progress.lastPackagePath && !progress.running && (
        <button
          className="btn small"
          style={{ width: '100%', marginBottom: 14 }}
          onClick={() => void window.blockout.showFolder(progress.lastPackagePath!)}
        >
          {window.blockout.platform.isMac
            ? t('ui.deliver.revealLastExportMac')
            : t('ui.deliver.showLastExport')}
        </button>
      )}

      <div className="panel-title" style={{ marginTop: 10 }}>
        {t('ui.deliver.promptFor', { name: profileLabel(profile) })}
      </div>
      <div className="prompt-box">{prompt}</div>
      <button
        className="btn small"
        style={{ width: '100%', margin: '8px 0 18px' }}
        onClick={() => {
          void navigator.clipboard.writeText(prompt)
          toast(t('ui.deliver.toastPromptCopied'), 'success')
        }}
      >
        {t('ui.deliver.copyPrompt')}
      </button>

      <div className="panel-title">{t('ui.deliver.sceneTools')}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <button
          className="btn"
          disabled={progress.running}
          onClick={() =>
            void exportAnimatic(profileId, resolution).then((r) => {
              if (r.ok && r.packagePath) {
                toast(t('ui.deliver.toastAnimaticExported'), 'success')
                void window.blockout.showFolder(r.packagePath)
              } else if (r.error && r.error !== 'cancelled') {
                toast(t('ui.deliver.toastAnimaticFailed', { error: r.error }), 'error')
              }
            })
          }
        >
          {t('ui.deliver.exportAnimatic', { count: scene.shots.length })}
        </button>
        <button
          className="btn"
          disabled={progress.running}
          onClick={() =>
            void exportContactSheet().then((r) => {
              if (r.ok && r.packagePath) {
                toast(t('ui.deliver.toastContactSheetExported'), 'success')
                void window.blockout.showFolder(r.packagePath)
              } else if (r.error) toast(t('ui.deliver.toastContactSheetFailed', { error: r.error }), 'error')
            })
          }
        >
          {t('ui.deliver.exportContactSheet')}
        </button>
        <button
          className="btn"
          disabled={progress.running}
          onClick={() =>
            void exportGlb(profileId).then((r) => {
              if (r.ok && r.packagePath) {
                toast(t('ui.deliver.toastBlenderExported'), 'success')
                void window.blockout.showFolder(r.packagePath)
              } else if (r.error) toast(t('ui.deliver.toastGltfFailed', { error: r.error }), 'error')
            })
          }
        >
          {t('ui.deliver.exportBlender')}
        </button>
      </div>
    </div>
  )
}
