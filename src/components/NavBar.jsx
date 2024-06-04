import { NavLink } from 'react-router-dom'
import LogoutButton from './LogOut'
import 'bootstrap/dist/css/bootstrap.min.css'
import { FaBars, FaTimes } from 'react-icons/fa'
import { useState } from 'react'
import '..//styles/NavBar.css'
import LoginBtn from './LoginBtn'
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react'
import { AuthContext } from '../context/Auth.context'
import image from '../images/download.png'

function Navbar() {
  const [click, setClick] = useState(false)

  const handleClick = () => setClick(!click)
  const closeMenu = () => setClick(false)
  const nav=useNavigate()
  const { logout}=useContext(AuthContext)

  const handleLogin = () => {
    // Clear JWT token from localStorage
   
    nav('/login')
    closeMenu()
  };
  const handleLogout = () => {
    // Clear JWT token from localStorage
    nav('/login')
   logout()
   closeMenu()
  };
  return (
    <div className='header'>
      <div>
        <NavLink to='/'>
        
            <img className='navLogo' src={image} alt="" />
        
        </NavLink>
        </div>
      <ul className={click ? 'nav-menu active' : 'nav-menu'}>
        <li>
          <NavLink to='/create' onClick={closeMenu}> Create </NavLink>
        </li>
       
        <li>
          <NavLink to='/drumkits' onClick={closeMenu}>DrumKit List</NavLink>
        </li>
        <li>
          <NavLink to='/beatCreator' onClick={closeMenu}>BeatCreator List</NavLink>
        </li>
        <li>
          <NavLink to='/combined' onClick={closeMenu}>Combined List</NavLink>
        </li>
        <li>
        <LogoutButton  className={click ? 'nav-menu active' : 'nav-menu'} onClick={handleLogout} />
       </li>
        <li>
          <LoginBtn className={click ? 'nav-menu active' : 'nav-menu'} onClick={handleLogin}/>
    </li>
      </ul>
    
          
        
       
      <div className='hamburger' onClick={handleClick}>
        {click ? <FaTimes /> : <FaBars />}
      </div>
    </div>
  )
}

export default Navbar
