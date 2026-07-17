/**
 * Hammer-style viewport fly navigation — WASD movement, LMB look, wheel dolly.
 * Pure math helpers + input state; SceneManager wires events and the render loop.
 */

import * as THREE from 'three'

export const DEFAULT_FLY_MOVE_SPEED = 10
export const FLY_MOVE_SPEED_MIN = 2
export const FLY_MOVE_SPEED_MAX = 40
export const SHIFT_MULT = 2.5
export const LOOK_SENS = 0.003
export const DRAG_THRESHOLD = 5
/** Meters per wheel notch, scaled by moveSpeed in applyWheel. */
export const WHEEL_DOLLY = 0.08

const MOVEMENT_KEYS = new Set(['w', 'a', 's', 'd', 'q', 'e'])
const WORLD_UP = new THREE.Vector3(0, 1, 0)
const _forward = new THREE.Vector3()
const _right = new THREE.Vector3()
const _delta = new THREE.Vector3()
const _target = new THREE.Vector3()

/** Held-key + pointer-look input state. */
export class FlyNavigationInput {
  keysHeld = new Set<string>()
  isLooking = false
  /** Accumulated pointer delta consumed once per frame in applyLook. */
  lookDx = 0
  lookDy = 0

  private pointerDownPos = { x: 0, y: 0 }
  private lastClient = { x: 0, y: 0 }
  pendingClick: PointerEvent | null = null

  isMovementKey(key: string): boolean {
    return MOVEMENT_KEYS.has(key.toLowerCase())
  }

  onKeyDown(key: string): void {
    this.keysHeld.add(key.toLowerCase())
  }

  onKeyUp(key: string): void {
    this.keysHeld.delete(key.toLowerCase())
  }

  onPointerDown(e: PointerEvent): void {
    this.pendingClick = e
    this.pointerDownPos.x = e.clientX
    this.pointerDownPos.y = e.clientY
    this.lastClient.x = e.clientX
    this.lastClient.y = e.clientY
    this.isLooking = false
    this.lookDx = 0
    this.lookDy = 0
  }

  /** Returns true when look mode activates (crossed drag threshold). */
  onPointerMove(e: PointerEvent, canvas: HTMLCanvasElement, canLook: boolean): boolean {
    if (!this.pendingClick && !this.isLooking) return false
    if (this.isLooking && canLook) {
      this.lookDx += e.clientX - this.lastClient.x
      this.lookDy += e.clientY - this.lastClient.y
      this.lastClient.x = e.clientX
      this.lastClient.y = e.clientY
      return true
    }
    if (this.pendingClick && canLook) {
      const dx = e.clientX - this.pointerDownPos.x
      const dy = e.clientY - this.pointerDownPos.y
      if (dx * dx + dy * dy >= DRAG_THRESHOLD * DRAG_THRESHOLD) {
        this.isLooking = true
        canvas.setPointerCapture(e.pointerId)
        this.lastClient.x = e.clientX
        this.lastClient.y = e.clientY
        return true
      }
    }
    return false
  }

  /** Returns pending click event if this was a tap, not a look drag. */
  onPointerUp(e: PointerEvent, canvas: HTMLCanvasElement): PointerEvent | null {
    const click = !this.isLooking ? this.pendingClick : null
    if (this.isLooking) canvas.releasePointerCapture(e.pointerId)
    this.isLooking = false
    this.pendingClick = null
    this.lookDx = 0
    this.lookDy = 0
    return click
  }

  clearPointer(): void {
    this.isLooking = false
    this.pendingClick = null
    this.lookDx = 0
    this.lookDy = 0
  }
}

export function applyMovement(
  camera: THREE.PerspectiveCamera,
  dt: number,
  moveSpeed: number,
  keysHeld: Set<string>,
  speedScale: number,
  shiftHeld: boolean
): void {
  if (keysHeld.size === 0) return
  const speed = moveSpeed * speedScale * (shiftHeld ? SHIFT_MULT : 1)

  camera.getWorldDirection(_forward)
  _right.setFromMatrixColumn(camera.matrix, 0).normalize()

  _delta.set(0, 0, 0)
  if (keysHeld.has('w')) _delta.add(_forward)
  if (keysHeld.has('s')) _delta.sub(_forward)
  if (keysHeld.has('d')) _delta.add(_right)
  if (keysHeld.has('a')) _delta.sub(_right)
  if (keysHeld.has('e')) _delta.add(WORLD_UP)
  if (keysHeld.has('q')) _delta.sub(WORLD_UP)

  if (_delta.lengthSq() < 1e-12) return
  _delta.normalize().multiplyScalar(speed * dt)
  camera.position.add(_delta)
}

export function applyLook(camera: THREE.PerspectiveCamera, dx: number, dy: number): void {
  if (dx === 0 && dy === 0) return
  camera.rotation.order = 'YXZ'
  camera.rotation.y -= dx * LOOK_SENS
  camera.rotation.x -= dy * LOOK_SENS
  const limit = Math.PI / 2 - 0.01
  camera.rotation.x = THREE.MathUtils.clamp(camera.rotation.x, -limit, limit)
}

export function applyWheel(
  camera: THREE.PerspectiveCamera,
  deltaY: number,
  moveSpeed: number
): void {
  camera.getWorldDirection(_forward)
  const sign = deltaY > 0 ? -1 : 1
  _forward.multiplyScalar(sign * WHEEL_DOLLY * moveSpeed * 0.1)
  camera.position.add(_forward)
}

export function lookAt(
  camera: THREE.PerspectiveCamera,
  target: THREE.Vector3 | { x: number; y: number; z: number },
  position?: THREE.Vector3 | { x: number; y: number; z: number }
): void {
  if (position) {
    if (position instanceof THREE.Vector3) camera.position.copy(position)
    else camera.position.set(position.x, position.y, position.z)
  }
  if (target instanceof THREE.Vector3) _target.copy(target)
  else _target.set(target.x, target.y, target.z)
  camera.lookAt(_target)
  camera.rotation.order = 'YXZ'
}

/** Point the orbit target 8m ahead — legacy hook for focusSelection. */
export function syncOrbitTarget(
  camera: THREE.PerspectiveCamera,
  controlsTarget: THREE.Vector3
): void {
  camera.getWorldDirection(_forward)
  controlsTarget.copy(camera.position).add(_forward.multiplyScalar(8))
}
