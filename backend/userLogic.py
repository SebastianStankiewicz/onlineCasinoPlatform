import sqlite3
import os
import requests
import json

from solathon import Client, PublicKey, Transaction, Keypair
from solathon.core.instructions import transfer

DATABASE = "/Users/sebastianstankiewicz/portfolioOnMac/projects/casinoGames/completeCasino/backend/database/developmentDataBase.db"


#TODO move to env file and create a config file - Using keypair from seperate wallet. Swithc to a token rather than solana tokens.
HOUSEPUBLICWALLET = '41soa6GNXQ3kWSBKVZoZukPGHUvq7bocc7hx7BYVs6xd'
HOUSEPRIVATEWALLET = [168,126,62,125,200,37,57,36,124,119,246,127,109,120,68,48,105,142,228,143,174,93,101,151,233,226,78,177,209,249,106,79,44,204,128,252,24,35,255,198,122,133,143,175,243,193,234,174,162,74,77,109,60,65,130,65,110,50,25,138,144,80,122,190]



#Tx of token https://solscan.io/token/CtGgdsWu2ywJLDVcxTt2U5nCRDKnR4jyMMWF91ShTBV3?cluster=devnet


client = Client("https://api.devnet.solana.com")
TOKENADDRESS = "CtGgdsWu2ywJLDVcxTt2U5nCRDKnR4jyMMWF91ShTBV3" #Not in use
lampartsPerSol = 1000000000

def getDataBase():
    db = sqlite3.connect(DATABASE)
    db.row_factory = sqlite3.Row  # Return rows as dictionaries
    return db


#Dont require passing arguments as a new user needs to be accounted for
class User:
    def __init__(self):
        self.userName = None
        self.password = None
        self.userId = None
        self.authenticationToken = None
        self.clientSeed = None
        self.nonce = None
        self.serverSeed = None

    """Both create user and login return a authentication token"""
    def createUser(self, userName: str, password: str) -> bool:
        db = getDataBase()
        cursor = db.cursor()
        cursor.execute('SELECT userId FROM users WHERE username = ?', (userName,))
        existingUser = cursor.fetchone()

        if existingUser is not None:
            return False
        
        self.authenticationToken = generateToken(15)
        self.userId = generateToken(10)
        self.clientSeed = generateToken(15)
        self.serverSeed = generateToken(15)
        self.nonce = 0
        self.userName = userName
        self.password = password

        cursor.execute('INSERT INTO users (username, hashedPassword, clientSeed, serverSeed, nonce, authenticationToken, userId) VALUES (?, ?, ?, ?, ?, ?, ?)',
                       (self.userName, self.password, self.clientSeed, self.serverSeed, self.nonce, self.authenticationToken, self.userId))
        db.commit()
        db.close()
        return True
        """
        1. Check to see if username doesnt already exist
        2. If unique username add user to db
        3. Generate and return a auth token back to user
        """
        

    def login(self, userName: str, password: str) -> str:
        db = getDataBase()
        cursor = db.cursor()
        cursor.execute('SELECT userId FROM users WHERE username = ? AND hashedPassword = ?', (userName, password))
        user = cursor.fetchone()

        if user is None:
            return False
        
        self.authenticationToken = generateToken(15)
        self.userId = user["userId"]

        cursor.execute('UPDATE users SET authenticationToken = ? WHERE userId = ?', (self.authenticationToken, user["userId"]))
        db.commit()
        db.close()
        return True
        """
        1. Compare to db
        2. If valid pair then generate and return auth token
        """

    def authenticateUser(self, userName: str, authenticationToken: str) -> str:
        db = getDataBase()
        cursor = db.cursor()
        cursor.execute('SELECT userId FROM users WHERE username = ? AND authenticationToken = ?', (userName, authenticationToken))
        user = cursor.fetchone()

        if user is None:
            return False
        else:
            self.userName = userName
            self.authenticationToken = authenticationToken
            self.userId = user["userId"]
            return True
        
    def updateUserObjectWithSeedInputs(self) -> bool:
        """This is called for example in drop ball method
        Used to populate the user object with data.
        -Assumes that user already authenticated/ authenticationUser called previousley
        -WONT work for mines as the values may have changed. (User can start game come of page and reload but have played plinko inbetween and hence nonce or either seed changed)
        """
        db = getDataBase()
        cursor = db.cursor()
        cursor.execute('SELECT * FROM users WHERE username = ? AND authenticationToken = ?', (self.userName, self.authenticationToken))
        user = cursor.fetchone()

        if user is None:
            return False
        else:
            self.userId = user["userId"]
            self.serverSeed = user["serverSeed"]
            self.clientSeed = user["clientSeed"]
            self.nonce = user["nonce"]
            return True
        
    def setNonceAndSeedForIncompleteMinesGame(self) -> bool:
            db = getDataBase()
            cursor = db.cursor()

            #cursor.execute('SELECT * FROM mines JOIN games ON mines.uniqueGameId = games.uniqueGameId WHERE games.uniqueUserId = ? AND mines.gameInProgress = 1', (str(self.userId)))
            cursor.execute('SELECT serverSeed, clientSeed, nonce FROM games JOIN mines ON games.uniqueGameId = mines.uniqueGameId WHERE games.uniqueUserId = ? AND mines.gameInProgress = 1', (str(self.userId),))
            response = cursor.fetchone()
            
            if response is None:
                return False
            else:
                self.serverSeed = response["serverSeed"]
                self.clientSeed = response["clientSeed"]
                self.nonce = response["nonce"]
                return True
            
    def getCurrentMinesGameData(self) -> bool:
        db = getDataBase()
        cursor = db.cursor()
        
        cursor.execute('SELECT mineLocations, revealedTiles, multiplier, games.uniqueGameId as uniqueGameId, games.betAmount as betAmount FROM mines JOIN games ON mines.uniqueGameId = games.uniqueGameId WHERE games.uniqueUserId = ? AND mines.gameInProgress = 1', (str(self.userId),))
        response = cursor.fetchone()

        if response is None:
            return False
        else:
            self.mineLocaions = json.loads(response["mineLocations"])
            self.revealedTiles = json.loads(response["revealedTiles"])
            self.multiplier = response["multiplier"]
            self.gameId = response["uniqueGameId"]
            self.betAmount = response["betAmount"] 
            return True
        
    def getBalance(self) -> float:
        db = getDataBase()
        cursor = db.cursor()

        cursor.execute('SELECT balance FROM wallet WHERE uniqueUserId = ?', (self.userId,))
        response = cursor.fetchone()

        if response is None:
            return 0
        else:
            return response['balance']
        
    def getDepositAddress(self) -> str:
        db = getDataBase()
        cursor = db.cursor()
        cursor.execute('SELECT publicKey FROM wallet WHERE uniqueUserId = ?', (self.userId,))
        response = cursor.fetchone()

        if response is None:
            return "Reload and try again"
        else:
            return response['publicKey']

    def payForBet(self, betAmount) -> None:
        db = getDataBase()
        cursor = db.cursor()

        cursor.execute('UPDATE wallet SET balance = balance - ? WHERE uniqueUserId = ?', (betAmount, self.userId))
        db.commit()


      

    def revealServerSeed(self, userName: str, authenticationToken: str, gameId) -> str:
        """Reveal server seed and generate a new one"""

        db = getDataBase()
        cursor = db.cursor()
        cursor.execute('SELECT serverSeed FROM games WHERE uniquegameId = ?', (gameId, ))
        response = cursor.fetchone()

        if response is None:
            return "Invalid game id"
        
        oldServerSeed = response['serverSeed']
        newServerSeed = generateToken(15)
        cursor.execute('UPDATE users SET serverSeed = ?, nonce = 0 WHERE userName = ? AND authenticationToken = ?', (newServerSeed, userName, authenticationToken))
        db.commit()
        
        return oldServerSeed 
    
    def incrementNonce(self) -> None:
        db = getDataBase()
        cursor = db.cursor()
        cursor.execute('SELECT nonce FROM users WHERE username = ? AND authenticationToken = ?', (self.userName, self.authenticationToken))
        user = cursor.fetchone()

        if user is None:
            return False
        
        else:
            self.nonce = user["nonce"]
            cursor.execute('UPDATE users SET nonce = ? WHERE userId = ?', (self.nonce+1, self.userId))
            db.commit()
            db.close()
            return True
        
    def createUserWallet(self)->bool:
        """Called directly after a new user function is called.
            Uses the wallet table and uniqueUserId linking with users table
            1. Generate a public and private keypair for deposits + withdraws
            2.init balance to 0 
        """
        try:
        #TODO Use a solana libray to generate key pairs. Just use random for now.
            keypair = Keypair()
            self.privateKey = str(keypair.private_key)
            self.publicKey = str(keypair.public_key)
            db = getDataBase()
            cursor = db.cursor()
            cursor.execute('INSERT INTO wallet (balance, privateKey, publicKey, uniqueUserId) VALUES (?, ?, ?, ?)', (0.0, self.privateKey, self.publicKey, self.userId))
            db.commit()
            db.close()
            return True
        except Exception as e:
            print(str(e))
            return False
        
    #TODO Sperate this into its own file for wallet stuff 
        
    def getSOltoUSDC(self):
        url = "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd"
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()
            return data['solana']['usd']
        else:
            return None
        
    def withdrawBalance(self, withdrawAmount, withdrawPublicKey) -> bool:
        """Assume that authenticaion been done before called
           1. Ensure that the amount to withdarw is less than total balance to pay for gas.
        """
        try:
            db = getDataBase()
            cursor = db.cursor()
            cursor.execute('SELECT balance FROM wallet WHERE uniqueUserId = ? ', (self.userId,))
            response = cursor.fetchone()
            withdrawAmount = float(withdrawAmount)

            if response is None:
                return "Invalid user Id"

            balance = response["balance"]


            if float(balance) < float(withdrawAmount):
                #TODO Add a check to see if the house wallet can afford to credit the withdraw request.
                return False
            
            usdPerSol = self.getSOltoUSDC()
            
            if usdPerSol != None:
                receiver = withdrawPublicKey
                instruction = transfer(
                    from_public_key=HOUSEPUBLICWALLET,
                    to_public_key=receiver, 
                    lamports=int(((withdrawAmount / usdPerSol) - 0.04 ) * lampartsPerSol)
                    )
                
                transaction = Transaction(instructions=[instruction], signers=[Keypair.from_private_key(HOUSEPRIVATEWALLET)])
                client.send_transaction(transaction)
                cursor.execute('UPDATE wallet SET balance = balance - ? WHERE uniqueUserId = ?', (withdrawAmount, self.userId))
                db.commit()
                db.close()
                return True
            return False
            
        except Exception as e:
            print(str(e))
            return False
        


    def checkForDeposit(self) -> bool:
            """Miniumum deopist of say 0.05 SOL
                1. Check to see if the users wallet balance is greater than 0.05, if so that means a deposit has been made.
                2. Need to account for gas fees however
                3. Convert price of solana to USDC value
            """
            db = getDataBase()
            cursor = db.cursor()
            cursor.execute('SELECT privateKey, publicKey FROM wallet  WHERE uniqueUserId = ? ', (self.userId, ))
            response = cursor.fetchone()
            
            if response is None:
                return "Invalid username or authentication token"

            privateKey = Keypair.from_private_key(response["privateKey"])
            publicKey = PublicKey(response["publicKey"])

            userEscrowBalance = client.get_balance(publicKey)

            if userEscrowBalance / lampartsPerSol > 0.05:
                #Check price conversion BEFORE cashout so if it fails no withdraw request risks messing up.
                usdPerSol = self.getSOltoUSDC()
                if usdPerSol != None:
                    #A deposit of greater than 0.05 SOL has been made
                    receiver = PublicKey(HOUSEPUBLICWALLET)
                    instruction = transfer(
                        from_public_key=publicKey,
                        to_public_key=receiver, 
                        lamports=int(((userEscrowBalance / lampartsPerSol) - 0.04 ) * lampartsPerSol)
                    )
                    transaction = Transaction(instructions=[instruction], signers=[privateKey])
                    client.send_transaction(transaction)
                    #TODO use async to ensure TX goes through - But then credit the user wallet with new value.
                    balanceDeposited = round(((userEscrowBalance / lampartsPerSol) - 0.04 ) * usdPerSol, 2)
                    cursor.execute('UPDATE wallet SET balance = balance + ? WHERE uniqueUserId = ?', (balanceDeposited, self.userId))
                    db.commit()
                    db.close()
                    return True
            
            return False
    

    def getGameHistory(self) -> str:
        db = getDataBase()
        cursor = db.cursor()
        history = []
        """Mines are 1, plinko 2, upgrade 3"""

        #Select mine games first
        cursor.execute('SELECT multiplier, games.uniqueGameId as uniqueGameId, games.betAmount as betAmount FROM mines JOIN games ON mines.uniqueGameId = games.uniqueGameId WHERE games.uniqueUserId = ? AND mines.gameInProgress = 0', (str(self.userId),))
        response = cursor.fetchall()
        for game in response:
            betAmount = float(game["betAmount"])
            data = {
                "gameId": game["uniqueGameId"],
                "gameName": "Mines",
                "betAmount": betAmount,
                "payout": float(game["multiplier"]) * betAmount
            }
            history.append(data)

        #Plinko next
        cursor.execute('SELECT multiplier, games.uniqueGameId as uniqueGameId, games.betAmount as betAmount FROM plinko JOIN games ON plinko.uniqueGameId = games.uniqueGameId WHERE games.uniqueUserId = ?', (str(self.userId),))
        response = cursor.fetchall()
        for game in response:
            betAmount = float(game["betAmount"])
            data = {
                "gameId": game["uniqueGameId"],
                "gameName": "Plinko",
                "betAmount": betAmount,
                "payout": float(game["multiplier"]) * betAmount
            }
            history.append(data)
        
        #Finally upgrade
        cursor.execute('SELECT target, success, games.uniqueGameId as uniqueGameId, games.betAmount as betAmount FROM upgrade JOIN games ON upgrade.uniqueGameId = games.uniqueGameId WHERE games.uniqueUserId = ?', (str(self.userId),))
        response = cursor.fetchall()
        for game in response:
            betAmount = float(game["betAmount"])
            if game["success"] == 0:
                payout = 0.0
            else:
                payout = game["target"]
            data = {
                "gameId": game["uniqueGameId"],
                "gameName": "Upgrade",
                "betAmount": betAmount,
                "payout": payout
            }
            history.append(data)
        self.amountWagerd = 0
        for game in history:
            self.amountWagerd += game["betAmount"]

        return history
    
    def getClientSeedAndNonceFromGameId(self, gameId) -> dict:
        db = getDataBase()
        cursor = db.cursor()

        cursor.execute('SELECT clientSeed, nonce, hashedGameSeed FROM games WHERE uniqueGameId = ?', (gameId,))
        respone = cursor.fetchone()
        data = [respone["clientSeed"], respone["nonce"], respone["hashedGameSeed"]]
        return data


        





def generateToken(length:int) -> str:
    authenticationToken = os.urandom(length).hex()
    return authenticationToken




