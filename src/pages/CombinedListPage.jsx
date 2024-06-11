import { useState, useEffect } from 'react'
import axios from 'axios'
import { useContext } from 'react'
import { AuthContext } from '../context/Auth.context'
import { useNavigate } from 'react-router-dom'
import { apiBaseUrl } from '../config'

const CombinedListPage = () => {
  const [beatMakerAndDrumKits, setBeatMakerAndDrumKits] = useState([])
  const {authenticateUser, user}=useContext(AuthContext)
 
const navigate=useNavigate()
  useEffect(() => {
    authenticateUser(); // Ensure user is authenticated
  }, []);
  
  useEffect(() => {
    const fetchBeatMakerAndDrumKits = async () => {
      try {
        if(user){
        
        const response = await axios.get(`${apiBaseUrl}/beatMakerAndDrumkit`)
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
        const response = await fetch(`${apiBaseUrl}/beatMakerAndDrumKit/${beatMakerAndDrumKitId}`, {
          method: 'DELETE',
        });
  
        if (response.status === 200) {
          // Remove the deleted item from the state
          setBeatMakerAndDrumKits(prevBeatMakerAndDrumKits =>
            prevBeatMakerAndDrumKits.filter(item => item._id !== beatMakerAndDrumKitId)
          );
          navigate('/combined');
        }
      } catch (error) {
        console.error(error);
      }
    }
  };
  

  return (
    <div className= 'imageKits'>
    <div className= 'shadows'>
    <div className='creater'>
      <div className='drumKitListTitle'>
      <h2> Your Combined List,  &nbsp;{user? user.username :null}</h2>
      </div>
      <div className='drumKitList'>
        
          {
             beatMakerAndDrumKits.length === 0 ? (
              <p>No combos available.</p>
              ) : (
              <ul>
        {beatMakerAndDrumKits.map(beatMakerAndDrumKit => (
            <div className='di' key={beatMakerAndDrumKit._id}>             <button className='selected-sound-item' onClick={() => navigate(`/combined/${beatMakerAndDrumKit._id}/update`)}>Update</button>

            <li onClick={()=>{navigate(`/combined/${beatMakerAndDrumKit._id}`)}}>           
              {beatMakerAndDrumKit.name}
            </li>
            <button className='selected-sound-item'  onClick={()=>handleDelete(beatMakerAndDrumKit._id)}>Delete</button>
            </div>
          ))}</ul>)}
        
        </div>
     
    </div>
    </div>
     
     </div>
  )
}

export default CombinedListPage
