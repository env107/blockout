import { buildEngineLocale } from '../build-engine-locale'
import { uiEn } from './en/ui'
import { toastsEn } from './en/toasts'
import { dialogsEn } from './en/dialogs'

export const enResources = {
  translation: {
    ui: uiEn,
    toasts: toastsEn,
    dialogs: dialogsEn,
    engine: buildEngineLocale('en')
  }
}
