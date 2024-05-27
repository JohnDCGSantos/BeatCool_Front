import { useState, /*useRef,*/ useEffect, useContext } from 'react'
import Sounds from '../components/Sounds'
import CreateDrumKit from '../components/CreateDrumKit'
import CreateBeat from '../components/CreateBeat'
import '../styles/create.css'
import { AuthContext  } from '../context/Auth.context'
import { useNavigate } from 'react-router-dom'
import { apiBaseUrl } from '../config'

const DrumPads = () => {
  const [isLoading, setIsLoading] = useState(true)
  
  const [sounds, setSounds] = useState([])
  const [selectedSounds, setSelectedSounds] = useState([])
  //const audioRefs = useRef({})
  const [selectedOption, setSelectedOption] = useState('')
  const {authenticateUser, user}=useContext(AuthContext)
const nav =useNavigate()

/*const preloadSounds = sounds => {
  sounds.forEach(sound => {
    const audio = new Audio(sound.soundUrl)
    audio.preload = 'auto'
    audioRefs.current[sound.soundUrl] = audio
  })
}*/
  useEffect(() => {
    const fetchSounds = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/pads`)
        if (response.ok) {
          const parsed = await response.json()
          console.log(parsed)
          setSounds(parsed)
        //  preloadSounds(parsed)
          setIsLoading(false) // Set loading state to false once sounds are loaded
        } else {
          console.error('Error fetching sounds:', response.status)
          setIsLoading(false) // Set loading state to false if there's an error
        }
      } catch (error) {
        console.error('Error fetching sounds:', error)
        setIsLoading(false) // Set loading state to false if there's an error
      }
    }
    fetchSounds()
  }, [])


useEffect(()=>{
authenticateUser()
},[])


  const handleSoundSelect = sound => {
    setSelectedSounds(prevSelected => {
      const isSelected = prevSelected.some(prevSound => prevSound.soundUrl === sound.soundUrl)
      if (isSelected) {
        // If the sound is already selected, remove it
        return prevSelected.filter(prevSound => prevSound.soundUrl !== sound.soundUrl)
      } else {
        // If the sound is not selected, add it to the selectedSounds array
        return [...prevSelected, sound]
      }
    })
  }

  


  const handleCombo = () => {
   nav('/combinedCreator')
  }


  /*const playSound = soundUrl => {
    const audio = audioRefs.current[soundUrl]
    if (audio) {
      audio.currentTime = 0
      audio.play().catch(error => console.error(`Failed to play sound: ${error}`))
    }
  }*/

  /*const handleSoundClick = soundUrl => {
    playSound(soundUrl)
    
  }*/

  const handleOptionSelect = option => {
    setSelectedOption(option)
  }

  return (
    <div className='imageCreate' >
     <div className= 'shadows'>
      <div className='create'>
       <div className='mainerContainer'>
      {isLoading ? (
        <p>Loading sounds...</p>
      ) : (
        <div className='intro'>
          <div className='titcreate'>
        <h1>Create something,  &nbsp;  { user ? user.username : null}&nbsp;!!</h1>
         </div>
          <div className='selectCard'>
            {selectedOption === '' ? (
              <div className='selecter'>
                <div className='optionSelect'>
                  <div className='selectBtnContainer'>
                    <button className='selected-sound-items'onClick={() => handleOptionSelect('beatMaker')}>Beat Maker</button>
                    <button className='selected-sound-items' onClick={() => handleOptionSelect('drumKit')}>Drum Kit</button>
                    <button className='selected-sound-items' onClick={handleCombo}>Combined</button>

                  </div>
                </div>
              </div>
            ) : selectedOption === 'beatMaker' ? (
              <>
                <Sounds
                  sounds={sounds}
                  handleSoundSelect={handleSoundSelect}
                  selectedSounds={selectedSounds}
                />
                <CreateBeat selectedSounds={selectedSounds} />
              </>
            ) : (
              <>
                <Sounds
                  sounds={sounds}
                  handleSoundSelect={handleSoundSelect}
                  selectedSounds={selectedSounds}
                />
                <CreateDrumKit selectedSounds={selectedSounds} />
              </>
            )}
          </div>
        </div>
      )}
       </div>
      </div> 
     </div>
    </div> )
}

export default DrumPads
