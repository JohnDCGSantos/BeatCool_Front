import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import '../styles/lists.css'

const BeatCreatorsList = ({ showCheckboxes, onSelect }) => {
  const [beatCreators, setBeatCreators] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const nav = useNavigate()
  const [selectedBeatCreators, setSelectedBeatCreators] = useState([])

  useEffect(() => {
    const fetchBeatCreators = async () => {
      try {
        const response = await axios.get('http://localhost:5005/beatMaker')
        setBeatCreators(response.data)
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching beat creators:', error)
      }
    }

    fetchBeatCreators()
  }, [])

  const handleBeatCreatorClick = async beatCreatorId => {
    try {
      // Navigate to the BeatCreatorPage with the selected beat creator ID
      nav(`/beatCreator/${beatCreatorId}`) // Pass the beatCreatorId as a parameter in the URL
    } catch (error) {
      console.error('Error navigating to beat creator:', error)
    }
  }

  const handleBeatCreatorCheckboxChange = beatCreatorId => {
    setSelectedBeatCreators(prevSelectedBeatCreators => {
      if (prevSelectedBeatCreators.includes(beatCreatorId)) {
        return prevSelectedBeatCreators.filter(id => id !== beatCreatorId)
      } else {
        return [...prevSelectedBeatCreators, beatCreatorId]
      }
    })
  }

  const handleConfirmSelection = () => {
    // Pass the selected beat creators to the parent component
    onSelect(selectedBeatCreators)
  }

  return (
    <>
      <div className='drumKitListTitle'>
        <h2>Beat Creators</h2>
      </div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className='drumKitList'>
          <ul>
            {beatCreators.map(beatCreator => (
              <div key={beatCreator._id}>
                <li onClick={() => handleBeatCreatorClick(beatCreator._id)}>{beatCreator.name} </li>
                {showCheckboxes && (
                  <li>
                    <input
                      type='checkbox'
                      id={beatCreator._id}
                      checked={selectedBeatCreators.includes(beatCreator._id)}
                      onChange={() => handleBeatCreatorCheckboxChange(beatCreator._id)}
                    />
                    <label htmlFor={beatCreator._id}></label>
                  </li>
                )}
              </div>
            ))}
          </ul>
        </div>
      )}
      {showCheckboxes && <button onClick={handleConfirmSelection}>Confirm Selection</button>}
    </>
  )
}

export default BeatCreatorsList
