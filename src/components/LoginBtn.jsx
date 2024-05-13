import { useContext } from 'react'
import { AuthContext } from '../context/Auth.context'
function LoginBtn({onClick}) {
const { isLoggedIn, }=useContext(AuthContext)

  

  return !isLoggedIn ? (
  
    <button className='logOutBtn' onClick={onClick} >Login</button>
  ):null;
}


export default LoginBtn;