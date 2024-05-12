import { useParams } from 'react-router-dom'

import DrumKit from '../components/DrumKit'
const DrumKitPage = () => {

  const { id } = useParams()

  return (
    <div className='imageKitsPlay' >
 <div className= 'shadows'>
      <DrumKit id={id} />
      </div></div>
  )
}

export default DrumKitPage
