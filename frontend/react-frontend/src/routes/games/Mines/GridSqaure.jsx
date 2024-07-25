import React from "react";
import { IoDiamondOutline } from "react-icons/io5";
import { GiMineExplosion } from "react-icons/gi";
const GridSquare = ({ tileNumber, gameInPlay, revealed, mine, handleTilePressed }) => {
  return (
    <button
      className={`btn btn-square btn-secondary h-24 w-24
     ${gameInPlay ? "btn-enabled" : "btn-disabled"}
     ${revealed ? "btn-accent cursor-not-allowed" : "btn-secondary"}
     ${mine ? "btn-error" : ""}
     `}
     onClick={() => handleTilePressed(tileNumber)}
    >
      <p className="text-3xl">
        {revealed ? <IoDiamondOutline /> : mine ? <GiMineExplosion /> : "?"}
      </p>
    </button>
  );
};

export default GridSquare;