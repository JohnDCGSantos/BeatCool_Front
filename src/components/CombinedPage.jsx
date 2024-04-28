import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../context/Auth.context'
import { useNavigate } from 'react-router-dom'
const CombinedListPage = () => {
  const [beatMakerAndDrumKits, setBeatMakerAndDrumKits] = useState([])
  const {authenticateUser, user}=useContext(AuthContext)
 
const navigate=useNavigate()
  useEffect(() => {
    // This effect runs only once when the component mounts
    authenticateUser(); // Ensure user is authenticated
  }, []);
  
  useEffect(() => {
    const fetchBeatMakerAndDrumKits = async () => {
      try {
        if(user){
        
        const response = await axios.get('http://localhost:5005/beatMakerAndDrumkit')
        const userCombo = response.data.filter(beatMakerAndDrumKit => beatMakerAndDrumKit.user === user._id);
        setBeatMakerAndDrumKits(userCombo)
        }
       
      } catch (error) {
        console.error('Error fetching BeatMakerAndDrumKits:', error)
      }
    }
  
    fetchBeatMakerAndDrumKits()
  }, [user])
  const handleDelete = async beatMakerAndDrumKitId => {
    const isConfirmed = window.confirm('Are you sure you want to delete this drum kit?');
    if (isConfirmed) {
      try {
        // Proceed with the deletion if confirmed
        const response = await fetch(`http://localhost:5005/beatMakerAndDrumKit/${beatMakerAndDrumKitId}`, {
          method: 'DELETE',
        });
  
        if (response.status === 200) {
          // Remove the deleted item from the state
          setBeatMakerAndDrumKits(prevBeatMakerAndDrumKits =>
            prevBeatMakerAndDrumKits.filter(item => item._id !== beatMakerAndDrumKitId)
          );
          // Navigate to the drum kits page after successful deletion
          navigate('/combined');
        }
      } catch (error) {
        console.error(error);
      }
    }
  };
  

  return (
    <>
      <div className='drumKitListTitle'>
        <h2>All BeatMakerAndDrumKit Entities</h2>
      </div>
      <div className='drumKitList'>
        <ul>
          {
             beatMakerAndDrumKits.length === 0 ? (
              <p>No combos available.</p>
              ) : (
        beatMakerAndDrumKits.map(beatMakerAndDrumKit => (
            <div key={beatMakerAndDrumKit._id}>             <button onClick={() => navigate(`/combined/${beatMakerAndDrumKit._id}/update`)}>Update</button>

            <li >           

              <Link to={`/combined/${beatMakerAndDrumKit._id}`}>{beatMakerAndDrumKit.name}</Link>
            </li>
            <button onClick={()=>handleDelete(beatMakerAndDrumKit._id)}>Delete</button>
            </div>
          )))}
        </ul>
        </div>
     
    </>
  )
}

export default CombinedListPage
