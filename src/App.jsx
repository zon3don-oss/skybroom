import { Suspense, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { KeyboardControls } from '@react-three/drei'
import { Physics } from '@react-three/rapier'
import { keyMap } from './systems/controls.js'
import { createFlightState } from './systems/flightPhysics.js'
import Pitch from './components/Pitch.jsx'
import Player from './components/Player.jsx'
import CameraRig from './components/CameraRig.jsx'

export default function App() {
  // Shared, mutable flight state. Player writes it; CameraRig reads it.
  // Created once and mutated in place, so per-frame updates never re-render React.
  const [flight] = useState(createFlightState)

  return (
    <KeyboardControls map={keyMap}>
      <Canvas shadows gl={{ antialias: true }} dpr={[1, 2]}>
        <Suspense fallback={null}>
          <Physics timeStep="vary">
            <Pitch />
            {/* Player before CameraRig so the camera reads this frame's position. */}
            <Player flight={flight} />
          </Physics>
          <CameraRig flight={flight} />
        </Suspense>
      </Canvas>
    </KeyboardControls>
  )
}
