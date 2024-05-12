import { useParams } from 'react-router-dom'
import BeatCreator from '../components/BeatCreator'

const BeatCreatorPage = () => {
  const { id } = useParams()

  return (
    <div className='imageKitsPlay' >
    <div className= 'shadows'>
      <BeatCreator id={id} />
     </div></div>
  )
}

export default BeatCreatorPage
