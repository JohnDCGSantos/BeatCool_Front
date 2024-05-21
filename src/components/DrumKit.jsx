import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
//import RecordedSequences from '../components/RecordedSequences'
import DrumKitSounds from './DrumKitSounds'
import '../styles/drumKitPage.css'
import '../styles/create.css'
import { apiBaseUrl } from '../config'
//import { useNavigate } from 'react-router-dom'
const DrumKit = ({ id }) => {
  const [drumKit, setDrumKit] = useState(null)
  const [drumSounds, setDrumSounds] = useState([])
 // const [selectedSounds, setSelectedSounds] = useState([])
  //const navigate=useNavigate()
  const audioRefs = useRef({})
  //const [recording, setRecording] = useState(false)
  //const [recordedSequence, setRecordedSequence] = useState([])
 // const [isPlayingSequence, setIsPlayingSequence] = useState(false)
 // const timeoutIdsRef = useRef({})
const[isLoading, setIsLoading]=useState(true)

const audioPools = useRef({});



  useEffect(() => {
    const fetchDrumKit = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/drumkits/${id}`)
        setDrumKit(response.data)
        setDrumSounds(response.data.drumPads) 

      } catch (error) {
        console.error('Error fetching drum kit:', error)
      }
    }

    fetchDrumKit()
             

  }, [])
  
  
  const preloadSounds = (drumSounds) => {
    let loadedCount = 0;

    drumSounds.forEach((drumSound) => {
      const audioElements = [];
      for (let i = 0; i < 5; i++) {  // Create a pool of 5 audio elements per sound
        const audio = new Audio(drumSound.soundUrl);
        audio.preload = 'auto';
        audio.addEventListener('loadedmetadata', () => {
          loadedCount++;
          if (loadedCount === drumSounds.length * 5) {
            setIsLoading(false);
          }
        });
        audioElements.push(audio);
      }
      audioPools.current[drumSound.soundUrl] = {
        elements: audioElements,
        currentIndex: 0,
      };
    });

    if (drumSounds.length === 0) {
      setIsLoading(false);
    }
  };

  
  /*const handleSoundSelect = sound => {
    setSelectedSounds(prevSelected => {
      const isSelected = prevSelected.some(prevSound => prevSound.soundUrl === sound.soundUrl)
      if (isSelected) {
        return prevSelected.filter(prevSound => prevSound.soundUrl !== sound.soundUrl)
      } else {
        return [...prevSelected, sound]
      }
    })
  }
*/
  const handleSoundClick = (drumSound) => {
    /*if (recording) {
      const timestamp = Date.now()
      setRecordedSequence(prevSequence => [...prevSequence, { sound: soundUrl, timestamp }])
    }*/
    playSound(drumSound)
    
  }
  
  const handleSoundPreLoadClik = () => {
    /*if (recording) {
      const timestamp = Date.now()
      setRecordedSequence(prevSequence => [...prevSequence, { sound: soundUrl, timestamp }])
    }*/
    setIsLoading(true); // Set isLoading to true when preload button is clicked

    preloadSounds(drumSounds); // Call the debounced function
    console.log('cliked', drumSounds)
  }

  const playSound = (soundUrl) => {
    const pool = audioPools.current[soundUrl];
    if (pool) {
      const audio = pool.elements[pool.currentIndex];
      audio.currentTime = 0;
      audio.play().catch(error => console.error(`Failed to play sound: ${error}`));
      pool.currentIndex = (pool.currentIndex + 1) % pool.elements.length;
    }
  };

  /*const handleTouchStart = event => {
    
    const touch = event.touches[0]; // Get the first touch
    if (touch) {
      const target = document.elementFromPoint(touch.clientX, touch.clientY);
      if (target && target.dataset.soundUrl) {
        event.preventDefault(); // Prevent default touch behavior

        playSound(target.dataset.soundUrl); // Trigger sound playback
      }
    }
  }


useEffect(() => {
  window.addEventListener('touchstart', handleTouchStart);
  
  return () => {
    window.removeEventListener('touchstart', handleTouchStart);
  };
}, [playSound]);*/


  if (!drumKit) {
    return <div>Loading...</div>
  }
  /*const addTimeoutIdForSound = (key, timeoutId) => {
    timeoutIdsRef.current[key] = timeoutIdsRef.current[key] || []
    timeoutIdsRef.current[key].push(timeoutId)
  }*/
  

  /*const startRecording = () => {
    setRecording(true)
    setIsPlayingSequence(false)
    setRecordedSequence([])
  }

  const stopRecording = () => {
    setRecording(false)
  }

  const playRecordedSounds = () => {
    setIsPlayingSequence(true)
    console.log(isPlayingSequence)
    recordedSequence.forEach(({ sound, timestamp }) => {
      const timeoutId = setTimeout(() => {
        playSound(sound)
      }, timestamp - recordedSequence[0].timestamp)
      addTimeoutIdForSound(sound, timeoutId)
    })
  }

  const saveRecordedSequence = async () => {
    try {
      await axios.post('http://localhost:5005/recorded/recordedSequences', {
        name: 'My Recorded Sequence',
        recordedSounds: recordedSequence,
      })
      console.log('Recorded sequence saved successfully')
    } catch (error) {
      console.error('Error saving recorded sequence:', error)
    }
  }*/
  
  return isLoading?( 
     <button style={{marginTop:'80px'}}onClick={handleSoundPreLoadClik}>hhh</button>)
:(
    
    <div className='playDr'>
                 

      
     
        <DrumKitSounds
          drumSounds={drumSounds}
          handleSoundClick={handleSoundClick}
         // handleSoundSelect={handleSoundSelect}
         // selectedSounds={selectedSounds}
        />

      {/*<RecordedSequences />
      <button onClick={startRecording}>Start Recording</button>
      <button onClick={stopRecording}>Stop Recording</button>
      <button onClick={playRecordedSounds}>Play Recorded Sequence</button>
      <button onClick={saveRecordedSequence}>Save Recorded Sequence</button>*/}
    </div>
   )
}

export default DrumKit