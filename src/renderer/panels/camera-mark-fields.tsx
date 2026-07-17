/**
 * Shared editable fields for a camera keyframe — used by MarkInspector and
 * CameraMarkDialog so both stay in sync.
 */

import { useTranslation } from 'react-i18next'
import { LENS_SET } from '@engine/camera'
import type { CameraMark } from '@engine/types'

const clamp = (v: number, lo: number, hi: number): number => Math.min(Math.max(v, lo), hi)
const toDeg = (rad: number): number => Math.round((rad * 180) / Math.PI)
const toRad = (deg: number): number => (deg * Math.PI) / 180

function num(v: string): number | null {
  const n = Number(v)
  return Number.isNaN(n) ? null : n
}

export type EditCameraMark = (label: string, fn: (m: CameraMark) => void) => void

export function CameraMarkFields({
  mark,
  duration,
  editMark
}: {
  mark: CameraMark
  duration: number
  editMark: EditCameraMark
}): JSX.Element {
  const { t } = useTranslation()

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
        value={Number(value.toFixed(step < 1 ? 2 : 0))}
        onChange={(e) => {
          const v = num(e.target.value)
          if (v !== null) editMark(`camera ${label.toLowerCase()}`, (m) => apply(m, v))
        }}
      />
    </div>
  )

  return (
    <>
      <div className="panel-section" style={{ paddingTop: 0 }}>
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

      <div className="panel-section">
        <div className="panel-title">{t('ui.inspector.mark.position')}</div>
        <div className="field-row">
          {numField(t('ui.inspector.entity.x'), mark.position.x, 0.1, (m, v) => (m.position.x = v))}
          {numField(t('ui.inspector.camera.height'), mark.position.y, 0.1, (m, v) =>
            (m.position.y = Math.max(0, v))
          )}
          {numField(t('ui.inspector.entity.z'), mark.position.z, 0.1, (m, v) => (m.position.z = v))}
        </div>
        <div className="field-row">
          {numField(t('ui.inspector.camera.pan'), toDeg(mark.pan), 1, (m, v) => (m.pan = toRad(v)), '°')}
          {numField(t('ui.inspector.camera.tilt'), toDeg(mark.tilt), 1, (m, v) =>
            (m.tilt = toRad(clamp(v, -89, 89)))
          , '°')}
          {numField(t('ui.inspector.camera.roll'), toDeg(mark.roll), 1, (m, v) =>
            (m.roll = toRad(clamp(v, -180, 180)))
          , '°')}
        </div>
      </div>

      <div className="panel-section">
        <div className="panel-title">{t('ui.inspector.mark.optics')}</div>
        <div className="field">
          <label>{t('ui.inspector.mark.focalLength')}</label>
          <input
            type="number"
            min={8}
            max={300}
            step={1}
            value={mark.focalLength}
            onChange={(e) => {
              const v = num(e.target.value)
              if (v !== null)
                editMark('focal length', (m) => (m.focalLength = clamp(v, 8, 300)))
            }}
          />
        </div>
        <div className="field">
          <label>{t('ui.inspector.camera.lens')}</label>
          <div className="seg">
            {LENS_SET.map((fl) => (
              <button
                key={fl}
                type="button"
                className={mark.focalLength === fl ? 'active' : ''}
                onClick={() => editMark('focal length', (m) => (m.focalLength = fl))}
              >
                {fl}
              </button>
            ))}
          </div>
        </div>
        <div className="field">
          <label>
            <input
              type="checkbox"
              checked={mark.focusDistance === undefined}
              onChange={(e) => {
                const deep = e.target.checked
                editMark('focus mode', (m) => {
                  m.focusDistance = deep ? undefined : 3
                })
              }}
              style={{ width: 'auto', marginRight: 6 }}
            />
            {t('ui.inspector.mark.deepFocus')}
          </label>
        </div>
        {mark.focusDistance !== undefined && (
          <div className="field">
            <label>{t('ui.inspector.mark.focusDistance')}</label>
            <input
              type="number"
              min={0.3}
              max={100}
              step={0.1}
              value={mark.focusDistance}
              onChange={(e) => {
                const v = num(e.target.value)
                if (v !== null)
                  editMark('focus distance', (m) => (m.focusDistance = clamp(v, 0.3, 100)))
              }}
            />
          </div>
        )}
      </div>
    </>
  )
}
