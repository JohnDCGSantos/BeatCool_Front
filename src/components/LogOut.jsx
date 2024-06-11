import { useContext } from 'react'
import { AuthContext } from '../context/Auth.context'

const LogoutButton = ({onClick}) => {
 const { isLoggedIn}=useContext(AuthContext)

  return isLoggedIn ? (
    <button className='logOutBtn' onClick={onClick}>Logout</button>
  ):null;
};

export default LogoutButton;
