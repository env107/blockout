import { readFile, writeFile, mkdir } from 'fs/promises'
import { dirname } from 'path'
import { resolveConfigPath } from '../config-paths'
import { type LocaleId, resolveLocale, DEFAULT_LOCALE } from './types'

export interface UserPreferences {
  locale: LocaleId
}

const PREFS_FILE = 'preferences.json'

export async function readPreferences(): Promise<UserPreferences> {
  try {
    const path = resolveConfigPath(PREFS_FILE)
    const raw = JSON.parse(await readFile(path, 'utf-8')) as { locale?: string }
    return { locale: resolveLocale(raw.locale) }
  } catch {
    return { locale: DEFAULT_LOCALE }
  }
}

export async function writePreferences(prefs: UserPreferences): Promise<void> {
  const path = resolveConfigPath(PREFS_FILE)
  await mkdir(dirname(path), { recursive: true })
  await writeFile(path, JSON.stringify(prefs, null, 2) + '\n', 'utf-8')
}

export function resolveLocaleFromEnv(env: NodeJS.ProcessEnv = process.env): LocaleId {
  const forced = env.BLOCKOUT_LOCALE?.trim()
  if (forced) return resolveLocale(forced)
  return DEFAULT_LOCALE
}
