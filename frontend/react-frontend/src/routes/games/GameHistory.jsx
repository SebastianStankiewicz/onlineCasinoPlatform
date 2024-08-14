import React from "react";
import { useEffect, useState } from "react";

import { useOutletContext } from "react-router-dom";

import Login from "../../components/Login";
import { getGameHistoryAPICALL } from "../../api";

const GameHistory = () => {
  const [serverSeedRevealed, setServerSeedRevealed] = useState(false);
  const [balance, setBalance, authToken, setAuthToken, userName, setUserName] =
    useOutletContext();

  const [gameHistoryData, setGameHistoryData] = useState([]);

  useEffect(() => {
    const getGameHistory = async () => {
      if (authToken && userName) {
        try {
          const result = await getGameHistoryAPICALL(authToken, userName);
          console.log(result);
          if (result.success == true) {
            setGameHistoryData(result.data);
          } else {
            console.log("Error fetching games table");
          }
        } catch (err) {
          console.log(err);
        }
      }
    };

    getGameHistory();
  }, []);

  useEffect(() => {
    if (!authToken || !userName) {
      document.getElementById("loginModal").showModal();
    }
  }, [authToken, userName]);

  return (
    <>
      {authToken && userName ? (
        <>
          <div className="">
            <div className="overflow-x-auto max-w-full">
              <div className="max-h-64 overflow-y-auto">
                <table className="table table-xs w-full">
                  <thead className="sticky top-0">
                    <tr>
                      <th>Game ID</th>
                      <th>Game Name</th>
                      <th>Bet Amount</th>
                      <th>Payout</th>
                      <th>Provable Fairness</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gameHistoryData.map((game, index) => (
                      <tr key={index}>
                        <td>{game.gameId}</td>
                        <td>{game.gameName}</td>
                        <td>{game.betAmount}</td>
                        <td>{game.payout}</td>
                        <td>
                          <button
                            className="btn"
                            onClick={() =>
                              document
                                .getElementById("provableFairModal")
                                .showModal()
                            }
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="stats shadow">
              <div className="stat place-items-center">
                <div className="stat-title">Games Played</div>
                <div className="stat-value">867</div>
              </div>

              <div className="stat place-items-center">
                <div className="stat-title">Wagerd</div>
                <div className="stat-value">$1,200</div>
              </div>
            </div>

            <div>
              <dialog id="provableFairModal" className="modal">
                <div className="modal-box">
                  <form method="dialog">
                    {/* if there is a button in form, it will close the modal */}
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                      ✕
                    </button>
                  </form>

                  <div className="flex flex-col font-bold text-lg">
                    <p>Hashed Game Seed: </p>
                    <textarea className="textarea " disabled>
                      a16eabdbd19bbeebda77cdc6117f504ffb09e430b7a6eff68a68115d5c02a9ec8714abbfbc8a78cd89514e55c17eee18053a4561831956182fa6e5b5685a918d
                    </textarea>
                    <p>Client Seed: </p>
                    <textarea className="textarea " disabled>
                      f9c6c247dd4be4c121e59923b250d6
                    </textarea>
                    <p>Nonce:</p>
                    <textarea className="textarea " disabled>
                      995
                    </textarea>
                    <br></br>
                    <div>
                      {serverSeedRevealed ? (
                        <div className="flex flex-col font-bold text-lg">
                          <p>Server Seed</p>
                          <textarea className="textarea " disabled>
                            1d22253c22eb97a5abcdaeaa552922
                          </textarea>
                        </div>
                      ) : (
                        <button
                          className="btn btn-primary"
                          onClick={() => setServerSeedRevealed(true)}
                        >
                          Reveal Server Seed (Will generate a new secret Server
                          Seed)
                        </button>
                      )}
                      <p className="text-sm font-light">
                        Game seed formed from concatenating the server seed,
                        client seed and nonce.
                      </p>
                    </div>
                  </div>
                </div>
              </dialog>
            </div>
          </div>
        </>
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

export default GameHistory;
