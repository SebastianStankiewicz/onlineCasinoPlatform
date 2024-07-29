import React, {useState} from 'react'
import PlinkoGameBoard from './PlinkoGameBoard';
import GameInputMenu from './GameInputMenu';
import { plinkoApiCall } from '../../../api';

const GamePlinko = () => {
    const [dropLocation, setDropLocation] = useState(null);
    const [betOutcome, setBetOutcome] = useState(null);

    const placeBet = async () => {
      try{
        const result = await plinkoApiCall("e6df528e1bc098aca0dd4a49471296", "test18", 10);
        if (result.success == true){
          //Drop the ball witht the starting positon applied.
          setBetOutcome(result.betOutcome)
          setDropLocation(result.dropLocation)
          //Should now call the method in <PlinkoGameBoard /> to drop ball at this location
        }
      } catch(err){
        console.log(err)
      }
    }

    return (
        <>    
          <div className="min-h-screen flex justify-center items-center">
            <div className="flex flex-col md:flex-row items-start gap-x-4 p-4">
              <PlinkoGameBoard
              dropLocation = {dropLocation}
              setDropLocation= {setDropLocation}
              betOutcome={betOutcome} />
              <div className="flex-1 flex items-center">
                <GameInputMenu
                placeBet= {placeBet} />
              </div>
            </div>
          </div>
        </>
      );
}

export default GamePlinko