import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import '../styles/lists.css'
import { useContext } from 'react'
import { AuthContext } from '../context/Auth.context'
const DrumKitList = ({ showCheckboxes, onSelect }) => {
  const [drumKits, setDrumKits] = useState([])
  const nav = useNavigate()
  const [selectedDrumKits, setSelectedDrumKits] = useState([])
  const {authenticateUser, user}=useContext(AuthContext)
  useEffect(() => {
    // This effect runs only once when the component mounts
    authenticateUser(); // Ensure user is authenticated
  }, []);
  
  useEffect(() => {
    const fetchDrumKits = async () => {
      try {
      
 if(user){
         
        const response = await axios.get('http://localhost:5005/drumkits', {user})
        console.log(user)
        const userDrumKits = response.data.filter(drumKit => drumKit.user === user._id);
       
  console.log(userDrumKits); // Display only the drum kits created by the authenticated user
        setDrumKits(userDrumKits);
        
 }
    
      } catch (error) {
        console.error('Error fetching drum kits:', error)
      }
    }
    fetchDrumKits()
  }, [authenticateUser])
  
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
  const handleDelete = async drumKitId => {
    const isConfirmed = window.confirm('Are you sure you want to delete this drum kit?');
    if (isConfirmed) {
      try {
        // Proceed with the deletion if confirmed
        const response = await fetch(`http://localhost:5005/drumKits/${drumKitId}`, {
          method: 'DELETE',
        });
  
        if (response.status === 200) {
          setDrumKits(prevDrumKits =>
            prevDrumKits.filter(item => item._id !== drumKitId)
          );
          // Navigate to the drum kits page after successful deletion
          nav('/drumKits');
        }
      } catch (error) {
        console.error(error);
      }
    }
  };
  return (
    <>
      <div className='drumKitListTitle'>
        <h2>Drum Kits</h2>
      </div>
      
      <div className='drumKitList'>
        {drumKits.length === 0 ? (
        <p>No drum kits available.</p>
      ) : (
        <ul>
          {drumKits.map(drumKit => (
            <div key={drumKit._id}>                <button onClick={() => nav(`/drumKits/${drumKit._id}/update`)}>Update</button>

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
                )}                     <button onClick={()=>handleDelete(drumKit._id)}>Delete</button>

            </div>
          ))}
        </ul>
      )}
        {showCheckboxes && <button onClick={handleConfirmSelection}>Confirm Selection</button>}
      </div>
    </>
  )
}

export default DrumKitList
