import { useContext } from "react";
import { AuthContext } from "./Auth.context";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
function IsPrivate({children}) {
    const{isLoading,isLoggedIn}=useContext(AuthContext)
    const navigate=useNavigate()
    
      
    useEffect(() => {
      if (!isLoading && !isLoggedIn) {
        navigate("/login");
      }
    }, [isLoading, isLoggedIn, navigate]);
  
    if (isLoading) {
      return <p>Loading...</p>;
    }
    
      // ELse... return the child component.
      //Everything was ok
    
      return <div>{children}</div>;
    }

export default IsPrivate;