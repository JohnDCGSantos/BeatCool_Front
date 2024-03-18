import { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import './BeatCreator.css'

const BeatCreator = ({ id }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [tempo, setTempo] = useState(120) // Beats per minute (BPM)
  const [currentSoundIndex, setCurrentSoundIndex] = useState(null) // Track currently playing sound index
  const [currentBeatIndex, setCurrentBeatIndex] = useState(null) // Track currently playing beat index
  const soundRefs = useRef({}) // Use ref for storing sound references
  const playingSounds = useRef([]) // Keep track of currently playing sounds
  const nextBeatTimeout = useRef(null) // Variable to store the timeout ID
  const [sounds, setSounds] = useState([])
  const [beatGrid, setBeatGrid] = useState([]) // Initialize beatGrid with an empty array

  useEffect(() => {
    const fetchDrumKit = async () => {
      try {
        const response = await axios.get(`http://localhost:5005/beatMaker/${id}`)
        setSounds(response.data.drumPads)
        // Set beatGrid only after sounds have been fetched
        setBeatGrid(
          Array.from({ length: Object.keys(response.data.drumPads).length }, () =>
            Array(32).fill(false)
          )
        )
      } catch (error) {
        console.error('Error fetching drum kit:', error)
      }
    }

    fetchDrumKit()
  }, [id])

  useEffect(() => {
    // Create Audio objects for each sound when sounds array is updated
    for (const sound in sounds) {
      soundRefs.current[sound] = new Audio(sounds[sound].soundUrl)
      soundRefs.current[sound].preload = true // Ensure preload for smoother playback
    }

    return () => {
      // Cleanup function to stop all sounds when component unmounts
      playingSounds.current.forEach(sound => {
        sound.pause()
        sound.currentTime = 0
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sounds])
  useEffect(() => {
    if (isPlaying) {
      playBeat()
    } else {
      stopBeat()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying])

  useEffect(() => {
    if (isPlaying) {
      clearTimeout(nextBeatTimeout.current) // Clear the timeout for the next beat

      playBeat()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [beatGrid, tempo])

  const toggleBeat = (soundIndex, time) => {
    setBeatGrid(prevBeatGrid => {
      const newBeatGrid = [...prevBeatGrid]
      newBeatGrid[soundIndex] = [...prevBeatGrid[soundIndex]] // Copy the row array
      newBeatGrid[soundIndex][time] = !prevBeatGrid[soundIndex][time] // Toggle the beat cell state

      // Check if all beat boxes for this sound are deselected
      const allBoxesDeselected = newBeatGrid[soundIndex].every(beat => !beat)

      if (allBoxesDeselected && playingSounds.current.length > 0) {
        // If all boxes are deselected and the sound is playing, stop the sound
        const soundKey = Object.keys(sounds)[soundIndex]
        const audio = soundRefs.current[soundKey]
        const index = playingSounds.current.indexOf(audio)
        if (index !== -1) {
          audio.pause()
          audio.currentTime = 0
          playingSounds.current.splice(index, 1)
        }
      }

      return newBeatGrid
    })
  }

  const stopBeat = () => {
    clearTimeout(nextBeatTimeout.current) // Clear the timeout for the next beat

    // Stop all currently playing sounds
    playingSounds.current.forEach(sound => {
      sound.pause()
      sound.currentTime = 0
    })
    playingSounds.current = []

    setCurrentSoundIndex(null) // Reset currently playing sound index
    setCurrentBeatIndex(null) // Reset currently playing beat index
  }

  const playBeat = () => {
    const secondsPerBeat = 60 / tempo
    const loopDuration = secondsPerBeat * 8
    const millisecondsPerBeat = 60000 / tempo
    const millisecondsPerSubBeat = millisecondsPerBeat / 4 // 16 sub-beats per beat
    const totalBeats = beatGrid[0].length
    let beatIndex = currentBeatIndex !== null ? currentBeatIndex : 0

    const playNextBeat = () => {
      setCurrentBeatIndex(beatIndex)

      beatGrid.forEach((row, soundIndex) => {
        if (row[beatIndex]) {
          setCurrentSoundIndex(soundIndex)

          const soundKey = Object.keys(sounds)[soundIndex]
          const audio = soundRefs.current[soundKey]
          const duration = audio.duration

          if (audio && duration > 4) {
            const desiredDuration = millisecondsPerBeat / 1000 + 0.01
            const playbackRate = duration / desiredDuration / 16
            audio.playbackRate = playbackRate
          }

          if (audio) {
            audio.currentTime = 0
            audio.play().catch(error => console.error(`Failed to play sound: ${error}`))
            playingSounds.current.push(audio)
          }
        }
      })

      beatIndex = (beatIndex + 1) % totalBeats
      nextBeatTimeout.current = setTimeout(playNextBeat, millisecondsPerSubBeat)
    }

    playNextBeat()
  }

  return sounds.length > 0 ? (
    <>
      <div id='carouselExample' className='carousel slide'>
        <div className='carousel-inner'>
          {[...Array(4).keys()].map((slide, slideIndex) => (
            <div key={slideIndex} className={`carousel-item ${slideIndex === 0 ? 'active' : ''}`}>
              <div className='beat-grid'>
                {/* Beat Grid Content */}
                {Object.keys(sounds).map((sound, soundIndex) => (
                  <div key={sound}>
                    {/* Assign unique key to the parent div */}
                    <span className='noteNames'>{sounds[sound].name}</span>
                    <div className='beat-row'>
                      {[...Array(8).keys()].map(time => (
                        <div
                          key={time}
                          className={`beat-cell ${
                            beatGrid[soundIndex][time + slideIndex * 8] ? 'active' : ''
                          } ${
                            soundIndex === currentSoundIndex &&
                            time + slideIndex * 8 === currentBeatIndex
                              ? 'playing'
                              : ''
                          }`}
                          onClick={() => toggleBeat(soundIndex, time + slideIndex * 8)}
                        ></div>
                      ))}
                    </div>
                  </div>
                ))}
                {/* End Beat Grid Content */}
                slideIndex:{slideIndex + 1}/4
              </div>
              <div className='carousel-controls'>
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
            </div>
          ))}
        </div>
      </div>
      <div className='controls'>
        <button onClick={() => setIsPlaying(!isPlaying)}>
          {isPlaying ? 'Stop' : 'Start'} Beat
        </button>{' '}
        <label>Tempo (BPM):</label>
        <div className='bpm'>
          <input
            type='range'
            value={tempo}
            onChange={e => setTempo(parseInt(e.target.value))}
            min='30'
            max='300'
            step='1'
          />{' '}
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
    </>
  ) : null
}

export default BeatCreator
