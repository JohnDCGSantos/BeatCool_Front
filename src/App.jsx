import './index.css'
import './App.css'

import { Routes, Route } from 'react-router-dom'

import Navbar from './components/NavBar'
import DrumPads from './pages/DrumPads'
import CombinedMaker from './pages/CombinedMaker'
import BeatCreatorsList from './pages/BeatCreatorList'
import BeatCreatorPage from './pages/BeatCreatorPage'
import DrumKitList from './pages/DrumKitList'
import DrumKitPage from './pages/DrumKitPage'
import CombinedList from './pages/CombinedListPage'
import CombinedPage from './pages/CombinedPage'
import UpdateDrum from './pages/UpdateDrum'
import UpdateCreator from './pages/UpdateCreator'
import CombinedUpdate from './pages/UpdateCombined'

import SignUp from './components/SignUp'
import Login from './components/Login'
import IsPrivate from './context/IsPrivate'
import Home from './pages/Home'


function App() {
  
  
  return (
    <>
      <Navbar />

      <Routes>
      <Route path='/' element={<Home />} />

        <Route path='/create' element={<DrumPads />} />
        <Route path='/drumkits/:id/update' element={<IsPrivate><UpdateDrum /></IsPrivate>} />
        <Route path='/beatCreator/:id/update' element={<IsPrivate><UpdateCreator /></IsPrivate>} />
        <Route path='/combined/:id/update' element={<IsPrivate><CombinedUpdate /></IsPrivate>} />

        <Route path='/drumkits' element={<IsPrivate><DrumKitList /></IsPrivate>} />
        
        <Route path='/drumkits/:id' element={<IsPrivate><DrumKitPage /></IsPrivate>} />
        
        <Route path='/beatCreator' element={<IsPrivate><BeatCreatorsList /></IsPrivate>} />
        <Route path='/beatCreator/:id' element={<IsPrivate><BeatCreatorPage /></IsPrivate>} />

        <Route path='/combined/:id' element={<IsPrivate><CombinedPage /></IsPrivate>} />
        <Route path='/combined' element={<IsPrivate><CombinedList /></IsPrivate>} />
        <Route path='/login' element={<Login />} />

        <Route path='/combinedCreator' element={<IsPrivate><CombinedMaker /></IsPrivate>} />
<Route path='/signUp' element={<SignUp/>}/>
      </Routes>
    </>
  )
}

export default App
