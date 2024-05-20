import { useState, useEffect } from 'react'
import '../styles/drumKitPage.css'

function DrumKitSounds({ drumSounds, handleSoundClick,playSound }) {
  const [keyAssignments, setKeyAssignments] = useState({})
  const [pressedKey, setPressedKey] = useState(null)
  const handleSoundRelease = () => {
    setPressedKey(null);
    console.log(pressedKey) // Reset pressed key state when mouse button is released
  };
  useEffect(() => {
    if (drumSounds) {
      const keys = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ç', 'z', 'x', 'c','v','b','n','m']

      const newKeyAssignments = {}

      drumSounds.forEach((sound, index) => {
        const soundUrl = sound?.soundUrl
        if (soundUrl) {
          newKeyAssignments[soundUrl] = keys[index % keys.length]
        }
      })

      setKeyAssignments(newKeyAssignments)
    }
  }, [drumSounds])
  const handleTouchStart = (event, soundUrl) => {
    event.preventDefault(); // Prevent default touch behavior
    handleSoundClick(soundUrl);
    setPressedKey(soundUrl); // Set pressed key state
  };
  useEffect(() => {
    const handleKeyDown = event => {
      if (drumSounds) {
        const soundUrl = Object.keys(keyAssignments).find(
          url => keyAssignments[url] === event.key.toLowerCase()
        )
        if (soundUrl && drumSounds.find(sound => sound?.soundUrl === soundUrl)) {
          handleSoundClick(soundUrl)
          setPressedKey(soundUrl) // Set pressed key state
        }
      }
    }

    const handleKeyUp = () => {
      setPressedKey(null) // Reset pressed key state when key is released
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [keyAssignments, drumSounds, handleSoundClick])

  

  
  return (
    <div className="drum-kit-sounds" id="drumKitSounds">
      {drumSounds &&
        drumSounds.map(drumSound => (
          <div className={`drum-sound-btn ${drumSound.soundUrl === pressedKey ? 'pressed' : ''}`} key={drumSound?.soundUrl}>
<button
  className={drumSound.soundUrl === pressedKey ? 'pressed' : ''}
  onMouseDown={() => handleSoundClick(drumSound.soundUrl)}
  onMouseUp={() => handleSoundRelease()}
  onTouchStart={(event) =>
    handleTouchStart(event, drumSound.soundUrl)
  }
  onTouchEnd={() => handleSoundRelease()}
>
         
              <span>{drumSound?.name}</span>
             
              <span className='span2'>{keyAssignments[drumSound?.soundUrl]}</span> 

            </button>
          </div>
        ))}
    </div>
  )
}

export default DrumKitSounds

