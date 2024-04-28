import { useState, useEffect } from 'react'
import axios from 'axios'
import '../styles/createCombined.css'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../context/Auth.context'
const BeatMakerAndDrumKitForm = () => {
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

          
          
          
          const response = await axios.get('http://localhost:5005/drumkits')
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
          const response = await axios.get('http://localhost:5005/beatmaker')
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
    return <div>Loading...</div>; // Placeholder for loading state
  }

  
  
  const handleSubmit = async e => {
    e.preventDefault()
    try {
      const response = await axios.post('http://localhost:5005/beatMakerAndDrumKit', {
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
      // Navigate to the DrumKitPage with the selected drum kit ID
      nav(`/drumkits/${drumKitId}`) // Pass the drumKitId as a parameter in the URL
    } catch (error) {
      console.error('Error navigating to drum kit:', error)
    }
  }
  const handleBeatMakerClick = async beatMakerId => {
    try {
      // Navigate to the DrumKitPage with the selected drum kit ID
      nav(`/beatCreator/${beatMakerId}`) // Pass the drumKitId as a parameter in the URL
    } catch (error) {
      console.error('Error navigating to drum kit:', error)
    }
  }

  return (
    <div className='dkBm'>
  <h2>Create New BeatMakerAndDrumKit</h2>
  <form onSubmit={handleSubmit}>
    <div>
      <label htmlFor='name'>Name:</label>
      <input type='text' id='name' value={name} onChange={(e) => setName(e.target.value)} required />
    </div>
    <div className='wrap'>
      <label>Select Drum Kit:</label>
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

    </div><label>Select Beat Maker:</label>
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
    </div>
        

    <button type='submit'>Create</button>
  </form>
</div>

  );
};

export default BeatMakerAndDrumKitForm
