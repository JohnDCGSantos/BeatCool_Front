import { useState, useRef, useEffect, useContext } from 'react'
import Sounds from '../components/Sounds'
import CreateDrumKit from '../components/CreateDrumKit'
import CreateBeat from '../components/CreateBeat'
import '../styles/create.css'
import { AuthContext  } from '../context/Auth.context'
import { useNavigate } from 'react-router-dom'
import { apiBaseUrl } from '../config'
import CreateTutorial from '../components/CreateTutorial'

const DrumPads = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [showTutorial, setShowTutorial] = useState(false);

  
  const [sounds, setSounds] = useState([])
  const [selectedSounds, setSelectedSounds] = useState([])
  //const audioRefs = useRef({})
  const [selectedOption, setSelectedOption] = useState('')
  const {authenticateUser, user}=useContext(AuthContext)
const nav =useNavigate()
  
const handleTutorialClose = () => {
    setShowTutorial(false);
  };
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
      };

      const loadAllSounds = drumSounds.map((sound) => loadSound(sound.soundUrl));
      
      await Promise.all(loadAllSounds);

      setIsLoading(false);
    } catch (error) {
      console.error('Error loading sounds:', error);
      setIsLoading(false);
    }
  };
  const playSound = async (soundUrl) => {
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
/*const preloadSounds = sounds => {
  sounds.forEach(sound => {
    const audio = new Audio(sound.soundUrl)
    audio.preload = 'auto'
    audioRefs.current[sound.soundUrl] = audio
  })
}*/
  useEffect(() => {
    const fetchSounds = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/pads`)
        if (response.ok) {
          const parsed = await response.json()
          console.log(parsed)
          setSounds(parsed)

        //  preloadSounds(parsed)
          setIsLoading(false) // Set loading state to false once sounds are loaded
        } else {
          console.error('Error fetching sounds:', response.status)
          setIsLoading(false) // Set loading state to false if there's an error
        }
      } catch (error) {
        console.error('Error fetching sounds:', error)
        setIsLoading(false) // Set loading state to false if there's an error
      }
    }
    fetchSounds()
  }, [])


useEffect(()=>{
authenticateUser()
},[])


  const handleSoundSelect = sound => {
    setSelectedSounds(prevSelected => {
      const isSelected = prevSelected.some(prevSound => prevSound.soundUrl === sound.soundUrl)
      if (isSelected) {
        // If the sound is already selected, remove it
        return prevSelected.filter(prevSound => prevSound.soundUrl !== sound.soundUrl)
      } else {
        // If the sound is not selected, add it to the selectedSounds array
        return [...prevSelected, sound]
      }
    })
  }

  


  const handleCombo = () => {
   nav('/combinedCreator')
  }


  /*const playSound = soundUrl => {
    const audio = audioRefs.current[soundUrl]
    if (audio) {
      audio.currentTime = 0
      audio.play().catch(error => console.error(`Failed to play sound: ${error}`))
    }
  }*/

  /*const handleSoundClick = soundUrl => {
    playSound(soundUrl)
    
  }*/

  const handleOptionSelect = option => {
    setSelectedOption(option)
  }

  return (
    <div className='imageCreate'>
      <div className='shadows'>
        <div className='create'>
          <div className='mainContainer'>
            {isLoading ? (
              <p>Loading sounds...</p>
            ) : (
              <div className='intro'>
                <div style={{marginTop:'10px'}}>
                <button style={{width:'100%', padding:'5px'}} className="btnSkip" onClick={() => setShowTutorial(true)}>
                 Tutorial- How to create?
              </button>
              </div>
            
            {showTutorial && <CreateTutorial onClose={handleTutorialClose} />}
                <div className='createT'>
                  <h1>Create something, &nbsp; {user ? user.username : null}&nbsp;!!</h1>
                </div>
                
                <div className='selectCard'>
                  {selectedOption === '' ? (
                    <div className='selecter'>
                      <div className='optionSelect'>
                        <div className='selectBtnContainer'>
                          <button className='selected-sound-items' onClick={() => handleOptionSelect('beatMaker')}>Beat Maker</button>
                          <button className='selected-sound-items' onClick={() => handleOptionSelect('drumKit')}>Drum Kit</button>
                          <button className='selected-sound-items' onClick={handleCombo}>Combined</button>
                        </div>
                      </div>
                    </div>
                  ) : selectedOption === 'beatMaker' ? (
                    <>
                      <Sounds
                        sounds={sounds}
                        handleSoundSelect={handleSoundSelect}
                        selectedSounds={selectedSounds}
                        playSound={playSound}
                      />
                      <CreateBeat selectedSounds={selectedSounds} />
                    </>
                  ) : (
                    <>
                      <Sounds
                        sounds={sounds}
                        handleSoundSelect={handleSoundSelect}
                        selectedSounds={selectedSounds}
                        playSound={playSound}
                      />
                      <CreateDrumKit selectedSounds={selectedSounds} />
                    </>
                    
                  )}
                </div>
                
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default DrumPads
