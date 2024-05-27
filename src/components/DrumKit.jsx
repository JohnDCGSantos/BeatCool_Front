/*
import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import DrumKitSounds from './DrumKitSounds'
import '../styles/drumKitPage.css'
import '../styles/create.css'
import { apiBaseUrl } from '../config'


const DrumKit = ({ id }) => {
  const [drumKit, setDrumKit] = useState(null)
  const [drumSounds, setDrumSounds] = useState([])
  const[isLoading, setIsLoading]=useState(true)
  const audioRefs = useRef({})
 

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
  }, [id])
  
  
  const preloadSounds = (drumSounds) => {
   let loadedCount = 0;
   drumSounds.forEach( drumSound => {
    const audio =new Audio(drumSound.soundUrl)
    audio.preload = 'auto';
   // audio.addEventListener('loadedmetadata', () => {
    audio.addEventListener('canplaythrough', () => {

      loadedCount++;
      if (loadedCount === drumSounds.length) {
       setIsLoading(false); // Set isLoading to false when all sounds are loaded
      }
    });
    audioRefs.current[drumSound.soundUrl] = audio;
  });
// If drumSounds array is empty, setIsLoading(false) immediately
   if (drumSounds.length === 0) {
    setIsLoading(false);
  }
};

  
  const handleSoundPreLoadClik = () => {
    setIsLoading(true); 
    preloadSounds(drumSounds); 
    console.log('cliked', drumSounds)
  }

  const playSound =  soundUrl => {
    const audio =audioRefs.current[soundUrl]
    if (audio) {
      console.log(audio)
      audio.pause()
      audio.currentTime = 0
      audio.play().catch(error => console.error(`Failed to play sound: ${error}`))
    }
  }

  
  const handleSoundClick = (drumSound) => {
    playSound(drumSound)  
  }
  
 if (!drumKit) {
    return <div>Loading...</div>
  }
 
  
 return isLoading?( 
    <button style={{marginTop:'80px'}} onClick={handleSoundPreLoadClik}>hhh</button>
  ):
  (
    <div className='playDr'>
        <DrumKitSounds
          drumSounds={drumSounds}
          handleSoundClick={handleSoundClick}
        /> 
    </div>
  )


}


export default DrumKit*/ 


/*
import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import DrumKitSounds from './DrumKitSounds'
import '../styles/drumKitPage.css'
import '../styles/create.css'
import { apiBaseUrl } from '../config'


const DrumKit = ({ id }) => {
  const [drumKit, setDrumKit] = useState(null)
  const [drumSounds, setDrumSounds] = useState([])
  const[isLoading, setIsLoading]=useState(true)
  const audioRefs = useRef({})
  const audioContextRef = useRef(null)


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
  }, [id])
  

  const initializeAudioContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)()
    }
  }


  const preloadSounds = async (drumSounds) => {
    initializeAudioContext()

    let loadedCount = 0
    await drumSounds.forEach(drumSound => {
      const audioPool = Array.from({ length: 2 }, () => new Audio(drumSound.soundUrl))
     audioPool.forEach(audio => {
        audio.preload = 'auto'  

        audio.volume=0

        audio.addEventListener('canplaythrough', () => {
          loadedCount++
          if (loadedCount === drumSounds.length * 2) {
            setIsLoading(false)
          }
        }, { once: true })

        // Play briefly and pause to force preloading
        audio.play().then(() => {
          audio.volume=0
          audio.pause()
          audio.currentTime = 0
        }).catch(error => console.error(`Error during preloading: ${error}`))
      })
      audioRefs.current[drumSound.soundUrl] = { pool: audioPool, index: 0 }
    })
    if (drumSounds.length === 0) {
      setIsLoading(false)
    }
  }

  
  const handleSoundPreLoadClik = () => {
    setIsLoading(true); 
    preloadSounds(drumSounds); 
    console.log('cliked', drumSounds)
  }
*/
  /*const playSound = soundUrl => {
    const audioPool = audioRefs.current[soundUrl].pool
    const currentIndex = audioRefs.current[soundUrl].index
    const audio = audioPool[currentIndex]
    audio.pause()
    audio.currentTime = 0
    audio.play().catch(error => console.error(`Failed to play sound: ${error}`))
    audioRefs.current[soundUrl].index = (currentIndex + 1) % audioPool.length
  }*/

 /* const playSound = soundUrl => {
    const soundRef = audioRefs.current[soundUrl]
    if (!soundRef) {
      console.error(`Sound URL ${soundUrl} not found in audioRefs`)
      return
    }

    const audioPool = soundRef.pool
    const currentIndex = soundRef.index
    const audio = audioPool[currentIndex]
    audioPool.forEach(instance => {
      instance.pause()
      instance.currentTime = 0
    })
    audio.volume= 0.9
    audio.play().catch(error => console.error(`Failed to play sound: ${error}`))
    soundRef.index = (currentIndex + 1) % audioPool.length
  }
  
  const handleSoundClick = (drumSound) => {
    playSound(drumSound)  
  }
  
 if (!drumKit) {
    return <div>Loading...</div>
  }
 
  
 return isLoading?( 
  <div className='playDr'>
    <p>Loading your sounds....</p>
    <button style={{marginTop:'80px'}} onClick={handleSoundPreLoadClik}>hhh</button>
    </div>
  ):
  (
    <div className='playDr'>
        <DrumKitSounds
          drumSounds={drumSounds}
          handleSoundClick={handleSoundClick}
        /> 
    </div>
  )


}


export default DrumKit*/ 


import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import DrumKitSounds from './DrumKitSounds';
import '../styles/drumKitPage.css';
import '../styles/create.css';
import { apiBaseUrl } from '../config';

const DrumKit = ({ id }) => {
  const [drumKit, setDrumKit] = useState(null);
  const [drumSounds, setDrumSounds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const audioContextRef = useRef(null);
  const audioBuffersRef = useRef({});
  const audioSourceNodesRef = useRef({});

  useEffect(() => {
    const fetchDrumKit = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/drumkits/${id}`);
        setDrumKit(response.data);
        setDrumSounds(response.data.drumPads);
      } catch (error) {
        console.error('Error fetching drum kit:', error);
      }
    };
    fetchDrumKit();
  }, [id]);

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

        // Create an Audio element to play briefly and pause
        const audio = new Audio(soundUrl);
        await audio.play();
        audio.volume = 0;
        audio.pause();
        audio.currentTime = 0;
      };

      const loadAllSounds = drumSounds.map(sound => loadSound(sound.soundUrl));
      await Promise.all(loadAllSounds);

      setIsLoading(false);
    } catch (error) {
      console.error('Error loading sounds:', error);
      setIsLoading(false);
    }
  };

  const handleSoundPreLoadClick = () => {
    setIsLoading(true);
    preloadSounds(drumSounds);
    console.log('Clicked', drumSounds);
  };

  const playSound = async (soundUrl) => {
    const audioContext = audioContextRef.current;

    // Ensure the audio context is resumed
    if (audioContext.state === 'suspended') {
      await audioContext.resume();
    }

    const audioBuffer = audioBuffersRef.current[soundUrl];
    if (!audioBuffer) {
      console.error(`Sound URL ${soundUrl} not found in audioBuffersRef`);
      return;
    }
console.log(audioBuffer)
    const sourceNode = audioContext.createBufferSource();
    sourceNode.buffer = audioBuffer;
    sourceNode.connect(audioContext.destination);
    sourceNode.start(0);

    // Keep track of active source nodes to handle rapid playback
    if (!audioSourceNodesRef.current[soundUrl]) {
      audioSourceNodesRef.current[soundUrl] = [];
    }
    audioSourceNodesRef.current[soundUrl].push(sourceNode);

    sourceNode.onended = () => {
      audioSourceNodesRef.current[soundUrl] = audioSourceNodesRef.current[soundUrl].filter((node) => node !== sourceNode);
    };
  };

  const handleSoundClick = async (drumSound) => {
    await playSound(drumSound);
  };

  if (!drumKit) {
    return <div>Loading...</div>;
  }

  return isLoading ? (
    <div className="playDr">
      <p>Loading your sounds....</p>
      <button style={{ marginTop: '80px' }} onClick={handleSoundPreLoadClick}>
        Load Sounds
      </button>
    </div>
  ) : (
    <div className="playDr">
      <DrumKitSounds drumSounds={drumSounds} handleSoundClick={handleSoundClick} />
    </div>
  );
};

export default DrumKit;
