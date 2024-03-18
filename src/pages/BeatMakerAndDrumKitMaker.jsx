import { useState, useEffect } from 'react'
import axios from 'axios'

const BeatMakerAndDrumKitForm = () => {
  const [name, setName] = useState('')
  const [drumKits, setDrumKits] = useState([])
  const [beatMakers, setBeatMakers] = useState([])
  const [selectedDrumKits, setSelectedDrumKits] = useState([])
  const [selectedBeatMakers, setSelectedBeatMakers] = useState([])

  useEffect(() => {
    // Fetch drum kits
    const fetchDrumKits = async () => {
      try {
        const response = await axios.get('http://localhost:5005/drumkits')
        setDrumKits(response.data)
      } catch (error) {
        console.error('Error fetching drum kits:', error)
      }
    }

    // Fetch beat makers
    const fetchBeatMakers = async () => {
      try {
        const response = await axios.get('http://localhost:5005/beatmaker')
        setBeatMakers(response.data)
      } catch (error) {
        console.error('Error fetching beat makers:', error)
      }
    }

    fetchDrumKits()
    fetchBeatMakers()
  }, [])

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      const response = await axios.post('http://localhost:5005/beatMakerAndDrumKit', {
        name,
        drumKits: selectedDrumKits,
        beatMakers: selectedBeatMakers,
      })
      console.log('BeatMakerAndDrumKit created:', response.data)
      // Reset form fields
      setName('')
      setSelectedDrumKits([])
      setSelectedBeatMakers([])
    } catch (error) {
      console.error('Error creating BeatMakerAndDrumKit:', error)
    }
  }

  return (
    <div>
      <h2>Create New BeatMakerAndDrumKit</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor='name'>Name:</label>
          <input
            type='text'
            id='name'
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor='drumKits'>Select Drum Kits:</label>
          <select
            id='drumKits'
            multiple
            value={selectedDrumKits}
            onChange={e =>
              setSelectedDrumKits(Array.from(e.target.selectedOptions, option => option.value))
            }
            required
          >
            {drumKits.map(drumKit => (
              <option key={drumKit._id} value={drumKit._id}>
                {drumKit.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor='beatMakers'>Select Beat Makers:</label>
          <select
            id='beatMakers'
            multiple
            value={selectedBeatMakers}
            onChange={e =>
              setSelectedBeatMakers(Array.from(e.target.selectedOptions, option => option.value))
            }
            required
          >
            {beatMakers.map(beatMaker => (
              <option key={beatMaker._id} value={beatMaker._id}>
                {beatMaker.name}
              </option>
            ))}
          </select>
        </div>
        <button type='submit'>Create</button>
      </form>
    </div>
  )
}

export default BeatMakerAndDrumKitForm
