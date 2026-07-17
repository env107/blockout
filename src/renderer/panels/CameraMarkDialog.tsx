/**
 * Modal editor for a single camera keyframe — opened from the timeline pill
 * or a 3D viewport mark click.
 */

import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useStore } from '../store'
import type { CameraMark, ProjectDoc, Scene, Shot } from '@engine/types'
import { CameraMarkFields } from './camera-mark-fields'

function findScene(doc: ProjectDoc, sceneId: string): Scene | undefined {
  return doc.scenes.find((s) => s.id === sceneId)
}

function findShot(doc: ProjectDoc, sceneId: string, shotId: string): Shot | undefined {
  return findScene(doc, sceneId)?.shots.find((s) => s.id === shotId)
}

export function CameraMarkDialog(): JSX.Element | null {
  const { t } = useTranslation()
  const dialog = useStore((s) => s.cameraMarkDialog)
  const sceneId = useStore((s) => s.sceneId)
  const shotId = useStore((s) => s.shotId)
  const scene = useStore((s) => s.scene())
  const shot = useStore((s) => s.shot())
  const mutate = useStore((s) => s.mutate)
  const setSelection = useStore((s) => s.setSelection)
  const setCameraMarkDialog = useStore((s) => s.setCameraMarkDialog)

  const markId = dialog?.markId
  const ordered = shot ? [...shot.camera.marks].sort((a, b) => a.time - b.time) : []
  const mark = markId ? shot?.camera.marks.find((m) => m.id === markId) : undefined
  const index = mark ? ordered.findIndex((m) => m.id === mark.id) + 1 : 0

  useEffect(() => {
    if (dialog && markId && !mark) setCameraMarkDialog(null)
  }, [dialog, markId, mark, setCameraMarkDialog])

  if (!dialog || !mark || !scene || !shot || !sceneId || !shotId) return null

  const editMark = (label: string, fn: (m: CameraMark) => void): void => {
    mutate(label, (doc) => {
      const sh = findShot(doc, sceneId, shotId)
      const target = sh?.camera.marks.find((m) => m.id === markId)
      if (target) fn(target)
    })
  }

  const onDelete = (): void => {
    mutate('delete mark', (doc) => {
      const sh = findShot(doc, sceneId, shotId)
      if (sh) sh.camera.marks = sh.camera.marks.filter((m) => m.id !== markId)
    })
    setSelection(null)
    setCameraMarkDialog(null)
  }

  return (
    <div
      className="help-backdrop"
      data-testid="camera-mark-dialog-backdrop"
      onClick={() => setCameraMarkDialog(null)}
    >
      <div
        className="mark-dialog"
        data-testid="camera-mark-dialog"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mark-dialog-header">
          <div className="mark-dialog-title">
            {t('ui.cameraMarkDialog.title', { index, time: mark.time.toFixed(1) })}
          </div>
          <button
            type="button"
            className="btn small"
            onClick={() => setCameraMarkDialog(null)}
            aria-label={t('ui.cameraMarkDialog.close')}
          >
            ✕
          </button>
        </div>
        <div className="mark-dialog-body">
          <CameraMarkFields mark={mark} duration={shot.duration} editMark={editMark} />
        </div>
        <div className="mark-dialog-footer">
          <button type="button" className="btn danger" onClick={onDelete}>
            {t('ui.cameraMarkDialog.delete')}
          </button>
          <button type="button" className="btn" onClick={() => setCameraMarkDialog(null)}>
            {t('ui.cameraMarkDialog.close')}
          </button>
        </div>
      </div>
    </div>
  )
}
