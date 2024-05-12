import { createContext, useState,useEffect } from "react";
import axios from "axios";
const AuthContext= createContext()

const AuthContextWrapper=({children})=> {
    const [user, setUser]=useState(null)
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const authenticateUser=async()=>{
        const tokenInStorage=localStorage.getItem('authToken')
        console.log('here is your token from local storage', tokenInStorage)
        if(tokenInStorage){
            try {
            const {data}= await axios.get('http://localhost:5005/auth/verify',{
                headers:{authorization:`Bearer ${tokenInStorage}`}
            })
            console.log('here is the data from the token in storage', data)
            setUser(data.currentUser)
            setIsLoading(false);
        setIsLoggedIn(true);
    } catch (err) {
        console.log("error on the authenticate user function", err);
        setUser(null);
        setIsLoading(false);
        setIsLoggedIn(false);
      }
        }else{
 //we will set the user back null, set isLoading to false, set isLoggedIn to false
 setUser(null);
 setIsLoggedIn(false);
 setIsLoading(false);


   
      }
    }
    const logout = () => {
      // Clear JWT token from localStorage
      localStorage.removeItem('authToken');
      // Update isLoggedIn state to false
      setIsLoggedIn(false);
     
    };
    useEffect(() => {
        authenticateUser();
      }, []);
    

    return <AuthContext.Provider value={{authenticateUser, user, setUser, isLoading, isLoggedIn, setIsLoggedIn, logout}}>{children}</AuthContext.Provider>;
}

export  {AuthContextWrapper, AuthContext}