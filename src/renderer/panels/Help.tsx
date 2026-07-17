// Modified for cross-platform Windows support in 2026; see MODIFICATIONS.md.
/**
 * Help overlay, redesigned for a filmmaker skimming (not reading):
 *   • Quick start — six visual cards, the whole app at a glance.
 *   • How do I…? — a live-searchable task list distilled from the reference.
 *   • Shortcuts — the keyboard reference as a tidy kbd grid.
 * Opened from the titlebar ?, the welcome screen, or the ? key. Esc closes
 * (wired outside via the helpOpen store flag).
 */

import { useMemo, useState, type ReactNode } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useStore } from '../store'

function Kbd({ children }: { children?: ReactNode }): JSX.Element {
  return <kbd className="help-kbd">{children}</kbd>
}

const CARD_KEYS = [
  'stageYourSet',
  'oneClickSequences',
  'makeThemMove',
  'animateTab',
  'frameAndMoveCamera',
  'deliver'
] as const

const TASK_AREAS = ['stage', 'shoot', 'camera', 'deliver', 'projects'] as const
const TASK_COUNTS: Record<(typeof TASK_AREAS)[number], number> = {
  stage: 10,
  shoot: 9,
  camera: 9,
  deliver: 6,
  projects: 4
}

const SHORTCUT_KEYS = [
  'space',
  'm',
  'c',
  'gR',
  'shiftClick',
  'modA',
  'modD',
  'delete',
  'undoRedo',
  'modS',
  'jumpMarks',
  'altClick',
  'esc',
  'help'
] as const

type Tab = 'quickstart' | 'tasks' | 'shortcuts'

export function HelpOverlay(): JSX.Element | null {
  const { t } = useTranslation()
  const helpOpen = useStore((s) => s.helpOpen)
  const setHelpOpen = useStore((s) => s.setHelpOpen)
  const [tab, setTab] = useState<Tab>('quickstart')
  const [query, setQuery] = useState('')

  const mod = window.blockout.platform.primaryModifier
  const alt = window.blockout.platform.alternateModifier
  const modAlt = { mod, alt }

  const tasks = useMemo(
    () =>
      TASK_AREAS.map((area) => ({
        area,
        areaLabel: t(`ui.help.tasks.${area}.area`),
        items: Array.from({ length: TASK_COUNTS[area] }, (_, i) => {
          const n = i + 1
          return {
            q: t(`ui.help.tasks.${area}.items.q${n}`),
            aKey: `ui.help.tasks.${area}.items.a${n}`
          }
        })
      })),
    [t]
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return tasks
    return tasks
      .map((g) => ({
        ...g,
        items: g.items.filter((item) => {
          if (item.q.toLowerCase().includes(q)) return true
          const answerText = t(item.aKey, modAlt)
          return answerText.toLowerCase().includes(q)
        })
      }))
      .filter((g) => g.items.length > 0)
  }, [query, tasks, t, mod, alt])

  if (!helpOpen) return null

  return (
    <div className="help-backdrop" onClick={() => setHelpOpen(false)}>
      <div className="help-modal help-v4" onClick={(e) => e.stopPropagation()}>
        <div className="help-header">
          <div className="seg help-tabs">
            <button
              className={tab === 'quickstart' ? 'active' : ''}
              onClick={() => setTab('quickstart')}
            >
              {t('ui.help.tabs.quickStart')}
            </button>
            <button className={tab === 'tasks' ? 'active' : ''} onClick={() => setTab('tasks')}>
              {t('ui.help.tabs.tasks')}
            </button>
            <button
              className={tab === 'shortcuts' ? 'active' : ''}
              onClick={() => setTab('shortcuts')}
            >
              {t('ui.help.tabs.shortcuts')}
            </button>
          </div>
          <span style={{ flex: 1 }} />
          <button className="btn small" onClick={() => setHelpOpen(false)}>
            {t('ui.help.done')}
          </button>
        </div>

        <div className="help-body help-v4-body">
          {tab === 'quickstart' && (
            <div className="help-v4-inner">
              <p className="help-intro">
                <Trans i18nKey="ui.help.intro.quickStart" components={{ b: <b /> }} />
              </p>
              <div className="help-cards">
                {CARD_KEYS.map((key) => (
                  <div key={key} className="help-card">
                    <div className="help-card-emoji">{t(`ui.help.cards.${key}.emoji`)}</div>
                    <div className="help-card-title">{t(`ui.help.cards.${key}.title`)}</div>
                    <div className="help-card-body">{t(`ui.help.cards.${key}.body`)}</div>
                    <div className="help-card-then">{t(`ui.help.cards.${key}.then`)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'tasks' && (
            <div className="help-v4-inner">
              <input
                className="help-search"
                type="text"
                placeholder={t('ui.help.search.placeholder')}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
              />
              {filtered.length === 0 ? (
                <p className="help-empty">{t('ui.help.search.empty', { query })}</p>
              ) : (
                filtered.map((group) => (
                  <div key={group.area} className="help-task-group">
                    <div className="help-task-area">{group.areaLabel}</div>
                    {group.items.map((item) => (
                      <div key={item.aKey} className="help-task">
                        <div className="help-task-q">{item.q}</div>
                        <div className="help-task-a">
                          <Trans
                            i18nKey={item.aKey}
                            values={modAlt}
                            components={{ b: <b />, kbd: <Kbd /> }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ))
              )}
            </div>
          )}

          {tab === 'shortcuts' && (
            <div className="help-v4-inner">
              <p className="help-intro">{t('ui.help.intro.shortcuts')}</p>
              <div className="help-kbd-grid">
                {SHORTCUT_KEYS.map((keyId) => {
                  const keysStr = t(`ui.help.shortcuts.${keyId}.keys`, modAlt)
                  return (
                    <div key={keyId} className="help-kbd-row">
                      <div className="help-kbd-keys">
                        {keysStr.split(' / ').map((k, i, arr) => (
                          <span key={k}>
                            <Kbd>{k}</Kbd>
                            {i < arr.length - 1 ? <span className="help-kbd-sep"> / </span> : null}
                          </span>
                        ))}
                      </div>
                      <div className="help-kbd-desc">
                        {t(`ui.help.shortcuts.${keyId}.description`)}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
