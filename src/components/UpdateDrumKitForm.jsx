// DrumKitForm.js
import { useState, } from 'react'
import Sounds from './Sounds'
import '../index.css'
const UpdateDrumKitForm = ({ onSubmit, defaultValues, sounds, selectedOption, playSound, preloadSounds }) => {
  const [name, setName] = useState(defaultValues.name || '')
  const [drumPads, setDrumPads] = useState(defaultValues.drumPads || [])

  

  const handleSubmit = event => {
    event.preventDefault()
    onSubmit({ name, drumPads }) // Include selectedSounds in the submission
    console.log(name,drumPads)
  }

  const handleSoundClick = (event, soundUrl) => {
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
      <div className='name'>
      <label>
        Name:
        <input style={{backgroundColor:'rgba(0,0,0,0.2)'}} value={name} id='name' onChange={event => setName(event.target.value)} />
      </label></div>
      {/* Additional fields for updating drum kit properties */}
      {sounds && (
        <Sounds
          sounds={sounds}
          selectedSounds={drumPads}
          playSound={playSound}
preloadSounds={preloadSounds}

          handleSoundClick={handleSoundClick}
          handleSoundSelect={handleSoundSelect}
selectedOption={selectedOption}
      />
      )}
      <div className='centerBtn'>
      <button className='submitUpdate' type='submit'>Update</button></div>
    </form>
      )
}
   

export default UpdateDrumKitForm
