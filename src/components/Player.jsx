import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useKeyboardControls } from '@react-three/drei'
import { CapsuleCollider, RigidBody } from '@react-three/rapier'
import { Euler, MathUtils, Quaternion } from 'three'
import { FLIGHT, LEAN } from '../systems/controls.js'
import { stepFlight } from '../systems/flightPhysics.js'
import { getPhase, PHASES } from '../systems/gameState.js'

const IDLE_INPUT = { forward: false, back: false, left: false, right: false, up: false, down: false }
const MAX_DT = 0.1 // avoid huge jumps after a tab switch

// Reused every frame (no allocations in the loop).
const euler = new Euler()
const quat = new Quaternion()

// flight: the shared flight state from createFlightState(), also read by CameraRig.
export default function Player({ flight, color = '#d63a3a' }) {
  const body = useRef()
  const visual = useRef()
  const [, getKeys] = useKeyboardControls()
  const { x, y, z } = flight.position

  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, MAX_DT)
    const playing = getPhase() === PHASES.PLAYING

    // Input -> Update. During the intro the player hovers in place.
    if (playing) stepFlight(flight, getKeys(), dt)
    else stepFlight(flight, IDLE_INPUT, 0)

    // Move the kinematic body (it can never tip over).
    if (body.current) {
      const p = flight.position
      body.current.setNextKinematicTranslation(p)
      euler.set(0, flight.yaw, 0)
      quat.setFromEuler(euler)
      body.current.setNextKinematicRotation(quat)
    }

    // Visual lean: roll into turns, pitch with climb/dive. Only the mesh tilts.
    if (visual.current) {
      const turnAmount = flight.yawRate / FLIGHT.turnRate // -1..1
      const climbAmount = flight.verticalSpeed / FLIGHT.climbSpeed // -1..1
      const r = visual.current.rotation
      r.z = MathUtils.damp(r.z, turnAmount * LEAN.maxRoll, LEAN.response, dt)
      r.x = MathUtils.damp(r.x, climbAmount * LEAN.maxPitch, LEAN.response, dt)
    }
  })

  return (
    <RigidBody ref={body} type="kinematicPosition" colliders={false} position={[x, y, z]}>
      <CapsuleCollider args={[0.35, 0.4]} position={[0, 0.55, 0]} />

      <group ref={visual}>
        {/* Rider */}
        <mesh position={[0, 0.75, 0.1]} castShadow>
          <capsuleGeometry args={[0.38, 0.7, 8, 24]} />
          <meshStandardMaterial color={color} roughness={0.45} />
        </mesh>

        {/* Broom handle, pointing forward (-z) */}
        <mesh rotation-x={Math.PI / 2} castShadow>
          <cylinderGeometry args={[0.06, 0.07, 2.6, 16]} />
          <meshStandardMaterial color="#7a4a24" roughness={0.7} />
        </mesh>

        {/* Bristles at the back */}
        <mesh position={[0, 0, 1.55]} rotation-x={-Math.PI / 2} castShadow>
          <coneGeometry args={[0.28, 0.8, 16]} />
          <meshStandardMaterial color="#c9a25a" roughness={0.9} />
        </mesh>
      </group>
    </RigidBody>
  )
}
