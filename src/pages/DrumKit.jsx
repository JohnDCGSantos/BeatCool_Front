import { useParams } from 'react-router-dom'
import DrumKitPage from './DrumKitPage'
const DrumKit = () => {
  const { id } = useParams()

  return (
    
      <DrumKitPage id={id} />
   
  )
}

export default DrumKit
