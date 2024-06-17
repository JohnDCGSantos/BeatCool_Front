import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import image from '../images/download.png'
import { apiBaseUrl } from '../config'

function SignUp() {
      const [email, setEmail]=useState('')
      const [userName, setUserName]=useState('')
      const [errorMessage, setErrorMessage]=useState(null)
      const [password, SetPassword]=useState('')
      const nav=useNavigate()
    
      
      const handleGoToLogin = () => {
          nav(`/login`)  
      }

      const handleSignUp = async (event) => {
        event.preventDefault(); console.log(apiBaseUrl)
        try {       
            const response= await axios.post(`${apiBaseUrl}/auth/signup`,{email, password, userName})
console.log('here is your signup response',response)
        } catch (error) {
            console.log(error)
            setErrorMessage(error.response.data.errorMessage)
        }
      };
    
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

          <form className="p-3 mt-3" onSubmit={handleSignUp}>
            <div className="form-field d-flex align-items-center">
              <span className="far fa-user"></span>
              <input
                type="text"
                id="userName"
                placeholder="Username"
                required
                value={userName}
                onChange={(event)=>{setUserName(event.target.value)}}
              />
            </div>
            <div className="form-field d-flex align-items-center">
              <span className="far fa-user"></span>
              <input
                type="email"
                id="email"
                placeholder="Email"
                required
                value={email}
                onChange={(event)=>{setEmail(event.target.value)}}
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
                onChange={(event)=>{SetPassword(event.target.value)}}
              />
            </div>
            <div className='centerBtn'>
            <button id='loginBtn' className="btn mt-3" type="submit">Signup</button></div>
           <div className="text-center fs-6">
          </div>
          </form>
          {errorMessage ? <p style={{ color: 'red' , textAlign:'center'}}>{errorMessage}</p> : null}

          < div style={{width:'100%', display:'flex', justifyContent:'center'}}  >      

                     <button id='signUpBtn' className="btn mt-3" onClick={handleGoToLogin}   >Go to Login</button>

                     </div>
                     <div style={{textAlign:'center',position:'relative', bottom:'-5%'}}>
  <div>
 <p style={{margin:'0', fontSize:'10px', color:'black'}}>Created by João Santos, 2024.</p>
 </div>
 <div>
  <p style={{margin:'0', fontSize:'10px', color:'black'}}>All rights reserved.</p>
  </div>
</div>
        </div>
        </div></div> );
      }
    export default SignUp