import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import { MathUtils, Vector3 } from 'three'
import { CAMERA } from '../systems/controls.js'
import { headingToForward } from '../systems/flightPhysics.js'
import { getPhase, PHASES, setPhase } from '../systems/gameState.js'

const MAX_DT = 0.1
const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

// Reused every frame.
const fwd = { x: 0, z: 0 }
const desiredPos = new Vector3()
const desiredLook = new Vector3()
const introStart = new Vector3(CAMERA.introStart.x, CAMERA.introStart.y, CAMERA.introStart.z)
const introLookStart = new Vector3(0, 0, 0) // pitch centre

function dampVector(v, target, lambda, dt) {
  v.x = MathUtils.damp(v.x, target.x, lambda, dt)
  v.y = MathUtils.damp(v.y, target.y, lambda, dt)
  v.z = MathUtils.damp(v.z, target.z, lambda, dt)
}

// Third-person follow camera with a cinematic 3-second fly-in.
export default function CameraRig({ flight }) {
  const camera = useRef()
  const introTime = useRef(0)
  const look = useRef(new Vector3().copy(introLookStart))

  useFrame((_, rawDt) => {
    const cam = camera.current
    if (!cam) return
    const dt = Math.min(rawDt, MAX_DT)

    // Where the camera wants to be: behind and above, looking just ahead.
    const p = flight.position
    headingToForward(flight.yaw, fwd)
    desiredPos.set(
      p.x - fwd.x * CAMERA.followDistance,
      p.y + CAMERA.followHeight,
      p.z - fwd.z * CAMERA.followDistance,
    )
    desiredLook.set(p.x + fwd.x * CAMERA.lookAhead, p.y + 1, p.z + fwd.z * CAMERA.lookAhead)

    if (getPhase() === PHASES.INTRO) {
      introTime.current += dt
      const t = Math.min(introTime.current / CAMERA.introDuration, 1)
      const e = easeInOutCubic(t)
      cam.position.lerpVectors(introStart, desiredPos, e)
      look.current.lerpVectors(introLookStart, desiredLook, e)
      if (t >= 1) setPhase(PHASES.PLAYING)
    } else {
      // Frame-rate independent smoothing.
      dampVector(cam.position, desiredPos, CAMERA.followResponse, dt)
      dampVector(look.current, desiredLook, CAMERA.followResponse * 1.5, dt)
    }

    cam.lookAt(look.current)
  })

  return (
    <PerspectiveCamera
      ref={camera}
      makeDefault
      fov={CAMERA.fov}
      near={0.1}
      far={1000}
      position={[introStart.x, introStart.y, introStart.z]}
    />
  )
}
