import {  useState, } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import image from '../images/download.png'
import { apiBaseUrl } from '../config'

const Login = () => {
    const [email, setEmail]=useState('')
    const [password, SetPassword]=useState('')
    const [errorMessage, setErrorMessage]=useState(null)
    const nav=useNavigate()

    
    const handleLogin = async (e) => {
      e.preventDefault();
      try {
        const response= await axios.post(`${apiBaseUrl}/auth/login`, {
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
    };

   
    const handleGoToSignUp = () => {
        nav(`/signUp`) 
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
            </div> 
            <div className="text-center fs-6">
          </div>
          </form>    

            {errorMessage ? <p style={{ color: 'red' , textAlign:'center'}}>{errorMessage}</p> : null}

          <div style={{width:'100%', display:'flex', justifyContent:'center'}}  >      
           <button style={{textAlign:'center'}} id='signUpBtn' className="btn mt-3" onClick={handleGoToSignUp}>Go to SignUp</button>
          </div>

          <div style={{textAlign:'center',position:'relative', bottom:'-17%'}}>
  <div>
 <p style={{margin:'0', fontSize:'10px', color:'black'}}>Created by João Santos, 2024.</p>
 </div>
 <div>
  <p style={{margin:'0', fontSize:'10px', color:'black'}}>All rights reserved.</p>
  </div>
</div>
          
      </div>
      </div>
      </div>
    );
  }    
  

export default Login;
