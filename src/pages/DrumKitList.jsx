import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import '../styles/lists.css'

const DrumKitList = ({ showCheckboxes, onSelect }) => {
  const [drumKits, setDrumKits] = useState([])
  const nav = useNavigate()
  const [selectedDrumKits, setSelectedDrumKits] = useState([])

  useEffect(() => {
    const fetchDrumKits = async () => {
      try {
        const response = await axios.get('http://localhost:5005/drumkits')
        setDrumKits(response.data)
      } catch (error) {
        console.error('Error fetching drum kits:', error)
      }
    }
    fetchDrumKits()
  }, [])

  const handleDrumKitClick = async drumKitId => {
    try {
      // Navigate to the DrumKitPage with the selected drum kit ID
      nav(`/drumkits/${drumKitId}`) // Pass the drumKitId as a parameter in the URL
    } catch (error) {
      console.error('Error navigating to drum kit:', error)
    }
  }

  const handleDrumKitCheckboxChange = drumKitId => {
    setSelectedDrumKits(prevSelectedDrumKits => {
      if (prevSelectedDrumKits.includes(drumKitId)) {
        return prevSelectedDrumKits.filter(id => id !== drumKitId)
      } else {
        return [...prevSelectedDrumKits, drumKitId]
      }
    })
  }

  const handleConfirmSelection = () => {
    // Pass the selected drum kits to the parent component
    onSelect(selectedDrumKits)
  }

  return (
    <>
      <div className='drumKitListTitle'>
        <h2>Drum Kits</h2>
      </div>
      <div className='drumKitList'>
        <ul>
          {drumKits.map(drumKit => (
            <div key={drumKit._id}>
              <li onClick={() => handleDrumKitClick(drumKit._id)}>{drumKit.name}</li>
              {showCheckboxes && (
                <li>
                  <input
                    type='checkbox'
                    id={drumKit._id}
                    checked={selectedDrumKits.includes(drumKit._id)}
                    onChange={() => handleDrumKitCheckboxChange(drumKit._id)}
                  />
                  <label htmlFor={drumKit._id}></label>
                </li>
              )}
            </div>
          ))}
        </ul>
        {showCheckboxes && <button onClick={handleConfirmSelection}>Confirm Selection</button>}
      </div>
    </>
  )
}

export default DrumKitList
