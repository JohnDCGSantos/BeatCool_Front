import { useParams } from 'react-router-dom'
import BeatCreator from '../components/BeatCreator'
import BeatMakerTutorial from '../components/BeatMakerTutorial'
import { useState } from 'react'
const BeatCreatorPage = () => {
  const { id } = useParams()
  const [showTutorial, setShowTutorial] = useState(true);

 

  const handleTutorialClose = () => {
    setShowTutorial(false);
  };
  return( 
  <div className='imageKitsPlay' >
    <div className= 'shadows'>
      
    {showTutorial ? (
    <BeatMakerTutorial onClose={handleTutorialClose} />):
      <BeatCreator id={id} />
  
}
     </div></div>
  )
}

export default BeatCreatorPage
