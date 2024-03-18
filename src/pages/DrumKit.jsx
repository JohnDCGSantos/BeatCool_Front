import { useParams } from 'react-router-dom'
import DrumKitPage from './DrumKitPage'
const DrumKit = () => {
  const { id } = useParams()

  return (
    <div className='drum'>
      <DrumKitPage id={id} />
    </div>
  )
}

export default DrumKit
