import React from "react";
import Login from "../../components/Login";
import { useOutletContext } from "react-router-dom";

const Withdraw = () => {

  const [balance, setBalance, authToken, setAuthToken, userName, setUserName] =
  useOutletContext();

  return (
    <>
    {authToken && userName ? (    <div>
      <h1 className="text-5xl">Withdraw</h1>

      <div className="stats bg-primary text-primary-content">
        <div className="stat">
          <div className="stat-title">Available balance</div>
          <div className="stat-value">${balance}</div>
          <p>Enter USDC address:</p>
          <input
            type="text"
            placeholder="Enter address"
            className="input input-bordered w-full max-w-xs text-secondary"
          />
          <p>Amount to withdraw:</p>
          <input
            type="number"
            placeholder=""
            className="w-28 stat-value text-secondary"
          />
          <button className="btn btn-sm">Withdraw</button>
        </div>
      </div>

      <div>
        <p>Withdraw History</p>
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
    </div>) : (
      <Login/>
    )}

    </>
  );
};

export default Withdraw;
