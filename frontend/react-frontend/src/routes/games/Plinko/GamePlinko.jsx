import React from 'react'
import PlinkoGameBoard from './PlinkoGameBoard';
import GameInputMenu from './GameInputMenu';

const GamePlinko = () => {
    return (
        <>
    
          <div className="min-h-screen flex justify-center items-center">
            <div className="flex flex-col md:flex-row items-start gap-x-4 p-4">
              <PlinkoGameBoard />
              <div className="flex-1 flex items-center">
                <GameInputMenu />
              </div>
            </div>
          </div>
        </>
      );
}

export default GamePlinko