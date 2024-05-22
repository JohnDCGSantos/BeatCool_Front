import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import DrumKitSounds from './DrumKitSounds'
import '../styles/drumKitPage.css'
import '../styles/create.css'
import { apiBaseUrl } from '../config'


const DrumKit = ({ id }) => {
  const [drumKit, setDrumKit] = useState(null)
  const [drumSounds, setDrumSounds] = useState([])
  const[isLoading, setIsLoading]=useState(true)
  const audioRefs = useRef({})
 

  useEffect(() => {
    const fetchDrumKit = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/drumkits/${id}`)
        setDrumKit(response.data)
        setDrumSounds(response.data.drumPads) 
      } catch (error) {
        console.error('Error fetching drum kit:', error)
      }
    }
    fetchDrumKit()
  }, [id])
  
  
  const preloadSounds = (drumSounds) => {
   let loadedCount = 0;
   drumSounds.forEach( drumSound => {
    const audio =new Audio(drumSound.soundUrl)
    audio.preload = 'auto';
    audio.addEventListener('loadedmetadata', () => {
    //audio.addEventListener('canplaythrough', () => {

      loadedCount++;
      if (loadedCount === drumSounds.length) {
       setIsLoading(false); // Set isLoading to false when all sounds are loaded
      }
    });
    audioRefs.current[drumSound.soundUrl] = audio;
  });
// If drumSounds array is empty, setIsLoading(false) immediately
   if (drumSounds.length === 0) {
    setIsLoading(false);
  }
};

  
  const handleSoundPreLoadClik = () => {
    setIsLoading(true); 
    preloadSounds(drumSounds); 
    console.log('cliked', drumSounds)
  }

  const playSound =  soundUrl => {
    const audio =audioRefs.current[soundUrl]
    if (audio) {
      console.log(audio)
      audio.pause()
      audio.currentTime = 0
      audio.play().catch(error => console.error(`Failed to play sound: ${error}`))
    }
  }

  
  const handleSoundClick = (drumSound) => {
    playSound(drumSound)  
  }
  
 if (!drumKit) {
    return <div>Loading...</div>
  }
 
  
 return isLoading?( 
    <button style={{marginTop:'80px'}} onClick={handleSoundPreLoadClik}>hhh</button>
  ):
  (
    <div className='playDr'>
        <DrumKitSounds
          drumSounds={drumSounds}
          handleSoundClick={handleSoundClick}
        /> 
    </div>
  )


}


export default DrumKit