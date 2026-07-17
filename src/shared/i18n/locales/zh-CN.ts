import { buildEngineLocale } from '../build-engine-locale'
import { uiZhCN } from './zh-CN/ui'
import { toastsZhCN } from './zh-CN/toasts'
import { dialogsZhCN } from './zh-CN/dialogs'

export const zhCNResources = {
  translation: {
    ui: uiZhCN,
    toasts: toastsZhCN,
    dialogs: dialogsZhCN,
    engine: buildEngineLocale('zh-CN')
  }
}
