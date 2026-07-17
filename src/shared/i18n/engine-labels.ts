import { ASSET_CATALOG, type AssetSpec } from '@engine/assets'
import { GAITS } from '@engine/gaits'
import {
  CAMERA_MOVE_PRESETS,
  type CameraMoveCategory,
  type CameraMovePreset
} from '@engine/camera-moves'
import { MOTION_PRESETS, type MotionPreset } from '@engine/motions'
import { ACTION_PRESETS, type ActionPreset } from '@engine/action-presets'
import { BUILTIN_PROFILES, type GeneratorProfile } from '@engine/profiles'
import type { EntityCategory } from '@engine/types'
import type { GaitId } from '@engine/types'
import { categoryToSlug, idToSlug } from './slug'
import { t } from './index'

export function assetLabel(spec: Pick<AssetSpec, 'id' | 'name'>): string {
  return t(`engine.assets.${idToSlug(spec.id)}.name`)
}

export function assetCategoryLabel(category: EntityCategory | 'custom'): string {
  return t(`engine.assetCategories.${categoryToSlug(category)}`)
}

export function gaitLabel(gait: GaitId): string {
  return t(`engine.gaits.${gait}.name`)
}

export function cameraMoveLabel(preset: Pick<CameraMovePreset, 'id' | 'name'>): string {
  return t(`engine.cameraMoves.${idToSlug(preset.id)}.name`)
}

export function cameraMoveDescription(preset: Pick<CameraMovePreset, 'id' | 'description'>): string {
  return t(`engine.cameraMoves.${idToSlug(preset.id)}.description`)
}

export function cameraMoveCategoryLabel(category: CameraMoveCategory): string {
  return t(`engine.cameraMoveCategories.${categoryToSlug(category)}`)
}

export function motionLabel(preset: Pick<MotionPreset, 'id' | 'name'>): string {
  return t(`engine.motions.${idToSlug(preset.id)}.name`)
}

export function motionCategoryLabel(category: MotionPreset['category']): string {
  return t(`engine.motionCategories.${category}`)
}

export function actionLabel(preset: Pick<ActionPreset, 'id' | 'name'>): string {
  return t(`engine.actions.${idToSlug(preset.id)}.name`)
}

export function actionDescription(preset: Pick<ActionPreset, 'id' | 'description'>): string {
  return t(`engine.actions.${idToSlug(preset.id)}.description`)
}

export function actionCategoryLabel(category: ActionPreset['category']): string {
  return t(`engine.actionCategories.${category}`)
}

export function profileLabel(profile: Pick<GeneratorProfile, 'id' | 'name'>): string {
  return t(`engine.profiles.${idToSlug(profile.id)}.name`)
}

export function profileAttachHint(profile: Pick<GeneratorProfile, 'id' | 'attachHint'>): string {
  return t(`engine.profiles.${idToSlug(profile.id)}.attachHint`)
}

/** All engine ids that must have locale keys — used by verify-i18n. */
export function expectedEngineKeyPaths(): string[] {
  const keys: string[] = []
  for (const a of ASSET_CATALOG) {
    keys.push(`engine.assets.${idToSlug(a.id)}.name`)
  }
  for (const cat of [
    'people',
    'animals',
    'vehicles',
    'furniture',
    'props',
    'environment',
    'primitives',
    'custom'
  ] as const) {
    keys.push(`engine.assetCategories.${categoryToSlug(cat)}`)
  }
  for (const g of Object.keys(GAITS) as GaitId[]) {
    keys.push(`engine.gaits.${g}.name`)
  }
  for (const p of CAMERA_MOVE_PRESETS) {
    keys.push(`engine.cameraMoves.${idToSlug(p.id)}.name`)
    keys.push(`engine.cameraMoves.${idToSlug(p.id)}.description`)
  }
  const camCats = new Set(CAMERA_MOVE_PRESETS.map((p) => p.category))
  for (const c of camCats) {
    keys.push(`engine.cameraMoveCategories.${categoryToSlug(c)}`)
  }
  for (const p of MOTION_PRESETS) {
    keys.push(`engine.motions.${idToSlug(p.id)}.name`)
  }
  const motionCats = new Set(MOTION_PRESETS.map((p) => p.category))
  for (const c of motionCats) {
    keys.push(`engine.motionCategories.${c}`)
  }
  for (const p of ACTION_PRESETS) {
    keys.push(`engine.actions.${idToSlug(p.id)}.name`)
    keys.push(`engine.actions.${idToSlug(p.id)}.description`)
  }
  const actionCats = new Set(ACTION_PRESETS.map((p) => p.category))
  for (const c of actionCats) {
    keys.push(`engine.actionCategories.${c}`)
  }
  for (const p of BUILTIN_PROFILES) {
    keys.push(`engine.profiles.${idToSlug(p.id)}.name`)
    keys.push(`engine.profiles.${idToSlug(p.id)}.attachHint`)
  }
  return keys
}
