#!/usr/bin/env node
/**
 * i18n completeness gate: symmetric ui/toasts/dialogs keys, engine coverage, code key resolution.
 * Run: node scripts/verify-i18n.mjs
 */
import { readFileSync, readdirSync, statSync } from 'fs'
import { resolve, dirname, join, relative } from 'path'
import { fileURLToPath, pathToFileURL } from 'url'
import { createServer } from 'vite'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

function flattenKeys(obj, prefix = '') {
  const keys = new Set()
  for (const [k, v] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${k}` : k
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      for (const sub of flattenKeys(v, path)) keys.add(sub)
    } else {
      keys.add(path)
    }
  }
  return keys
}

function diffSets(a, b) {
  return [...a].filter((k) => !b.has(k))
}

function walkTsFiles(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) {
      if (name === 'node_modules' || name === 'out') continue
      walkTsFiles(p, out)
    } else if (/\.(tsx?|mjs)$/.test(name)) {
      out.push(p)
    }
  }
  return out
}

function extractCodeKeys(content) {
  const keys = new Set()
  const patterns = [
    /\bt\(\s*['"]([^'"]+)['"]/g,
    /i18nKey=\{?\s*['"]([^'"]+)['"]/g,
    /i18nKey=\{?\s*`([^`$]+)`/g
  ]
  for (const re of patterns) {
    let m
    while ((m = re.exec(content)) !== null) {
      keys.add(m[1])
    }
  }
  return keys
}

async function loadEngineExpectedKeys() {
  const server = await createServer({ configFile: resolve(root, 'vitest.config.ts'), root })
  const mod = await server.ssrLoadModule(resolve(root, 'src/shared/i18n/engine-labels.ts'))
  await server.close()
  return mod.expectedEngineKeyPaths()
}

async function loadLocaleTrees() {
  const server = await createServer({ configFile: resolve(root, 'vitest.config.ts'), root })
  const enMod = await server.ssrLoadModule(resolve(root, 'src/shared/i18n/locales/en.ts'))
  const zhMod = await server.ssrLoadModule(resolve(root, 'src/shared/i18n/locales/zh-CN.ts'))
  await server.close()
  const en = enMod.enResources.translation
  const zh = zhMod.zhCNResources.translation
  return { en, zh }
}

function resolveKey(tree, key) {
  const parts = key.split('.')
  let cur = tree
  for (const p of parts) {
    if (cur == null || typeof cur !== 'object') return undefined
    cur = cur[p]
  }
  return typeof cur === 'string' ? cur : undefined
}

async function main() {
  let failed = false
  const report = (msg) => {
    console.error(msg)
    failed = true
  }

  const { en, zh } = await loadLocaleTrees()

  for (const ns of ['ui', 'toasts', 'dialogs']) {
    const enKeys = flattenKeys(en[ns], ns)
    const zhKeys = flattenKeys(zh[ns], ns)
    const missingZh = diffSets(enKeys, zhKeys)
    const missingEn = diffSets(zhKeys, enKeys)
    if (missingZh.length) report(`[symmetry] zh-CN missing ${ns}: ${missingZh.slice(0, 10).join(', ')}${missingZh.length > 10 ? ` (+${missingZh.length - 10})` : ''}`)
    if (missingEn.length) report(`[symmetry] en missing ${ns}: ${missingEn.slice(0, 10).join(', ')}${missingEn.length > 10 ? ` (+${missingEn.length - 10})` : ''}`)
  }

  const engineKeys = await loadEngineExpectedKeys()
  for (const key of engineKeys) {
    if (!resolveKey(en, key)) report(`[engine] en missing: ${key}`)
    if (!resolveKey(zh, key)) report(`[engine] zh-CN missing: ${key}`)
  }

  const scanDirs = [
    resolve(root, 'src/renderer'),
    resolve(root, 'src/main'),
    resolve(root, 'src/shared/i18n')
  ]
  const codeKeys = new Set()
  for (const dir of scanDirs) {
    for (const file of walkTsFiles(dir)) {
      const content = readFileSync(file, 'utf-8')
      for (const k of extractCodeKeys(content)) codeKeys.add(k)
    }
  }

  for (const key of codeKeys) {
    if (!resolveKey(en, key)) report(`[code] en missing key used in code: ${key}`)
    if (!resolveKey(zh, key)) report(`[code] zh-CN missing key used in code: ${key}`)
  }

  if (failed) {
    console.error('\nverify:i18n FAILED')
    process.exit(1)
  }
  console.log(
    `verify:i18n OK — ui/toasts/dialogs symmetric, ${engineKeys.length} engine keys, ${codeKeys.size} code keys`
  )
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
