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


  export const minesCreateGameApiCall = async (authenticationToken, userName, betAmount, numberOfMines) => {
    const response = await fetch(apiUrl + '/playGame/mines/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ authenticationToken, userName, betAmount, numberOfMines })
    });
    return response.json();
  };

  export const minesClickTileGameApiCall = async (authenticationToken, userName, tileLocation) => {
    const response = await fetch(apiUrl + '/playGame/mines/clickTile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ authenticationToken, userName, tileLocation })
    });
    return response.json();
  };

  export const minesCashoutApiCall = async (authenticationToken, userName) => {
    const response = await fetch(apiUrl + '/playGame/mines/cashout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ authenticationToken, userName })
    });
    return response.json();
  };

  export const userLogin = async (userName, password) => {
    const response = await fetch(apiUrl + '/user/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userName, password })
    });
    return response.json();
  };


  export const getBalance = async (authenticationToken, userName) => {
    const response = await fetch(apiUrl + '/user/wallet/getBalance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ authenticationToken, userName })
    });
    return response.json();
  };

  export const getGameHistoryAPICALL = async (authenticationToken, userName) => {
    const response = await fetch(apiUrl + '/user/getGameHistory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ authenticationToken, userName })
    });
    return response.json();
  };

  export const withdrawAPICALL = async (authenticationToken, userName, withdrawAmount, withdrawPublicKey) => {
    const response = await fetch(apiUrl + '/user/wallet/withdraw', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ authenticationToken, userName, withdrawAmount, withdrawPublicKey })
    });
    return response.json();
  };

  export const getDepositAddress = async (authenticationToken, userName) => {
    const response = await fetch(apiUrl + '/user/wallet/getDepositAddress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ authenticationToken, userName })
    });
    return response.json();
  };

  export const checkForDeposit = async (authenticationToken, userName) => {
    const response = await fetch(apiUrl + '/user/wallet/checkForDeposit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ authenticationToken, userName })
    });
    return response.json();
  };