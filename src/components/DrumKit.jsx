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
    let loadedCount = 0
    drumSounds.forEach(drumSound => {
      const audioPool = Array.from({ length: 5 }, () => new Audio(drumSound.soundUrl))
      audioPool.forEach(audio => {
        audio.preload = 'auto'
        audio.addEventListener('loadedmetadata', () => {
          loadedCount++
          if (loadedCount === drumSounds.length * 5) {
            setIsLoading(false)
          }
        })
      })
      audioRefs.current[drumSound.soundUrl] = { pool: audioPool, index: 0 }
    })
    if (drumSounds.length === 0) {
      setIsLoading(false)
    }
  }

  
  const handleSoundPreLoadClik = () => {
    setIsLoading(true); 
    preloadSounds(drumSounds); 
    console.log('cliked', drumSounds)
  }

  const playSound = soundUrl => {
    const audioPool = audioRefs.current[soundUrl].pool
    const currentIndex = audioRefs.current[soundUrl].index
    const audio = audioPool[currentIndex]
    audio.pause()
    audio.currentTime = 0
    audio.play().catch(error => console.error(`Failed to play sound: ${error}`))
    audioRefs.current[soundUrl].index = (currentIndex + 1) % audioPool.length
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