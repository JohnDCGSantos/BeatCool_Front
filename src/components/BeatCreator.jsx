/*import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import '../styles/BeatCreator.css';
import { apiBaseUrl } from '../config';

const BeatCreator = ({ id }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [tempo, setTempo] = useState(120); 
  const [currentSoundIndex, setCurrentSoundIndex] = useState(null); // Track currently playing sound index
  const [currentBeatIndex, setCurrentBeatIndex] = useState(null); // Track currently playing beat index
  const [sounds, setSounds] = useState([]);
  const [beatGrid, setBeatGrid] = useState([]); // Initialize beatGrid with an empty array
  const [isLoading, setIsLoading] = useState(true);
  const audioContextRef = useRef(null);
  const audioBuffersRef = useRef({});
  const audioSourceNodesRef = useRef({});
  const nextBeatTimeout = useRef(null); // Variable to store  timeout ID
  
  useEffect(() => {
    const fetchDrumKit = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/beatMaker/${id}`);
        setSounds(response.data.drumPads);
        // Set beatGrid only after sounds have been fetched
        setBeatGrid(
          Array.from({ length: Object.keys(response.data.drumPads).length }, () =>
            Array(32).fill(false)
          )
        );
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

      const loadAllSounds = Object.values(drumSounds).map((sound) => loadSound(sound.soundUrl));
      await Promise.all(loadAllSounds);

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

  const toggleBeat = (soundIndex, time) => {
    setBeatGrid(prevBeatGrid => {
      const newBeatGrid = [...prevBeatGrid];
      newBeatGrid[soundIndex] = [...prevBeatGrid[soundIndex]];
      newBeatGrid[soundIndex][time] = !prevBeatGrid[soundIndex][time];
      return newBeatGrid;
    });
  };

  const stopBeat = () => {
    clearTimeout(nextBeatTimeout.current);
    setCurrentSoundIndex(null);
    setCurrentBeatIndex(null);
  };

  const playBeat = () => {
    const millisecondsPerBeat = 60000 / tempo;
    const millisecondsPerSubBeat = millisecondsPerBeat / 4; // 16 sub-beats per beat
    const totalBeats = beatGrid[0].length;
    let beatIndex = currentBeatIndex !== null ? currentBeatIndex : 0;

    const playNextBeat = () => {
      setCurrentBeatIndex(beatIndex);

      beatGrid.forEach((row, soundIndex) => {
        if (row[beatIndex]) {
          setCurrentSoundIndex(soundIndex);
          const soundKey = Object.keys(sounds)[soundIndex];
          const soundUrl = sounds[soundKey].soundUrl;
          playSound(soundUrl);
        }
      });

      beatIndex = (beatIndex + 1) % totalBeats;
      nextBeatTimeout.current = setTimeout(playNextBeat, millisecondsPerSubBeat);
    };

    playNextBeat();
  };

  useEffect(() => {
    if (isPlaying) {
      playBeat();
    } else {
      stopBeat();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (isPlaying) {
      clearTimeout(nextBeatTimeout.current);
      playBeat();
    }
  }, [beatGrid, tempo]);

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
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const controls = document.querySelectorAll('.carousel-control-prev, .carousel-control-next');

      controls.forEach(control => {
        if (scrollY > windowHeight / 2) {
          control.style.top = `${scrollY}px`;
        } else {
          control.style.top = '50%';
        }
      });
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return isLoading ? (
    <div>Loading sounds...</div>
  ) : (
    <div id='carouselExample' className='carousel slide'>
      <div className='carousel-inner'>
        {[...Array(4).keys()].map((slide, slideIndex) => (
          <div key={slideIndex} className={`carousel-item ${slideIndex === 0 ? 'active' : ''}`}>
            <div className='beat-grid'> slideIndex:{slideIndex + 1}/4
              {Object.keys(sounds).map((sound, soundIndex) => (
                <div key={sound} className='beat-row'>
                  <div className='noteNames'>{sounds[sound].name}</div>
                  {[...Array(8).keys()].map(time => (
                    <div
                      key={time}
                      className={`beat-cell ${
                        beatGrid[soundIndex][time + slideIndex * 8] ? 'active' : ''
                      } ${
                        soundIndex === currentSoundIndex && time + slideIndex * 8 === currentBeatIndex
                          ? 'playing'
                          : ''
                      }`}
                      onClick={() => toggleBeat(soundIndex, time + slideIndex * 8)}
                    ></div>
                  ))}
                </div>
              ))}
                              slideIndex:{slideIndex + 1}/4

            </div>
            <button
              className='carousel-control-prev'
              type='button'
              data-bs-target='#carouselExample'
              data-bs-slide='prev'
            >
              <span className='carousel-control-prev-icon' aria-hidden='true'></span>
            </button>
            <button
              className='carousel-control-next'
              type='button'
              data-bs-target='#carouselExample'
              data-bs-slide='next'
            >
              <span className='carousel-control-next-icon' aria-hidden='true'></span>
            </button>
          </div>
        ))}
      </div>
      <div className='controls'>
        <button onClick={() => setIsPlaying(!isPlaying)}>
          {isPlaying ? 'Stop' : 'Start'} Beat
        </button>
        <div className='bpm'>
          <label>BPM</label>
          <input
            type='range'
            value={tempo}
            onChange={e => setTempo(parseInt(e.target.value))}
            min='30'
            max='300'
            step='1'
          />
          <input
            type='number'
            value={tempo}
            onChange={e => setTempo(parseInt(e.target.value))}
            min='30'
            max='300'
            inputMode='numeric'
            style={{ marginRight: '10px' }}
          />
        </div>
      </div>
    </div>
  );
};

export default BeatCreator;*/

import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import '../styles/BeatCreator.css';
import { apiBaseUrl } from '../config';

const BeatCreator = ({ id }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [tempo, setTempo] = useState(120); 
  const [currentSoundIndex, setCurrentSoundIndex] = useState(null);
  const [currentBeatIndex, setCurrentBeatIndex] = useState(null);
  const [sounds, setSounds] = useState([]);
  const [beatGrid, setBeatGrid] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const audioContextRef = useRef(null);
  const audioBuffersRef = useRef({});
  const audioSourceNodesRef = useRef({});
  const nextBeatTimeout = useRef(null);

  // Recording related states and refs
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

  useEffect(() => {
    console.log(isPlayingSequence)
  }, [isPlayingSequence, recording]);

  const stopRecording = () => {
    setRecording(false);
  };

  const exportToWav = async () => {
    const audioContext = audioContextRef.current;
    const bufferTime = 1;
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

  const playRecordedSequence = async () => {
    if (recordedSequence.length === 0 || isPlayingSequence) return;

    const audioContext = audioContextRef.current;
    setIsPlayingSequence(true);
    for (let i = 0; i < recordedSequence.length; i++) {
      const { sound, timestamp } = recordedSequence[i];
      const delay = i === 0 ? 0 : timestamp - recordedSequence[i - 1].timestamp;

      await new Promise(resolve => setTimeout(resolve, delay));

      const audioBuffer = audioBuffersRef.current[sound];
      const sourceNode = audioContext.createBufferSource();
      sourceNode.buffer = audioBuffer;
      sourceNode.connect(audioContext.destination);
      sourceNode.start(0);
    }
    setIsPlayingSequence(false);
  };

  useEffect(() => {
    const fetchDrumKit = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/beatMaker/${id}`);
        setSounds(response.data.drumPads);
        setBeatGrid(
          Array.from({ length: Object.keys(response.data.drumPads).length }, () =>
            Array(32).fill(false)
          )
        );
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

      const loadAllSounds = Object.values(drumSounds).map((sound) => loadSound(sound.soundUrl));
      await Promise.all(loadAllSounds);

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

      // If recording, add this sound to the sequence
      if (recording) {
        const timestamp = Date.now();
        setRecordedSequence(prevSequence => [...prevSequence, { sound: soundUrl, timestamp }]);
      }
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

  const toggleBeat = (soundIndex, time) => {
    setBeatGrid(prevBeatGrid => {
      const newBeatGrid = [...prevBeatGrid];
      newBeatGrid[soundIndex] = [...prevBeatGrid[soundIndex]];
      newBeatGrid[soundIndex][time] = !prevBeatGrid[soundIndex][time];
      return newBeatGrid;
    });
  };

  const stopBeat = () => {
    clearTimeout(nextBeatTimeout.current);
    setCurrentSoundIndex(null);
    setCurrentBeatIndex(null);
  };

  const playBeat = () => {
    const millisecondsPerBeat = 60000 / tempo;
    const millisecondsPerSubBeat = millisecondsPerBeat / 4; // 16 sub-beats per beat
    const totalBeats = beatGrid[0].length;
    let beatIndex = currentBeatIndex !== null ? currentBeatIndex : 0;

    const playNextBeat = () => {
      setCurrentBeatIndex(beatIndex);

      beatGrid.forEach((row, soundIndex) => {
        if (row[beatIndex]) {
          setCurrentSoundIndex(soundIndex);
          const soundKey = Object.keys(sounds)[soundIndex];
          const soundUrl = sounds[soundKey].soundUrl;
          playSound(soundUrl);
        }
      });

      beatIndex = (beatIndex + 1) % totalBeats;
      nextBeatTimeout.current = setTimeout(playNextBeat, millisecondsPerSubBeat);
    };

    playNextBeat();
  };

  useEffect(() => {
    if (isPlaying) {
      playBeat();
    } else {
      stopBeat();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (isPlaying) {
      clearTimeout(nextBeatTimeout.current);
      playBeat();
    }
  }, [beatGrid, tempo]);

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
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const controls = document.querySelectorAll('.carousel-control-prev, .carousel-control-next');

      controls.forEach(control => {
        if (scrollY > windowHeight / 2) {
          control.style.top = `${scrollY}px`;
        } else {
          control.style.top = '50%';
        }
      });
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return isLoading ? (
    <div>Loading sounds...</div>
  ) : (
    <div id='carouselExample' className='carousel slide'>
      <div className='carousel-inner'>
        {[...Array(4).keys()].map((slide, slideIndex) => (
          <div key={slideIndex} className={`carousel-item ${slideIndex === 0 ? 'active' : ''}`}>
            <div className='beat-grid'>                 
                    slideIndex:{slideIndex + 1}/4

              {Object.keys(sounds).map((sound, soundIndex) => (
                <div key={sound} className='beat-row'>
                  <div className='noteNames'>{sounds[sound].name}</div>
                  {[...Array(8).keys()].map(time => (
                    <div
                      key={time}
                      className={`beat-cell ${
                        beatGrid[soundIndex][time + slideIndex * 8] ? 'active' : ''
                      } ${
                        soundIndex === currentSoundIndex && time + slideIndex * 8 === currentBeatIndex
                          ? 'playing'
                          : ''
                      }`}
                      onClick={() => toggleBeat(soundIndex, time + slideIndex * 8)}
                    ></div>
                  ))}
                </div>
              ))}  
                        slideIndex:{slideIndex + 1}/4

            </div>

            <button
              className='carousel-control-prev'
              type='button'
              data-bs-target='#carouselExample'
              data-bs-slide='prev'
            >
              <span className='carousel-control-prev-icon' aria-hidden='true'></span>
            </button>
            <button
              className='carousel-control-next'
              type='button'
              data-bs-target='#carouselExample'
              data-bs-slide='next'
            >
              <span className='carousel-control-next-icon' aria-hidden='true'></span>
            </button>
          </div>
        ))}
      </div>
      <div className='controls'>
        <button onClick={() => setIsPlaying(!isPlaying)}>
          {isPlaying ? 'Stop' : 'Start'} Beat
        </button>
        <div className='bpm'>
          <label>BPM</label>
          <input
            type='range'
            value={tempo}
            onChange={e => setTempo(parseInt(e.target.value))}
            min='30'
            max='300'
            step='1'
          />
          <input
            type='number'
            value={tempo}
            onChange={e => setTempo(parseInt(e.target.value))}
            min='30'
            max='300'
            inputMode='numeric'
            style={{ marginRight: '10px' }}
          />
        </div>
        <div className='recordingBM-controls'>
        <button onClick={startRecording} disabled={recording || isPlayingSequence}>
          Start Recording
        </button>
        <button onClick={stopRecording} disabled={!recording}>
          Stop Recording
        </button>
        <button onClick={exportToWav} disabled={recording || recordedSequence.length === 0}>
          Export to WAV
        </button>
        <button onClick={playRecordedSequence} disabled={recording || recordedSequence.length === 0}>
          Play Record
        </button>
        </div>
      </div>
    </div>
  );
};

export default BeatCreator;
