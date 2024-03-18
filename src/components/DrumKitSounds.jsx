import { useState, useEffect } from 'react'
import '../styles/drumKitPage.css'

function DrumKitSounds({ drumSounds, handleSoundClick }) {
  const [keyAssignments, setKeyAssignments] = useState({})

  useEffect(() => {
    if (drumSounds) {
      // Add null check here
      const keys = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ç', 'z', 'x', 'c']

      const newKeyAssignments = {}

      drumSounds.forEach((sound, index) => {
        const soundUrl = sound?.soundUrl // Add null check here
        if (soundUrl) {
          newKeyAssignments[soundUrl] = keys[index % keys.length]
        }
      })

      setKeyAssignments(newKeyAssignments)
    }
  }, [drumSounds])

  useEffect(() => {
    const handleKeyDown = event => {
      if (drumSounds) {
        // Add null check here
        const soundUrl = Object.keys(keyAssignments).find(
          url => keyAssignments[url] === event.key.toLowerCase()
        )
        if (soundUrl && drumSounds.find(sound => sound?.soundUrl === soundUrl)) {
          // Add null check here
          handleSoundClick(soundUrl)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [keyAssignments, drumSounds, handleSoundClick])

  return (
    <div className='drum-kit-sounds2'>
      {drumSounds &&
        drumSounds.map(
          (
            drumSound // Add null check here
          ) => (
            <div className='btn' key={drumSound?.soundUrl}>
              <button onClick={() => handleSoundClick(drumSound?.soundUrl)}>
                {drumSound?.name}
              </button>
            </div>
          )
        )}
    </div>
  )
}

export default DrumKitSounds
