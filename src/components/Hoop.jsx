import { CuboidCollider, CylinderCollider, RigidBody } from '@react-three/rapier'

const GOLD = { color: '#e0b43a', metalness: 0.85, roughness: 0.25 }

// One golden goal: a ring on top of a post. The ring faces along z,
// so you fly through it when travelling down the pitch.
export default function Hoop({ position = [0, 0, 0], postHeight = 12, ringRadius = 3 }) {
  const ringY = postHeight + ringRadius

  return (
    <RigidBody type="fixed" colliders={false} position={position}>
      {/* Post */}
      <mesh position={[0, postHeight / 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.2, 0.3, postHeight, 24]} />
        <meshStandardMaterial {...GOLD} />
      </mesh>
      <CylinderCollider args={[postHeight / 2, 0.3]} position={[0, postHeight / 2, 0]} />

      {/* Ring */}
      <mesh position={[0, ringY, 0]} castShadow>
        <torusGeometry args={[ringRadius, 0.22, 24, 64]} />
        <meshStandardMaterial {...GOLD} />
      </mesh>
      {/* Thin sensor disc through the ring; Phase 3 will use it to detect goals. */}
      <CuboidCollider
        sensor
        args={[ringRadius * 0.8, ringRadius * 0.8, 0.2]}
        position={[0, ringY, 0]}
      />
    </RigidBody>
  )
}
