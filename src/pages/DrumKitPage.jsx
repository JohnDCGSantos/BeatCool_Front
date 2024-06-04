import { useParams } from 'react-router-dom'
import { useState } from 'react';
import DrumKitTutorial from '../components/DrumKitTutorial';
import DrumKit from '../components/DrumKit'
const DrumKitPage = () => {
  const [showTutorial, setShowTutorial] = useState(true);
  const handleTutorialClose = () => {
    setShowTutorial(false);
  };
  const { id } = useParams()

  return(   
  <div className='imageKitsPlay' >
     
  <div className= 'shadows'>
    {showTutorial ? (
         <DrumKitTutorial onClose={handleTutorialClose} />):
    
      <DrumKit id={id} />
    
  }
  
      </div>

      </div>
  
)
}

export default DrumKitPage
