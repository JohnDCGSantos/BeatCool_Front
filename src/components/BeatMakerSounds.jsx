import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import '../styles/create.css'

const BeatMakerSounds = ({ selectedSounds }) => {
  const [beatMakerName, setbeatMakerName] = useState('')
  const nav = useNavigate()

  const createBeatMaker = async () => {
    try {
      // Filter out null values from selectedSounds array
      const filteredSounds = selectedSounds.filter(sound => sound !== null)

      // Send filtered selected sounds to create a new drum kit
      const response = await axios.post('http://localhost:5005/beatMaker', {
        name: beatMakerName,
        drumPads: filteredSounds.map(sound => sound._id), // Assuming each sound has an _id property
      })
      nav(`/beatCreator`)
      console.log('New drum kit created:', response.data)
    } catch (error) {
      console.error('Error creating drum kit:', error)
    }
  }

  return (
    <div>
      {selectedSounds.length > 0 && (
        <>
          <div className='createBtnContainer'>
            <input
              type='text'
              placeholder='Enter beat maker name'
              value={beatMakerName}
              onChange={e => setbeatMakerName(e.target.value)}
            />
            <button onClick={createBeatMaker}>Create BeatMaker</button>
          </div>
        </>
      )}
    </div>
  )
}

export default BeatMakerSounds
