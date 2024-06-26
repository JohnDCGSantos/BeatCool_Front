import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/Auth.context'
import { useContext } from 'react'
import { apiBaseUrl } from '../config'

const CreateDrumKit = ({ selectedSounds }) => {
  const [drumKitName, setDrumKitName] = useState('')
  const nav = useNavigate()
  const { user}=useContext(AuthContext)


  const createDrumKit = async () => {
    
    try {
      if (!user) {
        const confirmLogin = window.confirm("Please login or sign up to create a drum kit. Would you like to log in now?");
        if (confirmLogin) {
          nav('/login');
        }
        return;
      }

      // Filter out null values from selectedSounds array
      const filteredSounds = selectedSounds.filter(sound => sound !== null)

      // Send filtered selected sounds to create a new drum kit
      const response = await axios.post(`${apiBaseUrl}/drumkits`, {
        name: drumKitName,
        drumPads: filteredSounds.map(sound => sound._id),
         user,
      })
      console.log('ppppp',user)
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
          <button className='submitUpdate'onClick={createDrumKit}>Create Drum Kit</button>
        </div>
      )}
    </div>
  )
}

export default CreateDrumKit
