import { Grid, Sky } from '@react-three/drei'
import { CuboidCollider, RigidBody } from '@react-three/rapier'
import { PITCH } from '../systems/controls.js'
import Hoop from './Hoop.jsx'

export default function Pitch() {
  const { width, length, hoopOffset } = PITCH

  return (
    <>
      <Sky sunPosition={[80, 60, 40]} turbidity={4} rayleigh={0.6} />
      <fog attach="fog" args={['#bfe3ff', 120, 380]} />

      <hemisphereLight args={['#dff1ff', '#3d6b35', 0.7]} />
      <directionalLight
        position={[60, 90, 40]}
        intensity={2.2}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
        shadow-camera-left={-120}
        shadow-camera-right={120}
        shadow-camera-top={120}
        shadow-camera-bottom={-120}
        shadow-camera-near={1}
        shadow-camera-far={300}
      />

      {/* Surrounding grass so the world never ends at the pitch edge */}
      <mesh rotation-x={-Math.PI / 2} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[1200, 1200]} />
        <meshStandardMaterial color="#35712d" roughness={1} />
      </mesh>

      {/* Pitch floor */}
      <RigidBody type="fixed" colliders={false}>
        <mesh rotation-x={-Math.PI / 2} receiveShadow>
          <planeGeometry args={[width, length]} />
          <meshStandardMaterial color="#4a9a3f" roughness={0.95} />
        </mesh>
        <CuboidCollider args={[width / 2, 0.1, length / 2]} position={[0, -0.1, 0]} />
      </RigidBody>

      {/* Faint grid so speed and height are readable */}
      <Grid
        position={[0, 0.02, 0]}
        args={[width, length]}
        cellSize={5}
        cellThickness={0.6}
        cellColor="#5fb052"
        sectionSize={20}
        sectionThickness={1.1}
        sectionColor="#d9f2c9"
        fadeDistance={260}
        fadeStrength={1}
      />

      {/* Goals at opposite ends */}
      <Hoop position={[0, 0, -hoopOffset]} />
      <Hoop position={[0, 0, hoopOffset]} />
    </>
  )
}
