import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaArrowDown, FaArrowRight } from "react-icons/fa";
import { upgradeApiCall } from "../../api";
import { useOutletContext } from "react-router-dom";

import Login from "../../components/Login";

function Upgrade() {
  const [winPercentage, setWinPercentage] = useState(0); // Example win percentage (could be state or props)
  const [rotationAngle, setRotationAngle] = useState(0); // State to hold rotation angle
  const [payout, setPayout] = useState(0);

  const [wager, setWager] = useState(10);
  const [target, setTarget] = useState(30);

  const [wheelColor, setWheelColor] = useState("text-secondary");
  const [arrowYMovement, setArrowyMovement] = useState(20);

  const [balance, setBalance, authToken, setAuthToken, userName, setUserName] =
    useOutletContext();

  useEffect(() => {
    const wagerValue = parseFloat(wager);
    const targetValue = parseFloat(target);
    if (!isNaN(wagerValue) && !isNaN(targetValue)) {
      var odds = wagerValue / targetValue;

      setWinPercentage((odds * 100).toFixed(2));
    } else {
      setPayout(0);
    }
  }, [wager, target]);

  const handleWagerChange = (e) => {
    setWager(e.target.value);
  };

  const handleTargetChange = (e) => {
    setTarget(e.target.value);
  };

  const spinWheel = async () => {
    try {
      const result = await upgradeApiCall(
        authToken,
        userName,
        Number(wager),
        Number(target)
      );
      if (result.success == true) {
        setArrowyMovement(20);
        if (result.gameOutCome == "won") {
          setRotationAngle(result.rotationAngle);
          setWheelColor("text-success");
        } else {
          setRotationAngle(result.rotationAngle);
          setWheelColor("text-error");
        }
        setBalance(result.balance)
      }
    } catch (err) {
      console.log(err);
    }
  };

  const resetWheel = () => {
    console.log("Resetting wheel...");
    setRotationAngle(0);
    setWheelColor("text-secondary");
    setArrowyMovement(-20);
    // Other logic to reset or reinitialize wheel state
  };

  return (
    <>
      {authToken && userName ? (
        <div>
          <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="stats bg-primary text-primary-content p-4 rounded-lg shadow-lg">
                <div className="stat">
                  <div className="flex flex-row gap-2 text-secondary ">
                    <input
                      type="number"
                      placeholder=""
                      className="w-28 stat-value"
                      value={wager}
                      onChange={handleWagerChange}
                    />
                    <svg
                      className="text-5xl text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      width="1em"
                      height="1em"
                      viewBox="0 0 32 32"
                    >
                      <path
                        fill="currentColor"
                        d="M16 0c8.837 0 16 7.163 16 16s-7.163 16-16 16S0 24.837 0 16S7.163 0 16 0m3.352 5.56c-.244-.12-.488 0-.548.243c-.061.061-.061.122-.061.243v.85l.01.104a.86.86 0 0 0 .355.503c4.754 1.7 7.192 6.98 5.424 11.653c-.914 2.55-2.925 4.491-5.424 5.402c-.244.121-.365.303-.365.607v.85l.005.088a.45.45 0 0 0 .36.397c.061 0 .183 0 .244-.06a10.895 10.895 0 0 0 7.13-13.717c-1.096-3.46-3.778-6.07-7.13-7.162zm-6.46-.06c-.061 0-.183 0-.244.06a10.895 10.895 0 0 0-7.13 13.717c1.096 3.4 3.717 6.01 7.13 7.102c.244.121.488 0 .548-.243c.061-.06.061-.122.061-.243v-.85l-.01-.08c-.042-.169-.199-.362-.355-.466c-4.754-1.7-7.192-6.98-5.424-11.653c.914-2.55 2.925-4.491 5.424-5.402c.244-.121.365-.303.365-.607v-.85l-.005-.088a.45.45 0 0 0-.36-.397m3.535 3.156h-.915l-.088.008c-.2.04-.346.212-.4.478v1.396l-.207.032c-1.708.304-2.778 1.483-2.778 2.942c0 2.002 1.218 2.791 3.778 3.095c1.707.303 2.255.668 2.255 1.639c0 .97-.853 1.638-2.011 1.638c-1.585 0-2.133-.667-2.316-1.578c-.06-.242-.244-.364-.427-.364h-1.036l-.079.007a.413.413 0 0 0-.347.418v.06l.033.18c.29 1.424 1.266 2.443 3.197 2.734v1.457l.008.088c.04.198.213.344.48.397h.914l.088-.008c.2-.04.346-.212.4-.477V21.34l.207-.04c1.713-.362 2.84-1.601 2.84-3.177c0-2.124-1.28-2.852-3.84-3.156c-1.829-.243-2.194-.728-2.194-1.578c0-.85.61-1.396 1.828-1.396c1.097 0 1.707.364 2.011 1.275a.458.458 0 0 0 .427.303h.975l.079-.006a.413.413 0 0 0 .348-.419v-.06l-.037-.173a3.04 3.04 0 0 0-2.706-2.316V9.142l-.008-.088c-.04-.199-.213-.345-.48-.398z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center ">
                <div className="mb-4 text-3xl text-secondary">
                  <motion.div
                    animate={{
                      y: arrowYMovement,
                    }}
                  >
                    <FaArrowDown />
                  </motion.div>
                </div>
                <motion.div
                  className={`radial-progress ${wheelColor}`}
                  style={{
                    "--value": `${winPercentage}`,
                    "--size": "12rem",
                    "--thickness": "0.5rem",
                    transform: `rotate(${rotationAngle}deg)`,
                  }}
                  role="progressbar"
                  animate={{ rotate: rotationAngle }}
                  transition={{
                    duration: 1,
                    type: "spring",
                    stiffness: 100,
                    damping: 10,
                  }}
                  onAnimationComplete={resetWheel}
                >
                  {winPercentage}%
                </motion.div>
              </div>

              <div className="stats bg-primary text-primary-content p-4 rounded-lg shadow-lg">
                <div className="stat">
                  <div className="flex flex-row gap-2 text-secondary ">
                    <input
                      type="number"
                      placeholder="Target"
                      className="w-28 stat-value"
                      value={target}
                      onChange={handleTargetChange}
                    />

                    <svg
                      className="text-5xl text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      width="1em"
                      height="1em"
                      viewBox="0 0 32 32"
                    >
                      <path
                        fill="currentColor"
                        d="M16 0c8.837 0 16 7.163 16 16s-7.163 16-16 16S0 24.837 0 16S7.163 0 16 0m3.352 5.56c-.244-.12-.488 0-.548.243c-.061.061-.061.122-.061.243v.85l.01.104a.86.86 0 0 0 .355.503c4.754 1.7 7.192 6.98 5.424 11.653c-.914 2.55-2.925 4.491-5.424 5.402c-.244.121-.365.303-.365.607v.85l.005.088a.45.45 0 0 0 .36.397c.061 0 .183 0 .244-.06a10.895 10.895 0 0 0 7.13-13.717c-1.096-3.46-3.778-6.07-7.13-7.162zm-6.46-.06c-.061 0-.183 0-.244.06a10.895 10.895 0 0 0-7.13 13.717c1.096 3.4 3.717 6.01 7.13 7.102c.244.121.488 0 .548-.243c.061-.06.061-.122.061-.243v-.85l-.01-.08c-.042-.169-.199-.362-.355-.466c-4.754-1.7-7.192-6.98-5.424-11.653c.914-2.55 2.925-4.491 5.424-5.402c.244-.121.365-.303.365-.607v-.85l-.005-.088a.45.45 0 0 0-.36-.397m3.535 3.156h-.915l-.088.008c-.2.04-.346.212-.4.478v1.396l-.207.032c-1.708.304-2.778 1.483-2.778 2.942c0 2.002 1.218 2.791 3.778 3.095c1.707.303 2.255.668 2.255 1.639c0 .97-.853 1.638-2.011 1.638c-1.585 0-2.133-.667-2.316-1.578c-.06-.242-.244-.364-.427-.364h-1.036l-.079.007a.413.413 0 0 0-.347.418v.06l.033.18c.29 1.424 1.266 2.443 3.197 2.734v1.457l.008.088c.04.198.213.344.48.397h.914l.088-.008c.2-.04.346-.212.4-.477V21.34l.207-.04c1.713-.362 2.84-1.601 2.84-3.177c0-2.124-1.28-2.852-3.84-3.156c-1.829-.243-2.194-.728-2.194-1.578c0-.85.61-1.396 1.828-1.396c1.097 0 1.707.364 2.011 1.275a.458.458 0 0 0 .427.303h.975l.079-.006a.413.413 0 0 0 .348-.419v-.06l-.037-.173a3.04 3.04 0 0 0-2.706-2.316V9.142l-.008-.088c-.04-.199-.213-.345-.48-.398z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <button className="btn btn-accent mt-8" onClick={spinWheel}>
              Upgrade
            </button>
          </div>
        </div>
      ) : (
        <div>
          <Login />
        </div>
      )}
    </>
  );
}

export default Upgrade;
