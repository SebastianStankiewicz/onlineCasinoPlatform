import sqlite3
import os

DATABASE = "/Users/sebastianstankiewicz/portfolioOnMac/projects/casinoGames/completeCasino/backend/database/developmentDataBase.db"

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
            cursor.execute('SELECT serverSeed, clientSeed, nonce FROM games JOIN mines ON games.uniqueGameId = mines.uniqueGameId WHERE games.uniqueUserId = ? AND mines.gameInProgress = 1', (str(self.userId)))
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

        cursor.execute('SELECT mineLocations, revealedTiles, multiplier, games.uniqueGameId as uniqueGameId FROM mines JOIN games ON mines.uniqueGameId = games.uniqueGameId WHERE games.uniqueUserId = ? AND mines.gameInProgress = 1', (str(self.userId)))
        response = cursor.fetchone()

        if response is None:
            return False
        else:
            self.mineLocaions = response["mineLocations"]
            self.revealedTiles = response["revealedTiles"]
            self.multiplier = response["multiplier"]
            self.gameId = response["uniqueGameId"]
 
            return True

                

      

    def revealServerSeed(self, userName: str, authenticationToken: str) -> str:
        """Reveal server seed and generate a new one"""

        db = getDataBase()
        cursor = db.cursor()
        cursor.execute('SELECT serverSeed FROM users WHERE username = ? AND authenticationToken = ?', (userName, authenticationToken))
        user = cursor.fetchone()

        if user is None:
            return "Invalid username or authentication token"
        
        oldServerSeed = user['serverSeed']
        newServerSeed = generateToken(15)

        cursor.execute('UPDATE users SET serverSeed = ? WHERE userName = ? AND authenticationToken = ?', (newServerSeed, userName, authenticationToken))
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
            self.privateKey = generateToken(10)
            self.publicKey = generateToken(10)

            db = getDataBase()
            cursor = db.cursor()
            cursor.execute('INSERT INTO wallet (balance, privateKey, publicKey, uniqueUserId) VALUES (?, ?, ?, ?)', (0.0, self.privateKey, self.publicKey, self.userId))
            db.commit()
            db.close()
            return True
        except Exception as e:
            print(str(e))
            return False






def generateToken(length:int) -> str:
    authenticationToken = os.urandom(length).hex()
    return authenticationToken




