import React, {useState, useEffect} from "react";
import { useOutletContext } from "react-router-dom";
import { createUser, userLogin } from "../api";

const Login = () => {
    const [password, setPassword] = useState(null);
    const [balance, setBalance, authToken, setAuthToken, userName, setUserName] = useOutletContext();

    //Either being login or register
    const [isLogin, setIsLogin] = useState(true);

    const handleLogin = async (e) => {
      e.preventDefault();
  
      try{
        const result = isLogin
        ? await userLogin(userName, password)
        : await createUser(userName, password);

        console.log(result)

        if (result.success == true){
            console.log(result)
            const authTokenFromAPI = result.authenticationToken;
            setAuthToken(authTokenFromAPI);
            setBalance(result.balance);
            setUserName(userName);
        } 
      } catch(err){
        console.log(err);
      }
      
    };

  return (
    <>
      <div>
        <div className="card bg-base-100 w-full max-w-sm shrink-0 ">
        <h1 className="text-3xl justify-center items-center flex ">{isLogin ? "Login" : "Register"}</h1>
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
                <p className="label-text-alt link link-hover" onClick={() => {setIsLogin(!isLogin)}}>
                {isLogin ? "New? Register" : "Already have an account? Login"}
                </p>
              </label>
            </div>
            <div className="form-control mt-6">
              <button className="btn btn-primary">{isLogin ? "Login" : "Register"}</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
