import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import '../styles/create.css'
import { AuthContext } from '../context/Auth.context'
import { useContext } from 'react'
import { apiBaseUrl } from '../config'

const CreateBeat = ({ selectedSounds }) => {
  const [beatMakerName, setbeatMakerName] = useState('')
  const nav = useNavigate()
  const { user}=useContext(AuthContext)

  const createBeatMaker = async () => {
    try {
      if (!user) {
        // If user is not logged in, navigate to the signup page
        nav('/signup');
        return;
      }
      // Filter out null values from selectedSounds array
      const filteredSounds = selectedSounds.filter(sound => sound !== null)

      // Send filtered selected sounds to create a new drum kit
      const response = await axios.post(`${apiBaseUrl}/beatMaker`, {
        name: beatMakerName,
        drumPads: filteredSounds.map(sound => sound._id), // Assuming each sound has an _id property
        user,
      })
      console.log('xxxxxxx',user)

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
            <button className='submitUpdate'onClick={createBeatMaker}>Create BeatMaker</button>
          </div>
        </>
      )}
    </div>
  )
}

export default CreateBeat
