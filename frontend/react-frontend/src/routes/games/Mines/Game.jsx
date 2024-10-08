import React from "react";
import { Grid } from "./Grid";
import { useState, useEffect } from "react";
import GameInput from "./GameInput";
import {
  minesCreateGameApiCall,
  minesClickTileGameApiCall,
  minesCashoutApiCall,
} from "../../../api";
import { useOutletContext } from "react-router-dom";
import Login from "../../../components/Login";

const Game = () => {
  const [gameData, setGameData] = useState(null);
  const [numberMines, setNumberMines] = useState(11);
  const [betAmount, setBetAmount] = useState(10);
  const [gameId, setGameId] = useState(null);
  const [gameInPlay, setGameInPlay] = useState(false);

  const [revealedTiles, setRevealedTiles] = useState([]);
  const [mineTiles, setMineTiles] = useState([]);

  const [alerts, setAlerts] = useState([]);

  const [inputButtonText, setInputButtonText] = useState("Clear Grid");
  const [balance, setBalance, authToken, setAuthToken, userName, setUserName] =
    useOutletContext();

  useEffect(() => {
    if (!authToken || !userName) {
      document.getElementById("loginModal").showModal();
    }
  }, [authToken, userName]);

  const resetGameBoard = async () => {
    //Used to reset the state of the game board
    setMineTiles([]);
    setRevealedTiles([]);
  };

  const cashout = async () => {
    // Refactor this snippet of code.

    try {
      const result = await minesCashoutApiCall(authToken, userName);
      if (result.success == true) {
        // Assuming you need to check if result indicates success
        setGameInPlay(false);
        resetGameBoard();
        setBalance(result.balance);
      } else {
        setGameInPlay(false);
        resetGameBoard();
        console.log("pass");
      }
    } catch (err) {
      console.log("Error cashing out:", err);
    }
  };

  const handlePlayGame = async (e) => {
    //Make a request and first chekc to see if a game is in play and use that to set state variable.
    try {
      const result = await minesCreateGameApiCall(
        authToken,
        userName,
        e.target.elements.betAmount.value,
        e.target.elements.numberMines.value
      );
      if (result.success == true) {
        setGameInPlay(true);
        setInputButtonText("Cash out!");
        setRevealedTiles(result.revealedTiles);
        setBalance(result.balance);
      }

      //Code below an be ignored/deleted
      if (!result.unableToCreateGame) {
        //No active game in play
        try {
          setGameData(result);
          setGameId(result.hashedGameNumber);
          setGameInPlay(true);
          setBalance(result.balance);
          setInputButtonText("Cash out!");
        } catch (err) {
          console.error("Error playing game:", err);
          setError("Failed to start game. Please try again.");
        }
      } else {
        try {
          const result = await getActiveGameInfo(authToken, userName);
          setRevealedTiles(result.revealedTiles);
          setGameId(result.hashedGameNumber);
          setGameInPlay(true);
        } catch (err) {
          console.log("pass" + err);
        }
      }
    } catch (err) {}
  };

  const handleTilePressed = async (tileNumber) => {
    try {
      const result = await minesClickTileGameApiCall(
        authToken,
        userName,
        tileNumber
      );
      if (result.success == true) {
        if (result.mine == true) {
          setMineTiles(result.mineLocations);
          setInputButtonText("Clear board!");
        } else {
          setRevealedTiles(result.revealedTiles);
        }
      }
      //Can delte /ignore
      if (result.unableToClickTile === "false") {
        if (result.mine === "true") {
          setMineTiles(result.mineLocations);
          setRevealedTiles(result.revealedTiles);
          const audio = new Audio(mineSound);
          audio.play();

          setInputButtonText("Clear board!");
          const newAlert = (
            <Alert message={<>Mine clicked!</>} alertType={"alert-error"} />
          );
          setAlerts([...alerts, newAlert]);
        } else {
          setRevealedTiles(result.revealedTiles);
          const audio = new Audio(diamondSound);
          audio.play();
        }
      } else {
        //Ignore the users click as the game is now over
      }
    } catch (err) {
      console.error("Error playing game:", err);
      setError("Failed to start game. Please try again.");
    }
  };
  return (
    <>
      {authToken && userName ? (
        <div>
          <div className="hero-content flex flex-col lg:flex-row-reverse lg:space-x-8 lg:space-x-reverse lg:space-y-8 lg:space-y-reverse">
            <div className="text-center lg:text-left">
              <Grid
                gameInPlay={gameInPlay}
                revealedTiles={revealedTiles}
                mineTiles={mineTiles}
                handleTilePressed={handleTilePressed}
              />
            </div>

            <GameInput
              handlePlayGame={handlePlayGame}
              numberMines={numberMines}
              betAmount={betAmount}
              gameInPlay={gameInPlay}
              cashout={cashout}
              inputButtonText={inputButtonText}
            />
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

export default Game;
