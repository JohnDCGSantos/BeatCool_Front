import { useState, useEffect } from 'react'
import axios from 'axios'
import BeatCreator from '../components/BeatCreator'
import DrumKit from '../components/DrumKit' // Import the DrumKitPage component
import { useParams } from 'react-router-dom'
import '../styles/combined.css'
import { apiBaseUrl } from '../config'

const CombinedPage = () => {
  const { id } = useParams()
  const [beatMakerAndDrumKit, setBeatMakerAndDrumKit] = useState(null)
  const [beatMaker, setBeatMaker] = useState(null)
  const [drumKit, setDrumKit] = useState(null)
  const [beatMakerId, setBeatMakerId] = useState(null)
  const [drumKitId, setDrumKitId] = useState(null)

  useEffect(() => {
    const fetchBeatMakerAndDrumKit = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/beatMakerAndDrumkit/${id}`)
        setBeatMakerAndDrumKit(response.data)

        if (response.data.beatMakers.length > 0) {
          const firstBeatMakerId = response.data.beatMakers[0]
          setBeatMakerId(firstBeatMakerId)
          const beatMakerResponse = await axios.get(
            `${apiBaseUrl}/beatMaker/${firstBeatMakerId}`
          )
          setBeatMaker(beatMakerResponse.data)
        }
        if (response.data.drumKits.length > 0) {
          const firstDrumKitId = response.data.drumKits[0]
          setDrumKitId(firstDrumKitId)
          const drumKitResponse = await axios.get(
            `${apiBaseUrl}/drumKits/${firstDrumKitId}`
          )
          setDrumKit(drumKitResponse.data)
        }
      } catch (error) {
        console.error('Error fetching BeatMakerAndDrumKit:', error)
      }
    }

    fetchBeatMakerAndDrumKit()
  }, [id])
  
  return (
    <div className='imageKitsPlay' >
    <div className= 'shadows'>
    
      {beatMakerAndDrumKit && (
       <div className='combined'>
          
        
          
         {beatMaker && (
          
            <div className='beatMaker'>
              <BeatCreator id={beatMakerId}  enableRecording={true} />
            </div>
          )} 
          
        {drumKit && (
            <div className='drumMaker'>
              <DrumKit id={drumKitId}  enableRecording={true} />
            </div>
          )}
      </div>)}
    </div>    </div>

  )
}

export default CombinedPage
