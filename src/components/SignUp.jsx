import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
function SignUp() {
    /*const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
      });*/
      const [email, setEmail]=useState('')
      const [userName, setUserName]=useState('')

      const [password, SetPassword]=useState('')
const nav=useNavigate()
    
      
      const handleGoToLogin = () => {
        
          // Navigate to the DrumKitPage with the selected drum kit ID
          nav(`/login`) // Pass the drumKitId as a parameter in the URL
       
      }
      const handleSignUp = async (event) => {
        event.preventDefault();
        // Handle form submission
        try {
            const response= await axios.post('http://localhost:5005/auth/signup',{email, password, userName})
console.log('here is your signup response',response)
        } catch (error) {
            console.log(error)
        }
      };
    
      return (
        <div className="wrapper">
          <div className="logo">
            <img src="/images/2695.png" alt="" />
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
            <button className="btn mt-3" type="submit">Signup</button>
          </form>
          {/* Conditional rendering of error message */}
         
          <div className="text-center fs-6">
            <button   onClick={handleGoToLogin}   >Go to Login</button>
          </div>
        </div>
      );
      }
    export default SignUp