export type LocaleId = 'en' | 'zh-CN'

export const DEFAULT_LOCALE: LocaleId = 'zh-CN'

export const SUPPORTED_LOCALES: readonly LocaleId[] = ['zh-CN', 'en'] as const

export function isLocaleId(v: string): v is LocaleId {
  return v === 'en' || v === 'zh-CN'
}

export function resolveLocale(input?: string | null): LocaleId {
  if (input && isLocaleId(input)) return input
  return DEFAULT_LOCALE
}
