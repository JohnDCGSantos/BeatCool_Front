import { useState } from 'react'
import Sounds from './Sounds'
import '../styles/create.css'
const UpdateCreatorForm = ({ onSubmit, defaultValues, sounds, playSound, preloadSounds }) => {
  const [name, setName] = useState(defaultValues.name || '')
  const [drumPads, setDrumPads] = useState(defaultValues.drumPads || [])

  

  const handleSubmit = event => {
    event.preventDefault()
    onSubmit({ name, drumPads }) // Include selectedSounds in the submission
    console.log(name,setDrumPads)
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
      <div className='name'>
      <label>
        Name:
        <input value={name} id='name'  onChange={event => setName(event.target.value)} />
      </label></div>
      {sounds && (
        <Sounds
          sounds={sounds}
          selectedSounds={drumPads}
          handleSoundSelect={handleSoundSelect}
          preloadSounds={preloadSounds}
          playSound={playSound}


        />
      )}
      <div className='centerBtn'>
      <button className='submitUpdate' type='submit'>Update BeatCreator</button></div>
    </form>
  )
}

export default UpdateCreatorForm
