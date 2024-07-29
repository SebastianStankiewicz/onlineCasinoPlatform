const apiUrl = 'http://127.0.0.1:5000';



export const upgradeApiCall = async (authenticationToken, userName, betAmount, targetValue) => {
    const response = await fetch(apiUrl + '/playGame/upgrade/makeUpgrade', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ authenticationToken, userName, betAmount, targetValue })
    });
    return response.json();
  };


  export const plinkoApiCall = async (authenticationToken, userName, betAmount) => {
    const response = await fetch(apiUrl + '/playGame/plinko/dropBall', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ authenticationToken, userName, betAmount })
    });
    return response.json();
  };
