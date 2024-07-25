import React, { useState } from 'react';


const GameInput = ({handlePlayGame, numberMines, betAmount, gameInPlay, cashout, inputButtonText}) => {

  return (
    <div>
      <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
        <form className="card-body" onSubmit={(e) => { 
  e.preventDefault(); 
  !gameInPlay ? handlePlayGame(e) : ''; 
}}>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Number Of Mines</span>
            </label>
            <input
              type="number"
              name="numberMines"
              placeholder={numberMines}
              className="input input-bordered"
              disabled={gameInPlay} 
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">
                Bet Amount:
              </span>
            </label>
            <input
              type="number"
              name="betAmount"
              placeholder={betAmount}
              className="input input-bordered"
              disabled={gameInPlay} 
              required
            />
          </div>
          <div className="form-control mt-6">
            <button
              className="btn btn-primary"
              button type="submit"
              onClick={() => gameInPlay ? cashout() : ""}
            > 
            {gameInPlay ? inputButtonText : "Play!"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GameInput;