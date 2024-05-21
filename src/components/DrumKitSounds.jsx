import { useState, useEffect } from 'react'
import '../styles/drumKitPage.css'

function DrumKitSounds({ drumSounds, handleSoundClick,playSound }) {
  const [keyAssignments, setKeyAssignments] = useState({})
  const [pressedKey, setPressedKey] = useState(null)
  const handleSoundRelease = () => {
    setPressedKey(null);
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
    handleSoundClick(soundUrl);
    setPressedKey(soundUrl); // Set pressed key state
  };
  const handleTouchEnd = () => {
    setPressedKey(null); // Reset pressed key state when touch ends
  };
  useEffect(() => {
    // Add passive: false to preventDefault in a touch event listener without causing the warning
    document.addEventListener('touchstart', (event) => {
      if (event.target.closest('.drum-sound-btn')) {
      event.preventDefault();
      }
    }, { passive: false });

    return () => {
      document.removeEventListener('touchstart', (event) => {
        
        if (event.target.closest('.drum-sound-btn')) {
          event.preventDefault();
          }
      });
    };
  }, []);


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
  onTouchStart={(event) =>
    handleTouchStart(event, drumSound.soundUrl)
  }
  onTouchEnd={(soundUrl) => handleTouchEnd(soundUrl)}

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

