import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import '../styles/lists.css'
import { useContext } from 'react'
import { AuthContext } from '../context/Auth.context'
const BeatCreatorsList = ({ showCheckboxes, onSelect}) => {
  const [beatCreators, setBeatCreators] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const nav = useNavigate()
  const [selectedBeatCreators, setSelectedBeatCreators] = useState([])
  const {authenticateUser, user}=useContext(AuthContext)
  useEffect(() => {
    // This effect runs only once when the component mounts
    authenticateUser(); // Ensure user is authenticated
  }, []);
  useEffect(() => {
    const fetchBeatCreators = async () => {
      try {
        if(user){
          
        const response = await axios.get('http://localhost:5005/beatMaker')
        const userBeatMakers = response.data.filter(beatMaker => beatMaker.user === user._id);

        setBeatCreators(userBeatMakers)
        setIsLoading(false)
        }
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
  
  const handleDelete = async beatCreatorId => {
    const isConfirmed = window.confirm('Are you sure you want to delete this drum kit?');
    if (isConfirmed) {
      try {
        // Proceed with the deletion if confirmed
        const response = await fetch(`http://localhost:5005/beatMaker/${beatCreatorId}`, {
          method: 'DELETE',
        });
  
        if (response.status === 200) {
          setBeatCreators(prevBeatCreators =>
            prevBeatCreators.filter(item => item._id !== beatCreatorId)
          );
          // Navigate to the drum kits page after successful deletion
          nav('/beatCreator');
        }
      } catch (error) {
        console.error(error);
      }
    }
  };


  return (
    <>
      <div className='drumKitListTitle'>
        <h2>Beat Creators</h2>
      </div>
      {isLoading ? (
        <p>Loading...</p>
      ) : 
      
      
      (
        <div className='drumKitList'>
          <ul>
            { 
            beatCreators.length === 0 ? (
              <p>No beats available.</p>
              ) : (
            beatCreators.map(beatCreator => (
             
              <div key={beatCreator._id}><button onClick={() => nav(`/beatCreator/${beatCreator._id}/update`)}>Update</button>
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

                )}                     <button onClick={()=>handleDelete(beatCreator._id)}>Delete</button>

              </div>
            )))}
          </ul>
        </div>
      )
      }
      {showCheckboxes && <button onClick={handleConfirmSelection}>Confirm Selection</button>}

    </>
  )
}

export default BeatCreatorsList
