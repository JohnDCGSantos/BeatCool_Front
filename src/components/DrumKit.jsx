/*import { useState, useEffect, useRef } from 'react';
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

export default DrumKit;*/


/*import { useState, useEffect, useRef } from 'react';
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

  const [recording, setRecording] = useState(false)
  const [recordedSequence, setRecordedSequence] = useState([])
  const [isPlayingSequence, setIsPlayingSequence] = useState(false)
 const timeoutIdsRef = useRef({})
  
   const addTimeoutIdForSound = (key, timeoutId) => {
    timeoutIdsRef.current[key] = timeoutIdsRef.current[key] || []
    timeoutIdsRef.current[key].push(timeoutId)
  }
  

  const startRecording = () => {
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
    console.log('record sequence is', recordedSequence)
  }

  
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
    if (recording) {
      const timestamp = Date.now()
      setRecordedSequence(prevSequence => [...prevSequence, { sound: drumSound, timestamp }])
    }
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
      <div className='recording-controls'>
      <button onClick={startRecording}>Start Recording</button>
      <button onClick={stopRecording}>Stop Recording</button>
      <button onClick={playRecordedSounds}>Play Recorded Sequence</button>
    </div>
        </div>

 
  );
};

export default DrumKit;*/


import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import DrumKitSounds from './DrumKitSounds';
import '../styles/drumKitPage.css';
import '../styles/create.css';
import { apiBaseUrl } from '../config';

const DrumKit = ({ id, enableRecording }) => {
  const [drumKit, setDrumKit] = useState(null);
  const [drumSounds, setDrumSounds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const audioContextRef = useRef(null);
  const audioBuffersRef = useRef({});
  const audioSourceNodesRef = useRef({});
  const [recording, setRecording] = useState(false);
  const [recordedSequence, setRecordedSequence] = useState([]);
  const [isPlayingSequence, setIsPlayingSequence] = useState(false);
  const timeoutIdsRef = useRef({});

  const addTimeoutIdForSound = (key, timeoutId) => {
    timeoutIdsRef.current[key] = timeoutIdsRef.current[key] || [];
    timeoutIdsRef.current[key].push(timeoutId);
  };

  const startRecording = () => {
    setRecording(true);
    setIsPlayingSequence(false);
    setRecordedSequence([]);
  };
useEffect(()=>{
    console.log(isPlayingSequence)

},[isPlayingSequence, recording])
  const stopRecording = () => {
    setRecording(false);
  };

  const playRecordedSounds = () => {
    setIsPlayingSequence(true);
    recordedSequence.forEach(({ sound, timestamp }) => {
      const timeoutId = setTimeout(() => {
        playSound(sound);
      }, timestamp - recordedSequence[0].timestamp);
      addTimeoutIdForSound(sound, timeoutId);
    });
  };

  const exportToWav = async () => {
    const audioContext = audioContextRef.current;
    const bufferTime = 1; // Add a buffer time of 1 second to ensure the last beat is included
    const totalDuration = (recordedSequence[recordedSequence.length - 1].timestamp - recordedSequence[0].timestamp) / 1000 + bufferTime;
    const offlineContext = new OfflineAudioContext(1, audioContext.sampleRate * totalDuration, audioContext.sampleRate);
  
    const renderSound = async ({ sound, timestamp }) => {
      const soundBuffer = audioBuffersRef.current[sound];
      const startTime = (timestamp - recordedSequence[0].timestamp) / 1000;
      const bufferSource = offlineContext.createBufferSource();
      bufferSource.buffer = soundBuffer;
      bufferSource.connect(offlineContext.destination);
      bufferSource.start(startTime);
    };
  
    await Promise.all(recordedSequence.map(renderSound));
    const renderedBuffer = await offlineContext.startRendering();
    const wavBlob = await audioBufferToWav(renderedBuffer);
    const url = URL.createObjectURL(wavBlob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'recording.wav';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  };
  

  const audioBufferToWav = async (buffer) => {
    const numberOfChannels = buffer.numberOfChannels;
    const length = buffer.length * numberOfChannels * 2 + 44;
    const result = new ArrayBuffer(length);
    const view = new DataView(result);
    let offset = 0;
    let pos = 0;

    function setUint16(data) {
      view.setUint16(pos, data, true);
      pos += 2;
    }

    function setUint32(data) {
      view.setUint32(pos, data, true);
      pos += 4;
    }

    // Write WAVE header
    setUint32(0x46464952); // "RIFF"
    setUint32(length - 8); // file length - 8
    setUint32(0x45564157); // "WAVE"

    setUint32(0x20746d66); // "fmt " chunk
    setUint32(16); // length = 16
    setUint16(1); // PCM (uncompressed)
    setUint16(numberOfChannels);
    setUint32(buffer.sampleRate);
    setUint32(buffer.sampleRate * numberOfChannels * 2); // avg. bytes/sec
    setUint16(numberOfChannels * 2); // block-align
    setUint16(16); // 16-bit (hardcoded in this demo)

    setUint32(0x61746164); // "data" - chunk
    setUint32(length - pos - 4); // chunk length

    // Write interleaved data
    const channels = [];
    for (let i = 0; i < buffer.numberOfChannels; i++) {
      channels.push(buffer.getChannelData(i));
    }

    while (pos < length) {
      for (let i = 0; i < numberOfChannels; i++) {
        // Interleave channels
        const sample = Math.max(-1, Math.min(1, channels[i][offset])); // clamp
        view.setInt16(pos, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
        pos += 2;
      }
      offset++;
    }

    return new Blob([result], { type: 'audio/wav' });
  };

  useEffect(() => {
    const fetchDrumKit = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/drumkits/${id}`);
        setDrumKit(response.data);
        setDrumSounds(response.data.drumPads);
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

      await Promise.all(drumSounds.map((sound) => loadSound(sound.soundUrl)));
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading sounds:', error);
      setIsLoading(false);
    }
  };

  const playSound = async (soundUrl) => {
    const audioContext = audioContextRef.current;

    if (audioContext.state === 'suspended') {
      await audioContext.resume();
    }

    try {
      const audioBuffer = audioBuffersRef.current[soundUrl];
      if (!audioBuffer) {
        console.error(`Sound URL ${soundUrl} not found in audioBuffersRef`);
        return;
      }

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
      stopAllSounds();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const handleSoundClick = async (drumSound) => {
    if (recording) {
      const timestamp = Date.now();
      setRecordedSequence(prevSequence => [...prevSequence, { sound: drumSound, timestamp }]);
    }
    await playSound(drumSound);
  };

  if (!drumKit) {
    return <div>Loading...</div>;
  }

  return isLoading ? (
    <div className="playDr">
      <p>Loading your sounds....</p>
    </div>
  ) : (
    <div className="playDr">
      <DrumKitSounds drumSounds={drumSounds} handleSoundClick={handleSoundClick} />
      {!enableRecording && (
      <div className='recording-controls'>
        <button onClick={startRecording}>Start Recording</button>
        <button onClick={stopRecording}>Stop Recording</button>
        <button onClick={playRecordedSounds}>Play Record</button>
        <button onClick={exportToWav}>Export to WAV</button>
      </div>
        )}
    </div>
  );
};

export default DrumKit;
