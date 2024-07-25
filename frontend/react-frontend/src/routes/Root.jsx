import { FaWallet, FaBomb, FaArrowUp, FaDice } from "react-icons/fa";
import { PiHandWithdraw, PiHandDeposit } from "react-icons/pi";
import { CgGames } from "react-icons/cg";
import { GiBallPyramid } from "react-icons/gi";
import { Outlet, Link } from "react-router-dom";

const Root = () => {
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
            <p>$100</p>
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
                  <br></br>
                  <br></br>
                  <div className="chat chat-start">
                    <div className="chat-image avatar">
                      <div className="w-10 rounded-full">
                        <img
                          alt="Tailwind CSS chat bubble component"
                          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTH6QVkrZDXhEwmlhhb-YaI6clS8QK23Wzb6Q&s"
                        />
                      </div>
                    </div>
                    <div className="chat-bubble">Yo im a placeholder</div>
                  </div>
                  <div className="chat chat-start">
                    <div className="chat-image avatar">
                      <div className="w-10 rounded-full">
                        <img
                          alt="Tailwind CSS chat bubble component"
                          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTH6QVkrZDXhEwmlhhb-YaI6clS8QK23Wzb6Q&s"
                        />
                      </div>
                    </div>
                    <div className="chat-bubble">Im rich!!!!</div>
                  </div>
                  <div className="chat chat-start">
                    <div className="chat-image avatar">
                      <div className="w-10 rounded-full">
                        <img
                          alt="Tailwind CSS chat bubble component"
                          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTH6QVkrZDXhEwmlhhb-YaI6clS8QK23Wzb6Q&s"
                        />
                      </div>
                    </div>
                    <div className="chat-bubble">
                      Testing testing blah blah blah
                    </div>
                  </div>
                  <input
                    type="text"
                    placeholder="Message"
                    className="input input-bordered w-full max-w-xs"
                  />
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div id="detail">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Root;
