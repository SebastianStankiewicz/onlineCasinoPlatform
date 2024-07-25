import React from "react";
import { Grid } from "./Grid";
import { useState } from "react";
import GameInput from "./GameInput";

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
    const cashout = async () => {
        // Make a request to server to cash out and then reload the page
        try {
          const result = await cashoutCall(authToken, userName, gameId);
          if (result.cashedOut == "true") {
            // Assuming you need to check if result indicates success
            setGameInPlay(false);
            resetGameBoard();
            setUserBalance(result.balance);
            const newAlert = (
              <Alert
                message={
                  <>
                    Cashed Out: <strong>{result.winnings}</strong> with{" "}
                    <strong>{result.multiplier}x</strong> multiplier
                  </>
                }
                alertType={"alert-success"}
              />
            );
            setAlerts([...alerts, newAlert]);
          } else {
            setGameInPlay(false);
            resetGameBoard();
            
            if(!inputButtonText == "Clear board!"){const newAlert = (
              <Alert
                message={`Cannot cash out right now! `}
                alertType={"alert-error"}
              />
            );
    
            setAlerts([...alerts, newAlert]);}
            
      
            
    
    
    
          }
        } catch (err) {
          console.log("Error cashing out:", err);
        }
      };

    const handlePlayGame = async (e) => {
        //Make a request and first chekc to see if a game is in play and use that to set state variable.
        try {
          const result = await playGame(
            authToken,
            userName,
            e.target.elements.betAmount.value,
            e.target.elements.numberMines.value
          );
    
          if (!result.unableToCreateGame) {
            //No active game in play
            try {
              setGameData(result);
              setGameId(result.hashedGameNumber);
              setGameInPlay(true);
              setUserBalance(result.userBalance);
              setInputButtonText("Cash out!")
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
          const result = await tileClicked(authToken, userName, gameId, tileNumber);
    
          if (result.unableToClickTile === "false") {
            if (result.mine === "true") {
              setMineTiles(result.mineLocations);
              setRevealedTiles(result.revealedTiles);
              const audio = new Audio(mineSound);
              audio.play();
    
              setInputButtonText("Clear board!")
              const newAlert = (
                <Alert
                  message={
                    <>
                      Mine clicked!
                    </>
                  }
                  alertType={"alert-error"}
                />
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
    </>
  );
};

export default Game;
