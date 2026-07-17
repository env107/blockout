/**
 * Builds the `engine` i18n namespace from engine catalogs.
 * English values mirror engine source; zh-CN uses explicit overrides (no silent fallback).
 */

import { ASSET_CATALOG } from '@engine/assets'
import { GAITS } from '@engine/gaits'
import { CAMERA_MOVE_PRESETS, type CameraMoveCategory } from '@engine/camera-moves'
import { MOTION_PRESETS } from '@engine/motions'
import { ACTION_PRESETS } from '@engine/action-presets'
import { BUILTIN_PROFILES } from '@engine/profiles'
import type { EntityCategory } from '@engine/types'
import type { GaitId } from '@engine/types'
import { categoryToSlug, idToSlug } from './slug'
import { zhEngineOverrides } from './locales/zh-engine-overrides'

type ZhAssetEntry = { name: string }
type ZhCameraMoveEntry = { name: string; description: string }
type ZhActionEntry = { name: string; description: string }
type ZhProfileEntry = { name: string; attachHint: string }

const zh = {
  assetCategories: zhEngineOverrides.assetCategories as Record<string, string>,
  assets: zhEngineOverrides.assets as Record<string, ZhAssetEntry>,
  gaits: zhEngineOverrides.gaits as Record<string, ZhAssetEntry>,
  cameraMoveCategories: zhEngineOverrides.cameraMoveCategories as Record<string, string>,
  cameraMoves: zhEngineOverrides.cameraMoves as Record<string, ZhCameraMoveEntry>,
  motionCategories: zhEngineOverrides.motionCategories as Record<string, string>,
  motions: zhEngineOverrides.motions as Record<string, ZhAssetEntry>,
  actionCategories: zhEngineOverrides.actionCategories as Record<string, string>,
  actions: zhEngineOverrides.actions as Record<string, ZhActionEntry>,
  profiles: zhEngineOverrides.profiles as Record<string, ZhProfileEntry>
}

export type EngineLocaleTree = {
  assets: Record<string, { name: string }>
  assetCategories: Record<string, string>
  gaits: Record<string, { name: string }>
  cameraMoves: Record<string, { name: string; description: string }>
  cameraMoveCategories: Record<string, string>
  motions: Record<string, { name: string }>
  motionCategories: Record<string, string>
  actions: Record<string, { name: string; description: string }>
  actionCategories: Record<string, string>
  profiles: Record<string, { name: string; attachHint: string }>
}

const ASSET_CATEGORY_EN: Record<EntityCategory | 'custom', string> = {
  people: 'People',
  animals: 'Animals',
  vehicles: 'Vehicles',
  furniture: 'Furniture',
  props: 'Props',
  environment: 'Environment',
  primitives: 'Primitives',
  custom: 'Custom'
}

const CAMERA_CATEGORY_EN: Record<CameraMoveCategory, string> = {
  'push & pull': 'Push & pull',
  'orbit & arc': 'Orbit & arc',
  'crane & boom': 'Crane & boom',
  aerial: 'Aerial',
  follow: 'Follow',
  'pan & scan': 'Pan & scan',
  stylized: 'Stylized'
}

function buildAssetCategories(locale: 'en' | 'zh-CN'): Record<string, string> {
  const out: Record<string, string> = {}
  for (const [key, en] of Object.entries(ASSET_CATEGORY_EN)) {
    const slug = categoryToSlug(key)
    out[slug] =
      locale === 'en'
        ? en
        : (zh.assetCategories[slug] ??
          (() => {
            throw new Error(`Missing zh asset category: ${slug}`)
          })())
  }
  return out
}

function buildCameraMoveCategories(locale: 'en' | 'zh-CN'): Record<string, string> {
  const out: Record<string, string> = {}
  for (const [key, en] of Object.entries(CAMERA_CATEGORY_EN)) {
    const slug = categoryToSlug(key)
    out[slug] =
      locale === 'en'
        ? en
        : (zh.cameraMoveCategories[slug] ??
          (() => {
            throw new Error(`Missing zh camera category: ${slug}`)
          })())
  }
  return out
}

function motionCategoryEn(cat: string): string {
  return cat.charAt(0).toUpperCase() + cat.slice(1)
}

function actionCategoryEn(cat: string): string {
  return cat.charAt(0).toUpperCase() + cat.slice(1)
}

export function buildEngineLocale(locale: 'en' | 'zh-CN'): EngineLocaleTree {
  const assets: Record<string, { name: string }> = {}
  for (const a of ASSET_CATALOG) {
    const slug = idToSlug(a.id)
    if (locale === 'en') {
      assets[slug] = { name: a.name }
    } else {
      const entry = zh.assets[slug]
      if (!entry?.name) throw new Error(`Missing zh asset name: ${a.id} (${slug})`)
      assets[slug] = { name: entry.name }
    }
  }

  const gaits: Record<string, { name: string }> = {}
  for (const [key, spec] of Object.entries(GAITS) as [GaitId, (typeof GAITS)[GaitId]][]) {
    if (locale === 'en') {
      gaits[key] = { name: spec.name }
    } else {
      const entry = zh.gaits[key]
      if (!entry?.name) throw new Error(`Missing zh gait: ${key}`)
      gaits[key] = { name: entry.name }
    }
  }

  const cameraMoves: Record<string, { name: string; description: string }> = {}
  for (const p of CAMERA_MOVE_PRESETS) {
    const slug = idToSlug(p.id)
    if (locale === 'en') {
      cameraMoves[slug] = { name: p.name, description: p.description }
    } else {
      const entry = zh.cameraMoves[slug]
      if (!entry?.name || !entry?.description) throw new Error(`Missing zh camera move: ${p.id}`)
      cameraMoves[slug] = { name: entry.name, description: entry.description }
    }
  }

  const motions: Record<string, { name: string }> = {}
  const motionCategories: Record<string, string> = {}
  for (const p of MOTION_PRESETS) {
    const slug = idToSlug(p.id)
    if (locale === 'en') {
      motions[slug] = { name: p.name }
      motionCategories[p.category] ??= motionCategoryEn(p.category)
    } else {
      const entry = zh.motions[slug]
      if (!entry?.name) throw new Error(`Missing zh motion: ${p.id}`)
      motions[slug] = { name: entry.name }
      const catZh = zh.motionCategories[p.category]
      if (!catZh) throw new Error(`Missing zh motion category: ${p.category}`)
      motionCategories[p.category] = catZh
    }
  }

  const actions: Record<string, { name: string; description: string }> = {}
  const actionCategories: Record<string, string> = {}
  for (const p of ACTION_PRESETS) {
    const slug = idToSlug(p.id)
    if (locale === 'en') {
      actions[slug] = { name: p.name, description: p.description }
      actionCategories[p.category] ??= actionCategoryEn(p.category)
    } else {
      const entry = zh.actions[slug]
      if (!entry?.name || !entry?.description) throw new Error(`Missing zh action: ${p.id}`)
      actions[slug] = { name: entry.name, description: entry.description }
      const catZh = zh.actionCategories[p.category]
      if (!catZh) throw new Error(`Missing zh action category: ${p.category}`)
      actionCategories[p.category] = catZh
    }
  }

  const profiles: Record<string, { name: string; attachHint: string }> = {}
  for (const p of BUILTIN_PROFILES) {
    const slug = idToSlug(p.id)
    if (locale === 'en') {
      profiles[slug] = { name: p.name, attachHint: p.attachHint }
    } else {
      const entry = zh.profiles[slug]
      if (!entry?.name || !entry?.attachHint) throw new Error(`Missing zh profile: ${p.id}`)
      profiles[slug] = { name: entry.name, attachHint: entry.attachHint }
    }
  }

  return {
    assets,
    assetCategories: buildAssetCategories(locale),
    gaits,
    cameraMoves,
    cameraMoveCategories: buildCameraMoveCategories(locale),
    motions,
    motionCategories,
    actions,
    actionCategories,
    profiles
  }
}
