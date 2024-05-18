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

 const preloadSounds = drumSounds => {

    drumSounds.forEach(drumSound => {
      const audio = new Audio(drumSound.soundUrl)
     audio.preload = 'auto'
      audioRefs.current[drumSound.soundUrl] = audio 
     
    })      

  }
  useEffect(() => {
    const fetchDrumKit = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/drumkits/${id}`)
        setDrumKit(response.data)
        setDrumSounds(response.data.drumPads) 
        preloadSounds(response.data.drumPads) 
        setIsLoading(false)

      } catch (error) {
        console.error('Error fetching drum kit:', error)
      }
    }

    fetchDrumKit()

  }, [])
  


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
  const handleSoundClick = (drumpad) => {
    /*if (recording) {
      const timestamp = Date.now()
      setRecordedSequence(prevSequence => [...prevSequence, { sound: soundUrl, timestamp }])
    }*/
    playSound(drumpad)
    
  }
  
  const handleSoundPreLoadClik = () => {
    /*if (recording) {
      const timestamp = Date.now()
      setRecordedSequence(prevSequence => [...prevSequence, { sound: soundUrl, timestamp }])
    }*/
   preloadSounds(drumSounds)
    console.log('cliked', drumSounds)
  }

  const playSound = soundUrl => {
    const audio = new Audio(soundUrl)
    if (audio) {
      console.log(audio)
      audio.currentTime = 0
      audio.play().catch(error => console.error(`Failed to play sound: ${error}`))
    }
  }
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
  
  return isLoading?('loading'):(
    
    <div className='playDr'>
                 
      <button style={{marginTop:'80px'}}onClick={handleSoundPreLoadClik}>hhh</button>

      
     
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