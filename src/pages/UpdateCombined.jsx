import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useContext} from 'react';
import { AuthContext } from '../context/Auth.context'
import { apiBaseUrl } from '../config'

const UpdateCombined = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [drumKits, setDrumKits] = useState([]);
  const [beatMakers, setBeatMakers] = useState([]);
  const [selectedDrumKits, setSelectedDrumKits] = useState([]);
  const [selectedBeatMakers, setSelectedBeatMakers] = useState([]);
  const {authenticateUser, user}=useContext(AuthContext)
  useEffect(() => {
    // This effect runs only once when the component mounts
    authenticateUser(); // Ensure user is authenticated
  }, []);
  
  useEffect(() => {
    // Fetch drum kits
    if (user) {
    const fetchDrumKits = async () => {
        try {
            
        
        const response = await axios.get(`${apiBaseUrl}/drumkits`)
        const userDrumKits = response.data.filter(drumKit => drumKit.user === user._id);

        setDrumKits(userDrumKits);
        console.log(id)
        console.log(user._id)


            } catch (error) {
        console.error('Error fetching drum kits:', error)
      }
    }

    // Fetch beat makers
    const fetchBeatMakers = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/beatmaker`)
        const userBeatMakers = response.data.filter(beatMaker => beatMaker.user === user._id);

        setBeatMakers(userBeatMakers)
      } catch (error) {
        console.error('Error fetching beat makers:', error)
      }
    }

    fetchDrumKits()
    fetchBeatMakers()
}
  }, [user])

  useEffect(() => {
    if (user && id) {
    const fetchDataSelected = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/beatMakerAndDrumKit/${id}`);
        const data = response.data;

        setName(data.name);
        setSelectedDrumKits(data.drumKits);
        setSelectedBeatMakers(data.beatMakers);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchDataSelected();
}
  }, [user,id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(`${apiBaseUrl}/beatMakerAndDrumKit/${id}`, {
        name,
        drumKits: selectedDrumKits,
        beatMakers: selectedBeatMakers,
      });
      console.log('BeatMakerAndDrumKit updated:', response.data);
navigate(`/combined/${response.data._id}`)
      // Redirect to the details page or any other page as needed
    } catch (error) {
      console.error('Error updating BeatMakerAndDrumKit:', error);
    }
  };
  const handleDrumKitClick = async drumKitId => {
    try {
      // Navigate to the DrumKitPage with the selected drum kit ID
      navigate(`/drumkits/${drumKitId}`) // Pass the drumKitId as a parameter in the URL
    } catch (error) {
      console.error('Error navigating to drum kit:', error)
    }
  }
  const handleBeatMakerClick = async beatMakerId => {
    try {
      // Navigate to the DrumKitPage with the selected drum kit ID
      navigate(`/beatCreator/${beatMakerId}`) // Pass the drumKitId as a parameter in the URL
    } catch (error) {
      console.error('Error navigating to drum kit:', error)
    }
  }

  // Your handleDrumKitToggle, handleBeatMakerToggle, handleDrumKitClick, handleBeatMakerClick functions remain the same

  return (
    <div className='imageCreate'>
    <div className= 'shadows'>
    <div className= 'mainC'>


    <div className='create'>
    <div className='dkBm'> 
      <h2>Update BeatMakerAndDrumKit</h2>
      <form onSubmit={handleSubmit}>
      <div className='name'>
          <label htmlFor='name'>Name:</label>
          <input style={{backgroundColor:'rgba(0,0,0,0.2)'}}type='text' id='name' value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className='wrap'>
          
          <label>Select Drum Kit:</label>
          <div className='dk'>
            {drumKits.map((drumKit) => (
              <div className='dkSL' key={drumKit._id}>
                <div className='dkS'>
                  <input
                    type='radio'
                    id={`drumKit-${drumKit._id}`}
                    name='drumKit'
                    value={drumKit._id}
                    checked={selectedDrumKits.includes(drumKit._id)}
                    onChange={() => setSelectedDrumKits(drumKit._id)}
                  />
                </div>
                <label htmlFor={`drumKit-${drumKit._id}`}>{drumKit.name}</label>
             
                          <button className='details' onClick={()=>handleDrumKitClick((drumKit._id))}>Details</button>
 </div>
            ))}
          </div>
        </div>
        <div>
          <div className='centerBtn'>
          <label>Select Beat Maker:</label></div>
          <div className='dk'>
            {beatMakers.map((beatMaker) => (
              <div className='dkSL' key={beatMaker._id}>
                <div className='dkS'>
                  <input
                    type='radio'
                    id={`beatMaker-${beatMaker._id}`}
                    name='beatMaker'
                    value={beatMaker._id}
                    checked={selectedBeatMakers.includes(beatMaker._id)}
                    onChange={() => setSelectedBeatMakers(beatMaker._id)}
                  />
                </div>
                <label htmlFor={`beatMaker-${beatMaker._id}`}>{beatMaker.name}</label>
                <button className='details' onClick={()=>handleBeatMakerClick((beatMaker._id))}>Details</button>

              </div>
            ))}
          </div>
        </div>
        <div className='centerBtn'><button className='submitUpdate' type='submit'>Update</button></div>
        
      </form>
    </div></div></div></div></div>
  );
};

export default UpdateCombined;
