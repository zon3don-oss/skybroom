import { MathUtils } from 'three'
import { FLIGHT } from './controls.js'

const { damp, clamp } = MathUtils

// The flight state is one mutable object, updated in place every frame
// (no allocations in the loop).
export function createFlightState(start = FLIGHT.start) {
  return {
    position: { x: start.x, y: start.y, z: start.z },
    yaw: start.yaw, // 0 faces -z
    speed: FLIGHT.cruiseSpeed,
    yawRate: 0,
    verticalSpeed: 0,
  }
}

export function resetFlightState(state, start = FLIGHT.start) {
  state.position.x = start.x
  state.position.y = start.y
  state.position.z = start.z
  state.yaw = start.yaw
  state.speed = FLIGHT.cruiseSpeed
  state.yawRate = 0
  state.verticalSpeed = 0
}

// Forward unit vector for a heading, written into `out`.
export function headingToForward(yaw, out) {
  out.x = -Math.sin(yaw)
  out.z = -Math.cos(yaw)
  return out
}

const fwd = { x: 0, z: 0 }

/**
 * Advance the flight state by dt seconds.
 * input: { forward, back, left, right, up, down } booleans.
 * Everything is scaled by dt, so behaviour does not depend on frame rate.
 */
export function stepFlight(state, input, dt, cfg = FLIGHT) {
  // Speed: W speeds up, S slows down, otherwise drift back to cruise.
  let targetSpeed = cfg.cruiseSpeed
  if (input.forward && !input.back) targetSpeed = cfg.maxSpeed
  else if (input.back && !input.forward) targetSpeed = cfg.minSpeed
  state.speed = damp(state.speed, targetSpeed, cfg.speedResponse, dt)

  // Heading: A turns left (+yaw), D turns right (-yaw).
  const turn = (input.left ? 1 : 0) - (input.right ? 1 : 0)
  state.yawRate = damp(state.yawRate, turn * cfg.turnRate, cfg.turnResponse, dt)
  state.yaw += state.yawRate * dt

  // Vertical: Space climbs, Shift dives.
  const climb = (input.up ? 1 : 0) - (input.down ? 1 : 0)
  state.verticalSpeed = damp(
    state.verticalSpeed,
    climb * cfg.climbSpeed,
    cfg.verticalResponse,
    dt,
  )

  // Integrate position along the heading.
  headingToForward(state.yaw, fwd)
  const p = state.position
  p.x += fwd.x * state.speed * dt
  p.z += fwd.z * state.speed * dt
  p.y += state.verticalSpeed * dt

  // Altitude limits: stop vertical motion at the floor / ceiling.
  if (p.y <= cfg.minAltitude || p.y >= cfg.maxAltitude) {
    p.y = clamp(p.y, cfg.minAltitude, cfg.maxAltitude)
    state.verticalSpeed = 0
  }

  // Soft boundary: once outside the pitch, steer the heading back toward the centre.
  if (Math.abs(p.x) > cfg.boundsX || Math.abs(p.z) > cfg.boundsZ) {
    const homeYaw = Math.atan2(p.x, p.z) // heading that points at (0, 0)
    const diff = Math.atan2(Math.sin(homeYaw - state.yaw), Math.cos(homeYaw - state.yaw))
    state.yaw += diff * Math.min(1, cfg.returnStrength * dt)
  }

  // Hard wall a little further out.
  const hx = cfg.boundsX + cfg.hardMargin
  const hz = cfg.boundsZ + cfg.hardMargin
  p.x = clamp(p.x, -hx, hx)
  p.z = clamp(p.z, -hz, hz)

  return state
}
