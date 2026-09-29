import { View } from '@react-three/drei'
import MascotScene from './MascotScene'

/** Fixed fullscreen layer the bot lives in (tracked by the shared canvas). */
export default function MascotView() {
  return (
    <View className="mascot-view">
      <MascotScene />
    </View>
  )
}
