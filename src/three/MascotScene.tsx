import { PerspectiveCamera } from '@react-three/drei'
import Mascot from './Mascot/Mascot'

export default function MascotScene() {
  return (
    <>
      <PerspectiveCamera makeDefault fov={38} position={[0, 0, 6]} />
      <ambientLight intensity={0.85} />
      <directionalLight position={[3, 4, 5]} intensity={2.4} />
      <pointLight position={[-4, -2, 3]} intensity={12} color="#00e5ff" distance={14} />
      <pointLight position={[4, 3, 2]} intensity={10} color="#fff3e0" distance={12} />
      <Mascot />
    </>
  )
}
