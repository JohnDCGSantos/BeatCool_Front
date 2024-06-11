// UpdateDrum.js
import { useNavigate, useParams } from 'react-router-dom'
import UpdateDrumKitForm from '../components/UpdateDrumKitForm'
import { apiBaseUrl } from '../config'
import { useState, useRef, useEffect } from 'react'

const UpdateDrum = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [drumKit, setDrumKit] = useState(null)
  const [sounds, setSounds] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const audioContextRef = useRef(null);
  const audioBuffersRef = useRef({});
  const audioSourceNodesRef = useRef({});

  const initializeAudioContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
  };
  const preloadSounds = async (drumSounds) => {
    initializeAudioContext();
    const audioContext = audioContextRef.current;

    try {
      const loadSound = async (soundUrl) => {
        const response = await fetch(soundUrl);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        audioBuffersRef.current[soundUrl] = audioBuffer;
        console.log(`Loaded sound: ${soundUrl}`);

      };

      const loadAllSounds = drumSounds.map((sound) => loadSound(sound.soundUrl));
      
      await Promise.all(loadAllSounds);
      console.log('All sounds preloaded');

    } catch (error) {
      console.error('Error loading sounds:', error);
    }
  };

  const playSound = async (soundUrl) => {
    initializeAudioContext();

    const audioContext = audioContextRef.current;
  
    // Ensure the audio context is resumed
    if (audioContext.state === 'suspended') {
      await audioContext.resume();
    }
  
    try {
      const audioBuffer = audioBuffersRef.current[soundUrl];
      if (!audioBuffer) {
        console.error(`Sound URL ${soundUrl} not found in audioBuffersRef`);
        return;
      }
  // Stop all currently playing instances of the sound
  if (audioSourceNodesRef.current[soundUrl]) {
    audioSourceNodesRef.current[soundUrl].forEach((node) => {
      node.stop();
    });
    audioSourceNodesRef.current[soundUrl] = [];
  }
      const sourceNode = audioContext.createBufferSource();
      sourceNode.buffer = audioBuffer;
      sourceNode.connect(audioContext.destination);
      // For iOS, play() must be triggered by a user gesture
      // For Android, play() can be called directly
      const playPromise = sourceNode.start(0);
  
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error(`Error playing sound: ${error}`);
        });
      }
  

      // Keep track of active source nodes to handle rapid playback
      if (!audioSourceNodesRef.current[soundUrl]) {
        audioSourceNodesRef.current[soundUrl] = [];
      }
      audioSourceNodesRef.current[soundUrl].push(sourceNode);
  
      sourceNode.onended = () => {
        audioSourceNodesRef.current[soundUrl] = audioSourceNodesRef.current[soundUrl].filter((node) => node !== sourceNode);
      };
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };
  const stopAllSounds = () => {
    Object.values(audioSourceNodesRef.current).forEach(nodes => {
      nodes.forEach(node => {
        node.stop();
      });
    });
  };

  useEffect(() => {
    return () => {
      // Cleanup when component unmounts
      stopAllSounds();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch drum kit data
        const drumKitResponse = await fetch(`${apiBaseUrl}/drumkits/${id}`)
        if (drumKitResponse.ok) {
          const drumKitData = await drumKitResponse.json()
          setDrumKit(drumKitData)
          preloadSounds(drumKitData.drumPads)
          console.log(drumKitData)
        } else {
          console.error('Failed to fetch drum kit:', drumKitResponse.status)
        }

        // Fetch sounds data
        const soundsResponse = await fetch(`${apiBaseUrl}/pads`)
        if (soundsResponse.ok) {
          const soundsData = await soundsResponse.json()
          setSounds(soundsData)

        } else {
          console.error('Failed to fetch sounds:', soundsResponse.status)
        }
       setIsLoading(false)

      } catch (error) {
        console.error('Error fetching data:', error)
        setIsLoading(false)
      }
    }

    fetchData()     

  }, [id]) 

  const handleUpdateDrum = async (updatedDrumKit) => {
    try {
      const response = await fetch(`${apiBaseUrl}/drumkits/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedDrumKit),
        
      })
      console.log(updatedDrumKit)
      if (response.ok) {
        const updatedData = await response.json()
        navigate(`/drumkits/${updatedData._id}`)
      } else {
        console.error('Failed to update drum kit:', response.status)
      }
    } catch (error) {
      console.error('Error updating drum kit:', error)
    }
  }

  return isLoading?(<p>Loading...</p>):(
    
    <div className='imageCreate' 
    
    >
    <div className= 'shadows'>
    <div className='mainC'>
    <div className='create'>
      <h3>Edit Drum Kit</h3>
      {!isLoading && drumKit && sounds && (
        <UpdateDrumKitForm 
        onSubmit={handleUpdateDrum} 
        defaultValues={drumKit} 
        sounds={sounds} 
        preloadSounds={preloadSounds}
        playSound={playSound}
        />
      )}
</div>
    </div>
    </div>    </div>   
   
  )
}

export default UpdateDrum
