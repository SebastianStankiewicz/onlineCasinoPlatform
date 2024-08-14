import { FaWallet, FaBomb, FaArrowUp, FaDice } from "react-icons/fa";
import { PiHandWithdraw, PiHandDeposit } from "react-icons/pi";
import { CgGames } from "react-icons/cg";
import { GiBallPyramid } from "react-icons/gi";
import { Outlet, Link, useOutletContext } from "react-router-dom";
import { useState } from "react";

const Root = () => {
  const [balance, setBalance] = useState(0);
  const [authToken, setAuthToken] = useState("");
  const [userName, setUserName] = useState("");

  return (
    <>
      <div className="navbar bg-base-100">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl">
            <FaDice />
            Crypto Casino by Sebastian Stankiewicz
          </a>
        </div>
        <div className="flex-none">
          <button className="btn btn-square btn-ghost">
            <p>${balance}</p>
          </button>
        </div>
      </div>
      <div className="flex">
        <div>
          <div className="drawer lg:drawer-open">
            <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col items-center justify-center">
              {/* Page content here */}
              <label
                htmlFor="my-drawer-2"
                className="btn btn-primary drawer-button lg:hidden"
              >
                Open drawer
              </label>
            </div>
            <div className="drawer-side">
              <label
                htmlFor="my-drawer-2"
                aria-label="close sidebar"
                className="drawer-overlay"
              ></label>
              <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
                {/* Sidebar content here */}
                <li className="bold text-2xl">
                  <a>
                    Games <CgGames />
                  </a>
                </li>
                <li>
                  <Link to={`mines`}>
                    Mines <FaBomb />
                  </Link>
                </li>
                <li>
                  <Link to={`plinko`}>
                    Plinko <GiBallPyramid />
                  </Link>
                </li>
                <li>
                  <Link to={`upgrade`}>
                    Upgrade <FaArrowUp />
                  </Link>
                </li>

                <br></br>
                <br></br>

                <li className="bold text-2xl">
                  <a>
                    Wallet <FaWallet />
                  </a>
                </li>
                <li>
                  <Link to={`deposit`}>
                    Deposit <PiHandWithdraw />
                  </Link>
                </li>
                <li>
                  <Link to={`withdraw`}>
                    Withdraw <PiHandDeposit />
                  </Link>
                </li>

                <li>
                  <Link to={`gameHistory`}>
                    GameHistory
                  </Link>
                </li>


              </ul>
            </div>
          </div>
        </div>

        <div id="detail">
          <Outlet context={ [balance, setBalance, authToken, setAuthToken, userName, setUserName]} />
        </div>
      </div>
    </>
  );
};

export default Root;
