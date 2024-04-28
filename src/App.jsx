import './App.css'
import './index.css'
import Navbar from './components/NavBar'
import { Routes, Route } from 'react-router-dom'
import DrumKitList from './pages/DrumKitList'
import DrumKit from './pages/DrumKit'
import DrumPads from './pages/DrumPads'
import BeatCreatorPage from './pages/BeatCreatorPage'
import BeatCreatorsList from './pages/BeatCreatorList'
import CombinedPlayback from './components/CombinedPlayback'
import Go from './components/CombinedPage'
import BeatAndDrum from './pages/BeatMakerAndDrumKitMaker'
import SignUp from './components/SignUp'
import Login from './components/Login'
import IsPrivate from './context/IsPrivate'
import UpdateDrum from './pages/UpdateDrum'
import UpdateCreator from './pages/UpdateCreator'
import CombinedUpdate from './pages/CombinedUpdate'

function App() {
  
  
  return (
    <>
      <Navbar />

      <Routes>
        <Route path='/' element={<DrumPads />} />
        <Route path='/drumkits/:id/update' element={<UpdateDrum />} />
        <Route path='/beatCreator/:id/update' element={<UpdateCreator />} />
        <Route path='/combined/:id/update' element={<CombinedUpdate />} />

        <Route path='/drumkits' element={<IsPrivate><DrumKitList /></IsPrivate>} />
        
        <Route path='/drumkits/:id' element={<DrumKit />} />
        
        <Route path='/beatCreator' element={<IsPrivate><BeatCreatorsList /></IsPrivate>} />
        <Route path='/beatCreator/:id' element={<BeatCreatorPage />} />

        <Route path='/combined/:id' element={<CombinedPlayback />} />
        <Route path='/combined' element={<IsPrivate><Go /></IsPrivate>} />
        <Route path='/login' element={<Login />} />

        <Route path='/combinedCreator' element={<IsPrivate><BeatAndDrum /></IsPrivate>} />
<Route path='/signUp' element={<SignUp/>}/>
      </Routes>
    </>
  )
}

export default App
