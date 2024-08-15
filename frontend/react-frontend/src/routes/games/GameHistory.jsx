import React from "react";
import { useEffect, useState } from "react";

import { useOutletContext } from "react-router-dom";

import Login from "../../components/Login";
import {
  getClientSeedAndNonceFromGameIdAPI,
  getGameHistoryAPICALL,
  revealServerSeedAPI,
} from "../../api";

const GameHistory = () => {
  const [serverSeedRevealed, setServerSeedRevealed] = useState(false);
  const [balance, setBalance, authToken, setAuthToken, userName, setUserName] =
    useOutletContext();

  const [gameHistoryData, setGameHistoryData] = useState([]);
  const [amountWagerd, setAmountWagerd] = useState(0);
  const [totalGamesPlayed, setTotalGamesPlayed] = useState(0);

  //used for the modal - Just for displaying data.
  const [clientSeed, setClientSeed] = useState("");
  const [nonce, setNonce] = useState("");
  const [hashedGameSeed, setHashedGameSeed] = useState(null);
  const [serverSecretSeed, setServerSecretSeed] = useState("");

  const [selectedGameId, setSelectedGameId] = useState(null); //Remove need for this line

  useEffect(() => {
    const getGameHistory = async () => {
      if (authToken && userName) {
        try {
          const result = await getGameHistoryAPICALL(authToken, userName);
          console.log(result);
          if (result.success == true) {
            setGameHistoryData(result.data);
            setAmountWagerd(result.amountWagerd);
            setTotalGamesPlayed(result.gamesPlayed);
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

  const getClientSeedAndNonceFromGameId = async (gameId) => {
    try {
      const result = await getClientSeedAndNonceFromGameIdAPI(
        authToken,
        userName,
        gameId
      );

      console.log(result);

      if (result.success == true) {
        setClientSeed(result.clientSeed.toString());
        setNonce(result.nonce.toString());
        setHashedGameSeed(result.hashedGameSeed.toString());
        setSelectedGameId(gameId);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const revealServerSeed = async () => {
    try {
      const result = await revealServerSeedAPI(
        authToken,
        userName,
        selectedGameId
      );

      console.log(result);

      if (result.success == true) {
        setServerSecretSeed(result.serverSeed.toString());
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {authToken && userName ? (
        <>
          <div className="">
            <div className="stats shadow">
              <div className="stat place-items-center">
                <div className="stat-title">Games Played</div>
                <div className="stat-value">{totalGamesPlayed}</div>
              </div>

              <div className="stat place-items-center">
                <div className="stat-title">Wagerd</div>
                <div className="stat-value">$ {amountWagerd}</div>
              </div>

              <div className="stat place-items-center">
              <div className="stat-title">Balance</div>
              <div className="stat-value text-secondary">${balance}</div>
              </div>
            </div>
            <div className="overflow-x-auto max-w-full">
              <div className="max-h-64 overflow-y-auto">
                <table className="table table-md w-full">
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
                            onClick={() => (
                              getClientSeedAndNonceFromGameId(game.gameId),
                              document
                                .getElementById("provableFairModal")
                                .showModal()
                            )}
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
            <div>
              <dialog id="provableFairModal" className="modal">
                <div className="modal-box">
                  <form method="dialog">
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                      ✕
                    </button>
                  </form>

                  <div className="flex flex-col font-bold text-lg">
                    <p>Hashed Game Seed: </p>
                    <p className="textarea overflow-x-auto ">
                      {hashedGameSeed}
                    </p>
                    <p>Client Seed: </p>
                    <p className="textarea ">{clientSeed}</p>
                    <p>Nonce:</p>
                    <p className="textarea ">{nonce}</p>
                    <br></br>
                    <div>
                      {serverSeedRevealed ? (
                        <div className="flex flex-col font-bold text-lg">
                          <p>Server Seed</p>
                          <p className="textarea ">{serverSecretSeed}</p>
                        </div>
                      ) : (
                        <button
                          className="btn btn-primary"
                          onClick={() => (
                            revealServerSeed(), setServerSeedRevealed(true)
                          )}
                        >
                          Reveal Server Seed
                        </button>
                      )}
                      <p className="label-text-alt ">
                        The game seed is formed by concatenating the server
                        seed, client seed, and nonce. Revealing the server seed
                        will generate a new secret server seed.
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
