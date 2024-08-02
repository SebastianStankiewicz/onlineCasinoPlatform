import React, {useState, useEffect} from "react";
import { useOutletContext } from "react-router-dom";
import { userLogin } from "../api";

const Login = () => {
    const [password, setPassword] = useState(null);
    const [balance, setBalance, authToken, setAuthToken, userName, setUserName] = useOutletContext();


    const handleLogin = async (e) => {
      e.preventDefault();
  
      try{
        const result = await userLogin(userName, password);

        console.log(result)

        if (result.success == true){
            console.log(result)
            const authTokenFromAPI = result.authenticationToken;
            setAuthToken(authTokenFromAPI);
            setBalance(result.balance);
            setUserName(userName);
        } 

        
  
      } catch(err){
  
      }
      
    };

  return (
    <>
      <div>
        <div className="card bg-base-100 w-full max-w-sm shrink-0 ">
        <h1 className="text-3xl justify-center items-center">Login</h1>
          <form className="card-body" onSubmit={handleLogin}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Username</span>
              </label>
              <input
                type="username"
                className="input input-bordered"
                required
                value={userName}
                onChange={(e) => {e.preventDefault(); setUserName(e.target.value)}}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="Password"
                className="input input-bordered"
                required
                value={password}
                onChange={(e) =>  setPassword(e.target.value)}
              />
              <label className="label">
                <a href="#" className="label-text-alt link link-hover">
                  Register
                </a>
              </label>
            </div>
            <div className="form-control mt-6">
              <button className="btn btn-primary">Login</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
