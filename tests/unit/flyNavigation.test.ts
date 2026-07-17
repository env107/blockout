import { describe, expect, it } from 'vitest'
import * as THREE from 'three'
import {
  applyLook,
  applyMovement,
  applyWheel,
  lookAt,
  SHIFT_MULT
} from '../../src/renderer/viewport/flyNavigation'

describe('flyNavigation', () => {
  it('moves forward on W by speed × dt', () => {
    const cam = new THREE.PerspectiveCamera(50, 16 / 9, 0.1, 500)
    cam.position.set(0, 2, 5)
    lookAt(cam, { x: 0, y: 1, z: 0 })
    const before = cam.position.clone()
    applyMovement(cam, 1, 10, new Set(['w']), 1, false)
    expect(cam.position.distanceTo(before)).toBeCloseTo(10, 1)
  })

  it('strafes on A/D without changing height when looking horizontally', () => {
    const cam = new THREE.PerspectiveCamera(50, 16 / 9, 0.1, 500)
    cam.position.set(0, 2, 5)
    lookAt(cam, { x: 0, y: 2, z: 0 })
    const y0 = cam.position.y
    applyMovement(cam, 1, 10, new Set(['d']), 1, false)
    expect(cam.position.y).toBeCloseTo(y0, 5)
    expect(cam.position.x).toBeGreaterThan(0)
  })

  it('raises and lowers on E/Q', () => {
    const cam = new THREE.PerspectiveCamera(50, 16 / 9, 0.1, 500)
    cam.position.set(0, 2, 0)
    lookAt(cam, { x: 0, y: 2, z: -5 })
    applyMovement(cam, 1, 10, new Set(['e']), 1, false)
    expect(cam.position.y).toBeCloseTo(12, 1)
    applyMovement(cam, 1, 10, new Set(['q']), 1, false)
    expect(cam.position.y).toBeCloseTo(2, 1)
  })

  it('applies shift multiplier', () => {
    const cam = new THREE.PerspectiveCamera(50, 16 / 9, 0.1, 500)
    cam.position.set(0, 0, 0)
    lookAt(cam, { x: 0, y: 0, z: -1 })
    applyMovement(cam, 1, 10, new Set(['w']), 1, true)
    const dist = cam.position.length()
    expect(dist).toBeCloseTo(10 * SHIFT_MULT, 1)
  })

  it('clamps pitch when looking up/down', () => {
    const cam = new THREE.PerspectiveCamera(50, 16 / 9, 0.1, 500)
    lookAt(cam, { x: 0, y: 0, z: -1 })
    applyLook(cam, 0, -10000)
    expect(cam.rotation.x).toBeGreaterThan(-Math.PI / 2)
    applyLook(cam, 0, 10000)
    expect(cam.rotation.x).toBeLessThan(Math.PI / 2)
  })

  it('lookAt aims at target from position', () => {
    const cam = new THREE.PerspectiveCamera(50, 16 / 9, 0.1, 500)
    lookAt(cam, { x: 0, y: 1, z: 0 }, { x: 9, y: 7, z: 9 })
    const dir = new THREE.Vector3()
    cam.getWorldDirection(dir)
    expect(dir.y).toBeLessThan(0)
  })

  it('wheel dollies along view axis', () => {
    const cam = new THREE.PerspectiveCamera(50, 16 / 9, 0.1, 500)
    cam.position.set(0, 0, 5)
    lookAt(cam, { x: 0, y: 0, z: 0 })
    const before = cam.position.clone()
    applyWheel(cam, -120, 10)
    const moved = cam.position.clone().sub(before)
    expect(moved.length()).toBeGreaterThan(0)
  })
})
