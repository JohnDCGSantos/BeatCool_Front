import { useParams } from 'react-router-dom'
import BeatCreator from '../components/BeatCreator'

const BeatCreatorPage = () => {
  const { id } = useParams()

  return (
    <>
      <BeatCreator id={id} />
    </>
  )
}

export default BeatCreatorPage
