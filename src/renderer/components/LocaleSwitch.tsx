import { useTranslation } from 'react-i18next'
import { setLocale, getLocale, type LocaleId } from '../../shared/i18n'
import { SUPPORTED_LOCALES } from '../../shared/i18n/types'

const LABELS: Record<LocaleId, string> = {
  'zh-CN': '中文',
  en: 'EN'
}

export function LocaleSwitch(): JSX.Element {
  const { i18n } = useTranslation()
  const current = getLocale()

  const switchTo = (locale: LocaleId): void => {
    if (locale === current) return
    void (async () => {
      await window.blockout.setLocale(locale)
      await setLocale(locale)
      await i18n.changeLanguage(locale)
    })()
  }

  return (
    <div className="locale-switch" title="">
      {SUPPORTED_LOCALES.map((locale) => (
        <button
          key={locale}
          className={`btn small ${current === locale ? 'active' : ''}`}
          onClick={() => switchTo(locale)}
        >
          {LABELS[locale]}
        </button>
      ))}
    </div>
  )
}
