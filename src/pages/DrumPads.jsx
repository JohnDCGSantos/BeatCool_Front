import { useState, useRef, useEffect, useContext } from 'react'
import Sounds from '../components/Sounds'
import CreateDrumKit from '../components/CreateDrumKit'
import CreateBeat from '../components/CreateBeat'
import '../styles/create.css'
import { AuthContext  } from '../context/Auth.context'
import { useNavigate } from 'react-router-dom'
import { apiBaseUrl } from '../config'
import CreateTutorial from '../components/CreateTutorial'
import UnmuteWarn from '../components/UnmuteWarn'

const DrumPads = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [showTutorial, setShowTutorial] = useState(false);
  const [showWarn, setShowWarn] = useState(true);
  const [keyAssignments, setKeyAssignments] = useState({});
  const [pressedKeys, setPressedKeys] = useState(new Set());


  
  const [sounds, setSounds] = useState([])
  const [selectedSounds, setSelectedSounds] = useState([])
  //const audioRefs = useRef({})
  const [selectedOption, setSelectedOption] = useState('')
  const {/*authenticateUser,*/ user}=useContext(AuthContext)
const nav =useNavigate()
  
const handleTutorialClose = () => {
    setShowTutorial(false);
  };
  const handleWarnClose = () => {
    setShowWarn(false);
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
        console.log(`Loaded sound: ${soundUrl}`);

      };

      const loadAllSounds = drumSounds.map((sound) => loadSound(sound.soundUrl));
      
      await Promise.all(loadAllSounds);
      console.log('All sounds preloaded');

      setIsLoading(false);
    } catch (error) {
      console.error('Error loading sounds:', error);
      setIsLoading(false);
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
   
      
    const fetchSounds = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/pads`)
        if (response.ok) {
          const parsed = await response.json()
          console.log(parsed)
          setSounds(parsed)

          setIsLoading(false) 
        } else {
          console.error('Error fetching sounds:', response.status)
          setIsLoading(false) 
        }
      } catch (error) {
        console.error('Error fetching sounds:', error)
        setIsLoading(false) 
      }
    }
    fetchSounds()
  }, [])


  useEffect(() => {
    if (selectedSounds) {
      const keys = [
        'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ç',
        'z', 'x', 'c', 'v', 'b', 'n', 'm'
      ];

      const newKeyAssignments = {};

      selectedSounds.forEach((sound, index) => {
        const soundUrl = sound?.soundUrl;
        if (soundUrl) {
          newKeyAssignments[soundUrl] = keys[index % keys.length];
        }
      });

      setKeyAssignments(newKeyAssignments);
    }
  }, [selectedSounds]);

  useEffect(() => {
    const handleKeyDown = event => {
      if (selectedSounds) {
        const soundUrl = Object.keys(keyAssignments).find(
          url => keyAssignments[url] === event.key.toLowerCase()
        );

        if (soundUrl) {
          playSound(soundUrl);
          setPressedKeys(prevKeys => new Set(prevKeys).add(soundUrl));
        }
      }         
    };

    const handleKeyUp = event => {
      if (selectedSounds) {
        const soundUrl = Object.keys(keyAssignments).find(
          url => keyAssignments[url] === event.key.toLowerCase()
        );

        if (soundUrl) {
          setPressedKeys(prevKeys => {
            const newKeys = new Set(prevKeys);
            newKeys.delete(soundUrl);
            return newKeys;
          });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [keyAssignments,selectedSounds]);

  useEffect(()=>{
    console.log('pressed key:', pressedKeys)

  },[pressedKeys])
  const handleSoundSelect = sound => {     

    setSelectedSounds(prevSelected => {
      const isSelected = prevSelected.some(prevSound => prevSound.soundUrl === sound.soundUrl)
      if (isSelected) {
        return prevSelected.filter(prevSound => prevSound.soundUrl !== sound.soundUrl)
      } else {
        return [...prevSelected, sound]
      }
    })
  }




  const handleCombo = () => {
   nav('/combinedCreator')
  }


  

  

  const handleOptionSelect = option => {
    setSelectedOption(option)
  }

  

  return (
    <div className='imageCreate'>
      <div className='shadows'>
      {showWarn ? (
        <UnmuteWarn onClose={handleWarnClose}/>):
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
                  
                  <h1> {user ? 'Create something,'+ ' '+ user.username+'!!' :'Create something !!'}</h1>
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
                        preloadSounds={preloadSounds}

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
                        preloadSounds={preloadSounds}
                        keyAssignments={keyAssignments} // Pass keyAssignments here


                      />
                      <CreateDrumKit selectedSounds={selectedSounds} />
                    </>
                    
                  )}
                </div>
                
              </div>
            )}
            
          </div>
        </div>
}
      </div>
    </div>
  );
}

export default DrumPads
