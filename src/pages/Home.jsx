import { useNavigate } from 'react-router-dom'
import '../styles/create.css'
const Home = () => {
    const nav= useNavigate()
  
  return (
    <div className='image'>
      <div className='create'>
    <div className='selectCard'>
              <div className='selecter'>
                <h2 className='selectOptionTitle'>Select an Option</h2>
                <div className='optionSelect'>
                  <div className='selectBtnContainer'>
                    <button className='selected-sound-items'onClick={() => nav('/')}>Create</button>
                    <button className='selected-sound-items' onClick={() => nav('/drumKits')}>Drum Kit List</button>
                    <button className='selected-sound-items' onClick={() => nav('/beatCreator')}>BeatMaker List</button>
                    <button className='selected-sound-items' onClick={() => nav('/combined')}>Combined List</button>


                  </div> </div> </div> </div>
                  </div> </div>
  )

}
export default Home
