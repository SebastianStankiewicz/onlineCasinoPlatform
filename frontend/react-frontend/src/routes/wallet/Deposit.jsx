import React from "react";

const Deposit = () => {
  return (
    <div>
      <h1 className="text-5xl">Deposit</h1>

      <div className="stats bg-primary text-primary-content">
        <div className="stat">
          <div className="stat-title">Current balance</div>
          <div className="stat-value">$579</div>
          <p>Deposit USDC to:</p>
          <p>0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d</p>
          <button className="btn btn-sm">Check for deposit</button>
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
  );
};

export default Deposit;