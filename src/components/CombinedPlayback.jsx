import { useState, useEffect } from 'react'
import axios from 'axios'
import BeatCreator from './BeatCreator'
import DrumKitPage from '../pages/DrumKitPage' // Import the DrumKitPage component
import { useParams } from 'react-router-dom'
import './BeatCreator.css'

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
        const response = await axios.get(`http://localhost:5005/beatMakerAndDrumkit/${id}`)
        setBeatMakerAndDrumKit(response.data)

        if (response.data.beatMakers.length > 0) {
          const firstBeatMakerId = response.data.beatMakers[0]
          setBeatMakerId(firstBeatMakerId)
          const beatMakerResponse = await axios.get(
            `http://localhost:5005/beatMaker/${firstBeatMakerId}`
          )
          setBeatMaker(beatMakerResponse.data)
        }
        if (response.data.drumKits.length > 0) {
          const firstDrumKitId = response.data.drumKits[0]
          setDrumKitId(firstDrumKitId)
          const drumKitResponse = await axios.get(
            `http://localhost:5005/drumKits/${firstDrumKitId}`
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
    <div className='combined'>
      <h2>Combined Page</h2>
      {beatMakerAndDrumKit && (
        <div>
          <h3>Beat Maker and Drum Kit Details</h3>
          <p>Name: {beatMakerAndDrumKit.name}</p>
          {beatMaker && (
            <div className='beatMaker'>
              <h4>Beat Maker</h4>
              <BeatCreator id={beatMakerId} />
            </div>
          )}
          {drumKit && (
            <div>
              <h4>Drum Kit</h4>
              {/* Pass the id as a prop to DrumKitPage */}
              <DrumKitPage id={drumKitId} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default CombinedPage
