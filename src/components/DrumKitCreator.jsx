import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const DrumKitCreator = ({ selectedSounds }) => {
  const [drumKitName, setDrumKitName] = useState('')
  const nav = useNavigate()

  const createDrumKit = async () => {
    try {
      // Filter out null values from selectedSounds array
      const filteredSounds = selectedSounds.filter(sound => sound !== null)

      // Send filtered selected sounds to create a new drum kit
      const response = await axios.post('http://localhost:5005/drumkits', {
        name: drumKitName,
        drumPads: filteredSounds.map(sound => sound._id), // Assuming each sound has an _id property
      })
      nav(`/drumkits`)
      console.log('New drum kit created:', response.data)
    } catch (error) {
      console.error('Error creating drum kit:', error)
    }
  }

  return (
    <div>
      {selectedSounds.length > 0 && (
        <div className='createBtnContainer'>
          <input
            type='text'
            placeholder='Enter drum kit name'
            value={drumKitName}
            onChange={e => setDrumKitName(e.target.value)}
          />
          <button onClick={createDrumKit}>Create Drum Kit</button>
        </div>
      )}
    </div>
  )
}

export default DrumKitCreator
