import random
import json
from provablyFair import ProvablyFairGame, getDataBase
import os



class ProvablyFairGameMines(ProvablyFairGame):
    def __init__(self, userId: int, serverSeed: str, clientSeed: str, nonce: int, betAmount: int):
        self.gameType = 1
        self.revealedTiles = []
        self.mineLocations = []
        self.multiplier = None
        self.gameInProgress = 1
        super().__init__(userId, serverSeed, clientSeed, nonce, betAmount)

    def generateNewGame(self, numberOfMines:int) -> None:
        random.seed(self.gameSeed)    
        self.mineLocations = random.sample(range(1, 25), int(numberOfMines))
        self.calculateMultiplier()
    
    #When a game is in progress and can call this function
    #When objct is made a game id is randmoly genned so need to override this.
    def setGameData(self, revealedTiles, mineLocations, gameId):
        self.revealedTiles = revealedTiles
        self.mineLocations = mineLocations
        self.gameId = gameId

    # 3% house edge
    def calculateMultiplier(self) -> None:
        multi = 1
        totalRevealedTiles = len(self.revealedTiles)
        totalMines = len(self.mineLocations)
        for i in range(totalRevealedTiles):
            multi = multi * (25 - i - totalMines) / (25 - i)

        if 0.97 * (1/multi) >= 20:
            self.multiplier = 20.0
        else:
            self.multiplier = round(0.97 * (1/multi),2)

    def handleTileClick(self, tileLocation: int) -> None:
        #TODO Need to convert data back to list i think?

        self.revealedTiles = json.loads(self.revealedTiles)
        self.mineLocations = json.loads(self.mineLocations)

        if tileLocation not in self.revealedTiles:
            if(tileLocation in self.mineLocations):
                #Game over
                self.gameInProgress = 0
                self.multiplier = 0          
            else:
                #Safe tile clicked. also need to re calculate the multiplier 
                self.revealedTiles.append(tileLocation) 
                self.calculateMultiplier()

            try:
                db = getDataBase()
                cursor = db.cursor()
                cursor.execute("UPDATE mines SET revealedTiles = ?, gameInProgress = ?, multiplier = ? WHERE uniqueGameId = ?", (json.dumps(self.revealedTiles), self.gameInProgress, self.multiplier, self.gameId) )
                db.commit()
                return True
            except Exception as e:
                print(str(e))
                return False
        return False    
    
    #TODO refactor
    def cashout(self)->bool:
        try:
            db = getDataBase()
            cursor = db.cursor()
            print(self.gameId)
            cursor.execute("UPDATE mines SET gameInProgress = 0 WHERE uniqueGameId = ?", (self.gameId,))
            db.commit()
            return True

        except Exception as e:
                    print(str(e))
                    return False



    #@override
    def saveToGamesTable(self)-> bool:
        super().saveToGamesTable()
        try:
            db = getDataBase()
            cursor = db.cursor()
            cursor.execute('INSERT INTO mines (mineLocations, revealedTiles, multiplier, gameInProgress, uniqueGameId ) VALUES (?, ?, ?, ?, ?)', 
                        (json.dumps(self.mineLocations), json.dumps(self.revealedTiles), self.multiplier, self.gameInProgress, self.gameId ))
            db.commit()
            db.close()
            return True
        except Exception as e:
            print(str(e))
            return False


"""userid = "test2"
serverSeed = "seeeed"
clientSeed = "I can be anythinig and set by the player"
nonce = 0

test = ProvablyFairGameMines(userid, serverSeed, clientSeed, nonce, 5)
test.generateNewGame(20)

test.calculateMultiplier()
print(test.multiplier)

test.handleTileClick(1)

test.calculateMultiplier()
print(test.multiplier)"""
