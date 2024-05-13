// UpdateDrum.js
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import UpdateCreatorForm from '../components/UpdateCreatorForm'
import { apiBaseUrl } from '../config'

const UpdateCreator = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [beatMaker, setBeatMaker] = useState(null)
  const [sounds, setSounds] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch drum kit data
        const creatorResponse = await fetch(`${apiBaseUrl}/beatMaker/${id}`)
        if (creatorResponse.ok) {
          const creatorData = await creatorResponse.json()
          setBeatMaker(creatorData)
        } else {
          console.error('Failed to fetch drum kit:', creatorResponse.status)
        }

        // Fetch sounds data
        const soundsResponse = await fetch(`${apiBaseUrl}/pads`)
        if (soundsResponse.ok) {
          const soundsData = await soundsResponse.json()
          setSounds(soundsData)
        } else {
          console.error('Failed to fetch sounds:', soundsResponse.status)
        }

        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error)
        setIsLoading(false)
      }
    }

    fetchData()
  }, [id]) // Include id in the dependency array to refetch data when id changes

  const handleSubmit = async (updatedCreator) => {
    try {
      const response = await fetch(`${apiBaseUrl}/beatMaker/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedCreator),
        
      })
      console.log(updatedCreator)
      if (response.ok) {
        const updatedData = await response.json()
        navigate(`/beatCreator/${updatedData._id}`)
      } else {
        console.error('Failed to update drum kit:', response.status)
      }
    } catch (error) {
      console.error('Error updating drum kit:', error)
    }
  }

  return (
    <div className='imageCreate'>
    <div className= 'shadows'>
    <div className='create'>
      <h3>Edit Beat Maker</h3>
      {!isLoading && beatMaker && sounds && (
        <UpdateCreatorForm onSubmit={handleSubmit} defaultValues={beatMaker} sounds={sounds} />
      )}
    </div> </div></div>
  )
}

export default UpdateCreator
