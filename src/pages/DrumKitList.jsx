import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import '../styles/lists.css'
import { useContext } from 'react'
import { AuthContext } from '../context/Auth.context'
import { apiBaseUrl } from '../config'

const DrumKitList = ({ showCheckboxes, onSelect }) => {
  const [drumKits, setDrumKits] = useState([])
  const nav = useNavigate()
  const [selectedDrumKits, setSelectedDrumKits] = useState([])
  const {authenticateUser, user}=useContext(AuthContext)
  useEffect(() => {
    authenticateUser(); // Ensure user is authenticated
  }, []);
  
  useEffect(() => {
    const fetchDrumKits = async () => {
      try {
      
 if(user){
         
        const response = await axios.get(`${apiBaseUrl}/drumkits`, {user})
        console.log(user)
        const userDrumKits = response.data.filter(drumKit => drumKit.user === user._id);
       
  console.log(userDrumKits); 
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
      nav(`/drumkits/${drumKitId}`) 
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
    onSelect(selectedDrumKits)
  }
  const handleDelete = async drumKitId => {
    const isConfirmed = window.confirm('Are you sure you want to delete this drum kit?');
    if (isConfirmed) {
      try {
        const response = await fetch(`${apiBaseUrl}/drumKits/${drumKitId}`, {
          method: 'DELETE',
        });
  
        if (response.status === 200) {
          setDrumKits(prevDrumKits =>
            prevDrumKits.filter(item => item._id !== drumKitId)
          );
          nav('/drumKits');
        }
      } catch (error) {
        console.error(error);
      }
    }
  };
  return (
    
    <div className= 'imageKits'>
<div className= 'shadows'>
    <div className= 'creater'>
      <div className='drumKitListTitle'>
        <h2> Your Drum Kits,  &nbsp;{user?user.username : null}</h2>
      </div>
      
      <div className='drumKitList'>
        {drumKits.length === 0 ? (
        <p>No drum kits available.</p>
      ) : (
        <ul>
          {drumKits.map(drumKit => (
            <div className='di' key={drumKit._id}>                <button className='selected-sound-item' onClick={() => nav(`/drumKits/${drumKit._id}/update`)}>Update</button>

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
                )}      <button className='selected-sound-item' onClick={()=>handleDelete(drumKit._id)}>Delete</button>

            </div>
          ))}
        </ul>
      )}
        {showCheckboxes && <button onClick={handleConfirmSelection}>Confirm Selection</button>}
      </div>
    </div>
    </div>
    </div>

  )
}

export default DrumKitList
