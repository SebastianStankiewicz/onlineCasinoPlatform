import React, { useState, useEffect } from "react";
import PlinkoGameBoard from "./PlinkoGameBoard";
import GameInputMenu from "./GameInputMenu";
import { plinkoApiCall } from "../../../api";
import { useOutletContext } from "react-router-dom";
import Login from "../../../components/Login";

const GamePlinko = () => {
  const [dropLocation, setDropLocation] = useState(null);
  const [betOutcome, setBetOutcome] = useState(null);
  const [balance, setBalance, authToken, setAuthToken, userName, setUserName] =
    useOutletContext();

  useEffect(() => {
      if (!authToken || !userName) {
        document.getElementById("loginModal").showModal();
      }
    }, [authToken, userName]);

  const placeBet = async (betAmount) => {
    try {
      console.log(betAmount);
      const result = await plinkoApiCall(
        authToken,
        userName,
        parseInt(betAmount)
      );
      if (result.success == true) {
        //Drop the ball witht the starting positon applied.
        setBetOutcome(result.betOutcome);
        setDropLocation(result.dropLocation);
        //Should now call the method in <PlinkoGameBoard /> to drop ball at this location
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {authToken && userName ? (
        <div className="min-h-screen flex justify-center items-center">
          <div className="flex flex-col md:flex-row items-start gap-x-4 p-4">
            <PlinkoGameBoard
              dropLocation={dropLocation}
              setDropLocation={setDropLocation}
              betOutcome={betOutcome}
            />
            <div className="flex-1 flex items-center">
              <GameInputMenu placeBet={placeBet} />
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

export default GamePlinko;
