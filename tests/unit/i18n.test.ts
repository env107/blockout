import { describe, it, expect, beforeAll } from 'vitest'
import { initI18n, t, setLocale } from '../../src/shared/i18n'
import { expectedEngineKeyPaths, assetLabel, gaitLabel } from '../../src/shared/i18n/engine-labels'
import { ASSET_CATALOG } from '@engine/assets'
import { enResources } from '../../src/shared/i18n/locales/en'
import { zhCNResources } from '../../src/shared/i18n/locales/zh-CN'

function flattenKeys(obj: Record<string, unknown>, prefix = ''): Set<string> {
  const keys = new Set<string>()
  for (const [k, v] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${k}` : k
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      for (const sub of flattenKeys(v as Record<string, unknown>, path)) keys.add(sub)
    } else {
      keys.add(path)
    }
  }
  return keys
}

describe('i18n', () => {
  beforeAll(async () => {
    process.env.BLOCKOUT_I18N_STRICT = '1'
    await initI18n('en')
  })

  it('ui/toasts/dialogs keys are symmetric between en and zh-CN', () => {
    for (const ns of ['ui', 'toasts', 'dialogs'] as const) {
      const enKeys = flattenKeys(enResources.translation[ns] as Record<string, unknown>, ns)
      const zhKeys = flattenKeys(zhCNResources.translation[ns] as Record<string, unknown>, ns)
      expect([...enKeys].sort()).toEqual([...zhKeys].sort())
    }
  })

  it('covers all engine display keys in both locales', () => {
    for (const key of expectedEngineKeyPaths()) {
      expect(t(key, { lng: 'en' })).not.toBe(key)
      expect(t(key, { lng: 'zh-CN' })).not.toBe(key)
    }
  })

  it('switches locale for asset labels', async () => {
    const spec = ASSET_CATALOG.find((a) => a.id === 'person.man')!
    await setLocale('en')
    expect(assetLabel(spec)).toBe('Man')
    await setLocale('zh-CN')
    expect(assetLabel(spec)).toBe('男人')
  })

  it('translates gaits', async () => {
    await setLocale('en')
    expect(gaitLabel('walk')).toBe('Walk')
    await setLocale('zh-CN')
    expect(gaitLabel('walk')).toBe('行走')
  })
})
