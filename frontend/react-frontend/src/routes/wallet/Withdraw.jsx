import React, { useState, useEffect } from "react";
import Login from "../../components/Login";
import { useOutletContext } from "react-router-dom";
import { getBalance } from "../../api";
import { withdrawAPICALL } from "../../api";

const Withdraw = () => {
  const [balance, setBalance, authToken, setAuthToken, userName, setUserName] =
    useOutletContext();

  const [withdrawAmount, setWithdrawAmount] = useState();
  const [withdrawPublicKey, setWithdrawPublicKey] = useState();

  useEffect(() => {
    if (!authToken || !userName) {
      document.getElementById("loginModal").showModal();
    }
  }, [authToken, userName]);

  const makeWithdrawRequest = async (e) => {
    try {
      console.log(withdrawAmount, withdrawPublicKey);
      const response = await withdrawAPICALL(
        authToken,
        userName,
        withdrawAmount,
        withdrawPublicKey
      );
      console.log(response);
      if (response.success == true) {
        setBalance(response.balance);
        //Add some kind of alert to notify the user
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      {authToken && userName ? (
        <div>
          <h1 className="text-5xl">Withdraw</h1>

          <div className="stats bg-primary text-primary-content">
            <div className="stat">
              <div className="stat-title">Available balance</div>
              <div className="stat-value">${balance}</div>
              <p>Enter SOL address:</p>
              <input
                type="text"
                placeholder="Enter address"
                className="input input-bordered w-full max-w-xs text-secondary"
                onChange={(e) => setWithdrawPublicKey(e.target.value)}
              />
              <p>Amount to withdraw($):</p>
              <input
                type="number"
                placeholder="$"
                className="w-full max-w-xs stat-value text-secondary"
                onChange={(e) => setWithdrawAmount(e.target.value)}
              />
              <br></br>
              <button className="btn btn-sm" onClick={makeWithdrawRequest}>
                Withdraw
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <dialog id="loginModal" className="modal">
            <div className="modal-box">
              <Login />
            </div>
          </dialog>
        </>
      )}
    </>
  );
};

export default Withdraw;
