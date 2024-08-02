import React, { useEffect, useState } from "react";
import Login from "../../components/Login";
import { useOutletContext } from "react-router-dom";
import { getBalance, getDepositAddress, checkForDeposit } from "../../api";

const Deposit = () => {
  const [balance, setBalance, authToken, setAuthToken, userName, setUserName] =
    useOutletContext();

  const [escrowPublicKey, setEscrowPublicKey] = useState();
  const [depositAddress, setDepositAddress] = useState();

  useEffect(() => {
    const fetchDepositAddress = async () => {
      try {
        const response = await getDepositAddress(authToken, userName);
        if (response.success) {
          setDepositAddress(response.depositAddress);
        }
      } catch (e) {
        console.log(e);
      }
    };

    fetchDepositAddress();
  }, []);

  const checkForDepositFUNCTION = async () => {
    try {
      const response = await checkForDeposit(authToken, userName);
      if (response.success == true) {
        if (response.balance != balance) {
          setBalance(response.balance);
          //TODO add some kind of alert to notify the user that deposit been made
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      {authToken && userName ? (
        <div>
          <h1 className="text-5xl">Deposit</h1>

          <div className="stats bg-primary text-primary-content">
            <div className="stat">
              <div className="stat-title">Current balance</div>
              <div className="stat-value">${balance}</div>
              <p>Deposit USDC to:</p>
              <p>{depositAddress}</p>
              <button className="btn btn-sm" onClick={checkForDepositFUNCTION}>
                Check for deposit
              </button>
            </div>
          </div>

          <div>
            <p>Deposit History</p>
            <div className="overflow-x-auto">
              <table className="table">
                {/* head */}
                <thead>
                  <tr>
                    <th></th>
                    <th>Time</th>
                    <th>Transaction</th>
                    <th>Balance Change</th>
                  </tr>
                </thead>
                <tbody>
                  {/* row 1 */}
                  <tr>
                    <th>1</th>
                    <td>Cy Ganderton</td>
                    <td>Quality Control Specialist</td>
                    <td>Blue</td>
                  </tr>
                  {/* row 2 */}
                  <tr>
                    <th>2</th>
                    <td>Hart Hagerty</td>
                    <td>Desktop Support Technician</td>
                    <td>Purple</td>
                  </tr>
                  {/* row 3 */}
                  <tr>
                    <th>3</th>
                    <td>Brice Swyre</td>
                    <td>Tax Accountant</td>
                    <td>Red</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <Login />
      )}
    </>
  );
};

export default Deposit;
