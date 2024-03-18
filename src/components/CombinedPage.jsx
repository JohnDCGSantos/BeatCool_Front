import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

const CombinedListPage = () => {
  const [beatMakerAndDrumKits, setBeatMakerAndDrumKits] = useState([])

  useEffect(() => {
    const fetchBeatMakerAndDrumKits = async () => {
      try {
        const response = await axios.get('http://localhost:5005/beatMakerAndDrumkit')
        setBeatMakerAndDrumKits(response.data)
      } catch (error) {
        console.error('Error fetching BeatMakerAndDrumKits:', error)
      }
    }

    fetchBeatMakerAndDrumKits()
  }, [])

  return (
    <>
      <div className='drumKitListTitle'>
        <h2>All BeatMakerAndDrumKit Entities</h2>
      </div>
      <div className='drumKitList'>
        <ul>
          {beatMakerAndDrumKits.map(beatMakerAndDrumKit => (
            <li key={beatMakerAndDrumKit._id}>
              <Link to={`/combined/${beatMakerAndDrumKit._id}`}>{beatMakerAndDrumKit.name}</Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

export default CombinedListPage
