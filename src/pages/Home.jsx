import { useNavigate } from 'react-router-dom'
import { useState, useContext, useEffect } from 'react'
import '../styles/create.css'
import Tutorial from '../components/HomeTutorial'
import { AuthContext  } from '../context/Auth.context'

const Home = () => {
  const [showTutorial, setShowTutorial] = useState(false);
  
  const handleTutorialClose = () => {
    setShowTutorial(false);
  };
  const {authenticateUser, user}=useContext(AuthContext)
    const nav= useNavigate()
    useEffect(()=>{
      authenticateUser()
      },[])
      
  return (
    <div className='image'>
      <div className='create'>
       
      <div style={{marginTop:'10px'}}>
                <button style={{width:'100%', padding:'5px'}} className="btnSkip" onClick={() => setShowTutorial(true)}>
                 Tutorial- Know what you can do with Beat It Up,  &nbsp; {user ? user.username : null}&nbsp;!!
              </button>
              </div>
            
            {showTutorial && <Tutorial onClose={handleTutorialClose} />}

    <div className='selectCard'>
              <div className='selecter'>
                <h2 className='selectOptionTitle'>Select an Option</h2>
                <div className='optionSelect'>
                  <div className='selectBtnContainer'>
                    <button className='selected-sound-items'onClick={() => nav('/create')}>Create</button>
                    <button className='selected-sound-items' onClick={() => nav('/drumKits')}>Drum Kit List</button>
                    <button className='selected-sound-items' onClick={() => nav('/beatCreator')}>BeatMaker List</button>
                    <button className='selected-sound-items' onClick={() => nav('/combined')}>Combined List</button>


                  </div> </div> </div>
   <div style={{textAlign:'center',position:'relative', bottom:'0%'}}>
  <div>
 <p style={{margin:'0', fontSize:'10px'}}>Created by João Santos, 2024.</p>
 </div>
 <div>
  <p style={{margin:'0', fontSize:'10px'}}>All rights reserved.</p>
  </div>
</div></div> 
 </div>
  )
  
  </div>
  )
 
}
export default Home
