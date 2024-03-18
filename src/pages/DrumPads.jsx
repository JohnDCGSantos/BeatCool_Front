import { useState, useRef, useEffect } from 'react'
import Sounds from '../components/Sounds'
import DrumKitCreator from '../components/DrumKitCreator'
import BeatMakerSounds from '../components/BeatMakerSounds'
import '../styles/create.css'
const DrumPads = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [sounds, setSounds] = useState([])
  const [selectedSounds, setSelectedSounds] = useState([])
  const audioRefs = useRef({})
  const [selectedOption, setSelectedOption] = useState('')

  useEffect(() => {
    const fetchSounds = async () => {
      try {
        const response = await fetch('http://localhost:5005/pads')
        if (response.ok) {
          const parsed = await response.json()
          console.log(parsed)
          setSounds(parsed)
          preloadSounds(parsed)
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

  const preloadSounds = sounds => {
    sounds.forEach(sound => {
      const audio = new Audio(sound.soundUrl)
      audio.preload = 'auto'
      audioRefs.current[sound.soundUrl] = audio
    })
  }

  const playSound = soundUrl => {
    const audio = audioRefs.current[soundUrl]
    if (audio) {
      audio.currentTime = 0
      audio.play().catch(error => console.error(`Failed to play sound: ${error}`))
    }
  }

  const handleSoundClick = soundUrl => {
    playSound(soundUrl)
  }

  const handleOptionSelect = option => {
    setSelectedOption(option)
  }

  return (
    <div className='mainContainer'>
      {isLoading ? (
        <p>Loading sounds...</p>
      ) : (
        <>
          <h1>Create!!</h1>
          <div>
            {selectedOption.length > 0 && (
              <h4 className='genreAndCategoryTitle'>Select Genre and category </h4>
            )}
          </div>
          <div className='selectCard'>
            {selectedOption === '' ? (
              <div className='selecter'>
                <h2 className='selectOptionTitle'>Select an Option</h2>
                <div className='optionSelect'>
                  <div className='selectBtnContainer'>
                    <button onClick={() => handleOptionSelect('beatMaker')}>Beat Maker</button>
                    <button onClick={() => handleOptionSelect('drumKit')}>Drum Kit</button>
                  </div>
                </div>
              </div>
            ) : selectedOption === 'beatMaker' ? (
              <>
                <Sounds
                  sounds={sounds}
                  handleSoundClick={handleSoundClick}
                  handleSoundSelect={handleSoundSelect}
                  selectedSounds={selectedSounds}
                />
                <BeatMakerSounds selectedSounds={selectedSounds} />
              </>
            ) : (
              <>
                <Sounds
                  sounds={sounds}
                  handleSoundClick={handleSoundClick}
                  handleSoundSelect={handleSoundSelect}
                  selectedSounds={selectedSounds}
                />
                <DrumKitCreator selectedSounds={selectedSounds} />
              </>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default DrumPads
