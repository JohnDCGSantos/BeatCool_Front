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
  
        // Preload sounds when component mounts
        preloadSounds(response.data.drumPads);
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
  
      sourceNode.start(0);
  
      // Track the new source node
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
  const handleSoundClick = async (drumSound) => {
    await playSound(drumSound);
  };

  if (!drumKit) {
    return <div>Loading...</div>;
  }

  return isLoading?(
    <div className="playDr">
     
      <p>Loading your sounds....</p>
      
    </div>
  ) : (
    <div className="playDr">
      
      <DrumKitSounds drumSounds={drumSounds} handleSoundClick={handleSoundClick} />
    </div>
  );
};

export default DrumKit;
 
