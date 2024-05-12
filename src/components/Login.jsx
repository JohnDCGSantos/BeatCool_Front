import { useState, } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import image from '../images/download.png'

//import { AuthContext } from '../context/Auth.context';
const Login = () => {
    const [email, setEmail]=useState('')

    const [password, SetPassword]=useState('')

    const [errorMessage, setErrorMessage]=useState(null)
    //const { user } = useContext(AuthContext);

const nav=useNavigate()


    /*const handleChange = (e) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    };*/
  
    const handleLogin = async (e) => {
      e.preventDefault();
      try {
        const response= await axios.post('http://localhost:5005/auth/login', {
            email, 
            password,
        })
        console.log('here is login response', response);
        localStorage.setItem('authToken', response.data.token)
        nav('/')   
      } catch (error) {
        console.log(error);
            setErrorMessage(error.response.data.errorMessage)
      }
    
      // Handle form submission
    };
    const handleGoToSignUp = () => {
        
        // Navigate to the DrumKitPage with the selected drum kit ID
        nav(`/signUp`) // Pass the drumKitId as a parameter in the URL
     
    }
  
    return (
      <div className='image'>
      <div className='create'>
        <div className="wrapper">
          <div className="logo">
            <img src={image} alt="" />
          </div>
          <div className="text-center mt-4 name">
            Beat It Up
          </div>
          <form className="p-3 mt-3" onSubmit={handleLogin}>
            <div className="form-field d-flex align-items-center">
              <span className="far fa-user"></span>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Email"
                required
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            <div className="form-field d-flex align-items-center">
              <span className="fas fa-key"></span>
              <input
                type="password"
                name="password"
                id="pwd"
                placeholder="Password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(event) => SetPassword(event.target.value)}
              />
            </div>
            <div className='centerBtn'>
              <button id='loginBtn' className="btn mt-3" type="submit">Login</button>
            </div> <div className="text-center fs-6">
          </div>
          </form>      
                 {errorMessage ? <p style={{ color: 'red' , textAlign:'center'}}>{errorMessage}</p> : null}

          < div style={{width:'100%', display:'flex', justifyContent:'center'}}  >      
           <button style={{textAlign:'center'}} id='signUpBtn' className="btn mt-3" onClick={handleGoToSignUp}>Go to SignUp</button>
</div>
          {/* Conditional rendering of error message */}
         
        </div>
      </div></div>
    );
  }    
  

export default Login;
