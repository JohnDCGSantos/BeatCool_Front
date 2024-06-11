import { useState, useEffect } from 'react'
import axios from 'axios'
import '../styles/createCombined.css'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../context/Auth.context'
import { apiBaseUrl } from '../config'

const CombinedMaker = () => {
  const [name, setName] = useState('')
  const [drumKits, setDrumKits] = useState([])
  const [beatMakers, setBeatMakers] = useState([])
  const [selectedDrumKits, setSelectedDrumKits] = useState([])
  const [selectedBeatMakers, setSelectedBeatMakers] = useState([])
  const nav = useNavigate()
  const { user, isLoading }=useContext(AuthContext)

  
  
  useEffect(() => {
  
      // Fetch drum kits

      const fetchDrumKits = async () => {
        try {
          if (user){

          
          
          
          const response = await axios.get(`${apiBaseUrl}/drumkits`)
          const userDrumKits = response.data.filter(drumKit => drumKit.user === user._id);
          setDrumKits(userDrumKits);}
        } catch (error) {
          console.error('Error fetching drum kits:', error)
        }
      }

      // Fetch beat makers
      const fetchBeatMakers = async () => {
        try {
          if (user){
          const response = await axios.get(`${apiBaseUrl}/beatmaker`)
          const userBeatMakers = response.data.filter(beatMaker => beatMaker.user === user._id);
          setBeatMakers(userBeatMakers)
          }
        } catch (error) {
          console.error('Error fetching beat makers:', error)
        }
      }

      fetchDrumKits();
      fetchBeatMakers();
     
     
  }, [])

  if (isLoading ) {
    return <div>Loading...</div>;
  }

  
  
  const handleSubmit = async e => {
    e.preventDefault()
    try {
      const response = await axios.post(`${apiBaseUrl}/beatMakerAndDrumKit`, {
        name,
        drumKits: selectedDrumKits,
        beatMakers: selectedBeatMakers,
        user,
      })
      console.log('BeatMakerAndDrumKit created:', response.data)
      // Reset form fields
      setName('')
      setSelectedDrumKits([])
      setSelectedBeatMakers([])
      nav('/combined')
    } catch (error) {
      console.error('Error creating BeatMakerAndDrumKit:', error)
    }
  }
  
  const handleDrumKitClick = async drumKitId => {
    try {
      nav(`/drumkits/${drumKitId}`) 
    } catch (error) {
      console.error('Error navigating to drum kit:', error)
    }
  }
  const handleBeatMakerClick = async beatMakerId => {
    try {
      nav(`/beatCreator/${beatMakerId}`) 
    } catch (error) {
      console.error('Error navigating to drum kit:', error)
    }
  }

  return (
<div className='imageCreate'>
    <div className= 'shadows'>
    <div className= 'mainC'>

    <div className='create'>  <h2>Create New BeatMakerAndDrumKit</h2>
  <form onSubmit={handleSubmit}>
    <div className='name'>
      <label htmlFor='name'>Name:</label>
      <input type='text' id='name' value={name} onChange={(e) => setName(e.target.value)} required />
    </div>
    
    <div className='wrap'>
      <label>Select Drum Kit:</label>
      
      {
      drumKits.length>0?(
 <div className='dk'>
        {drumKits.map((drumKit) => (
          <div  key={drumKit._id}>
          <div className='dkSL' key={drumKit._id}>   

          <div className='dkS' >
            <input
              type='radio'
              id={`drumKit-${drumKit._id}`}
              name='drumKit'
              value={drumKit._id}
              checked={selectedDrumKits === drumKit._id}
              onChange={() => setSelectedDrumKits(drumKit._id)}
            />
          </div>      
                       <label htmlFor={`drumKit-${drumKit._id}`}>{drumKit.name}</label>
            <button className='details' onClick={()=>handleDrumKitClick((drumKit._id))}>Details</button>

        </div></div>))}
      </div>
      ):(
        <>
<p style={{color:'red', textAlign:'center'}}>No drumKits available, please create one first!</p> 
<button className='submitUpdate' onClick={()=>{nav('/')}}>Create drumKit</button>
      </>)
}
     

    </div>
    <div className='wrap'>

    <label>Select Beat Maker:</label>
    {beatMakers.length>0?(
    <div className='dk'>
      
      {beatMakers.map((beatMaker) => (
         <div  key={beatMaker._id}>
         <div className='dkSL'key={beatMaker._id}>   
         <div className='dkS' >
          <input
            type='radio'
            id={`beatMaker-${beatMaker._id}`}
            name='beatMaker'
            value={beatMaker._id}
            checked={selectedBeatMakers === beatMaker._id}
            onChange={() => setSelectedBeatMakers(beatMaker._id)}
          /></div>
          <label htmlFor={`beatMaker-${beatMaker._id}`}>{beatMaker.name}</label>
          <button className='details' onClick={()=>handleBeatMakerClick((beatMaker._id))}>Details</button>

        </div>
      </div>))}
    </div> ):(<>
<p style={{color:'red', textAlign:'center'}}>No beatMakers available, please create one first!</p> 
<button className='submitUpdate'onClick={()=>{nav('/')}}>Create beatMaker</button>
      </>)}
     </div>
   {beatMakers.length&&drumKits.length>0?(   
<div className='btnComboSubmit'>
    <button className='submitUpdate'type='submit'>Create</button>
    </div>):null}
  </form>
</div></div>
</div>
</div>



  );
};

export default CombinedMaker
