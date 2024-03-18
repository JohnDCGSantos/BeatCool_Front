import { useState, useEffect, useRef } from 'react'
import axios from 'axios'

const RecordedSequences = () => {
  const [recordedSequences, setRecordedSequences] = useState([])
  const audioRefs = useRef({})

  useEffect(() => {
    const fetchRecordedSequences = async () => {
      try {
        const response = await axios.get('http://localhost:5005/recorded/recordedSequences')
        setRecordedSequences(response.data)
        preloadRecordedSounds(response.data)
      } catch (error) {
        console.error('Error fetching recorded sequences:', error)
      }
    }

    fetchRecordedSequences()
  }, [])
  useEffect(() => {
    // Preload audio when component mounts
    preloadRecordedSounds(recordedSequences)
  }, [recordedSequences])
  const preloadRecordedSounds = sequences => {
    sequences.forEach(sequence => {
      sequence.recordedSounds.forEach(({ sound }) => {
        if (!audioRefs.current[sound]) {
          const audio = new Audio(sound)
          audio.preload = 'auto'
          audioRefs.current[sound] = audio
        }
      })
    })
  }

  const playRecord = async (soundUrl, delay) => {
    await new Promise(resolve => setTimeout(resolve, delay))
    const audio = audioRefs.current[soundUrl]
    if (audio) {
      audio.currentTime = 0

      audio.play().catch(error => console.error(`Failed to play sound: ${error}`))
    }
  }

  const playSequence = async recordedSequence => {
    let previousTimestamp = Date.now()
    for (let i = 0; i < recordedSequence.recordedSounds.length; i++) {
      const { sound, timestamp } = recordedSequence.recordedSounds[i]
      const currentTimestamp = new Date(timestamp).getTime()
      const delay = currentTimestamp - previousTimestamp

      await playRecord(sound, delay)
      previousTimestamp = currentTimestamp
    }
  }

  return (
    <div>
      <h2>Recorded Sequences</h2>
      <ul>
        {recordedSequences.map((sequence, index) => (
          <li style={{ listStyle: 'none', marginBottom: '5px' }} key={index}>
            <button onClick={() => playSequence(sequence)}>{sequence.name}</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default RecordedSequences
