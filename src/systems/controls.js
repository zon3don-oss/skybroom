// Key bindings and all tuning numbers for Phase 1 live here.

export const Controls = {
  forward: 'forward',
  back: 'back',
  left: 'left',
  right: 'right',
  up: 'up',
  down: 'down',
}

// Used by drei's <KeyboardControls map={keyMap}>.
export const keyMap = [
  { name: Controls.forward, keys: ['KeyW', 'ArrowUp'] },
  { name: Controls.back, keys: ['KeyS', 'ArrowDown'] },
  { name: Controls.left, keys: ['KeyA', 'ArrowLeft'] },
  { name: Controls.right, keys: ['KeyD', 'ArrowRight'] },
  { name: Controls.up, keys: ['Space'] },
  { name: Controls.down, keys: ['ShiftLeft', 'ShiftRight'] },
]

export const PITCH = {
  width: 120, // x axis
  length: 200, // z axis; the hoops sit at each end
  hoopOffset: 88, // distance of each hoop from the centre along z
}

export const FLIGHT = {
  // Forward speed (units per second). The broom never stops: minSpeed > 0.
  cruiseSpeed: 9,
  maxSpeed: 24, // holding W
  minSpeed: 4, // holding S
  speedResponse: 2.5, // how fast speed approaches its target (damping lambda)

  // Turning (A/D rotate the heading).
  turnRate: 1.9, // radians per second at full turn
  turnResponse: 6,

  // Vertical (Space / Shift).
  climbSpeed: 9,
  verticalResponse: 4,
  minAltitude: 1.2,
  maxAltitude: 45,

  // Past the pitch edge the broom gently steers back toward the centre;
  // a hard wall sits a little further out.
  boundsX: PITCH.width / 2,
  boundsZ: PITCH.length / 2,
  hardMargin: 20,
  returnStrength: 1.5,

  // Spawn: near one end, facing the far hoop (-z).
  start: { x: 0, y: 6, z: 70, yaw: 0 },
}

export const LEAN = {
  maxRoll: 0.6, // radians at full turn
  maxPitch: 0.35, // radians at full climb / dive
  response: 7,
}

export const CAMERA = {
  fov: 55,
  followDistance: 13, // behind the player
  followHeight: 6.5, // above the player
  lookAhead: 6, // look at a point in front of the player
  followResponse: 4,
  introDuration: 3, // seconds
  introStart: { x: -140, y: 90, z: 220 }, // far away, high and behind
}
