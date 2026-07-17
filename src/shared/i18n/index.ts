import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import type { LocaleId } from './types'
import { enResources } from './locales/en'
import { zhCNResources } from './locales/zh-CN'

let initialized = false
const listeners = new Set<(locale: LocaleId) => void>()

export async function initI18n(locale: LocaleId): Promise<void> {
  if (initialized && i18n.language === locale) return

  if (!initialized) {
    await i18n.use(initReactI18next).init({
      lng: locale,
      fallbackLng: false,
      returnNull: false,
      interpolation: { escapeValue: false },
      resources: {
        en: enResources,
        'zh-CN': zhCNResources
      },
      missingKeyHandler: (_lng, _ns, key) => {
        if (process.env.NODE_ENV === 'test' || process.env.BLOCKOUT_I18N_STRICT === '1') {
          throw new Error(`Missing i18n key: ${key}`)
        }
        console.warn(`Missing i18n key: ${key}`)
      }
    })
    initialized = true
  } else {
    await i18n.changeLanguage(locale)
  }

  if (typeof document !== 'undefined') {
    document.documentElement.lang = locale === 'zh-CN' ? 'zh-CN' : 'en'
  }
}

export function t(key: string, options?: Record<string, unknown>): string {
  return i18n.t(key, options)
}

export function getLocale(): LocaleId {
  return (i18n.language === 'en' ? 'en' : 'zh-CN') as LocaleId
}

export async function setLocale(locale: LocaleId): Promise<void> {
  await initI18n(locale)
  for (const fn of listeners) fn(locale)
}

export function onLocaleChange(fn: (locale: LocaleId) => void): () => void {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

export { i18n }
export type { LocaleId } from './types'
export { DEFAULT_LOCALE, SUPPORTED_LOCALES, resolveLocale } from './types'
