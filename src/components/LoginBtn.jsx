import { useNavigate } from 'react-router-dom';
import { useContext, useEffect } from 'react'
import { AuthContext } from '../context/Auth.context'
function LoginBtn({onClick}) {
const { isLoggedIn, }=useContext(AuthContext)

  

  return !isLoggedIn ? (
  
    <button className='logOutBtn' onClick={onClick} >Login</button>
  ):null;
}


export default LoginBtn;