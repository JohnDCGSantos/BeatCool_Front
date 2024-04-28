import { useState } from 'react'
import Sounds from '../components/Sounds'
import '../styles/create.css'
const CreatorForm = ({ onSubmit, defaultValues, sounds }) => {
  const [name, setName] = useState(defaultValues.name || '')
  const [drumPads, setDrumPads] = useState(defaultValues.drumPads || [])

  

  const handleSubmit = event => {
    event.preventDefault()
    onSubmit({ name, drumPads }) // Include selectedSounds in the submission
    console.log(name,setDrumPads)
  }

  const handleSoundClick = (soundUrl) => {
    // Handle sound click logic here
    console.log('Sound clicked:', soundUrl);
  }

  const handleSoundSelect = sound => {
    setDrumPads(prevSelected => {
      const isSelected = prevSelected.some(prevSound => prevSound.soundUrl === sound.soundUrl)
      if (isSelected) {
        // If the sound is already selected, remove it
        return prevSelected.filter(prevSound => prevSound.soundUrl !== sound.soundUrl)
      } else {
        // If the sound is not selected, add it to the selectedSounds array
        return [...prevSelected, sound]
      }
    })
    console.log(drumPads)
  }
  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input value={name} onChange={event => setName(event.target.value)} />
      </label>
      {/* Additional fields for updating drum kit properties */}
      {sounds && (
        <Sounds
          sounds={sounds}
          selectedSounds={drumPads}
          handleSoundClick={handleSoundClick}
          handleSoundSelect={handleSoundSelect}
        />
      )}
      <button type='submit'>Update BeatCreator</button>
    </form>
  )
}

export default CreatorForm
