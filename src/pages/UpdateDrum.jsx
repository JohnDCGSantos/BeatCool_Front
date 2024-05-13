// UpdateDrum.js
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import UpdateDrumKitForm from '../components/UpdateDrumKitForm'
import { apiBaseUrl } from '../config'

const UpdateDrum = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [drumKit, setDrumKit] = useState(null)
  const [sounds, setSounds] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch drum kit data
        const drumKitResponse = await fetch(`${apiBaseUrl}/drumkits/${id}`)
        if (drumKitResponse.ok) {
          const drumKitData = await drumKitResponse.json()
          setDrumKit(drumKitData)
        } else {
          console.error('Failed to fetch drum kit:', drumKitResponse.status)
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

  const handleUpdateDrum = async (updatedDrumKit) => {
    try {
      const response = await fetch(`${apiBaseUrl}/drumkits/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedDrumKit),
        
      })
      console.log(updatedDrumKit)
      if (response.ok) {
        const updatedData = await response.json()
        navigate(`/drumkits/${updatedData._id}`)
      } else {
        console.error('Failed to update drum kit:', response.status)
      }
    } catch (error) {
      console.error('Error updating drum kit:', error)
    }
  }

  return isLoading?(<p>Loading...</p>):(
    
    <div className='imageCreate' 
    
    >
    <div className= 'shadows'>
    <div className='create'>
      <h3>Edit Drum Kit</h3>
      {!isLoading && drumKit && sounds && (
        <UpdateDrumKitForm onSubmit={handleUpdateDrum} defaultValues={drumKit} sounds={sounds} />
      )}
</div>
    </div>
    </div>    
   
  )
}

export default UpdateDrum
