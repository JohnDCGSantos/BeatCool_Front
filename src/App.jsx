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

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path='/' element={<DrumPads />} />
        <Route path='/drumkits' element={<DrumKitList />} />
        <Route path='/drumkits/:id' element={<DrumKit />} />
        <Route path='/beatCreator' element={<BeatCreatorsList />} />
        <Route path='/beatCreator/:id' element={<BeatCreatorPage />} />

        <Route path='/combined/:id' element={<CombinedPlayback />} />
        <Route path='/combined' element={<Go />} />

        <Route path='/combinedCreator' element={<BeatAndDrum />} />
      </Routes>
    </>
  )
}

export default App
