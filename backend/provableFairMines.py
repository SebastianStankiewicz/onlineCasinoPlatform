import random
from provablyFair import ProvablyFairGame




class ProvablyFairGameMines(ProvablyFairGame):
    def __init__(self, userId: int, serverSeed: str, clientSeed: str, nonce: int, betAmount: int):
        self.gameType = 1
        self.revealedTiles = []
        self.mineLocations = []
        self.multiplier = None
        self.gameInProgress = True
        super().__init__(userId, serverSeed, clientSeed, nonce, betAmount)

    def generateNewGame(self, numberOfMines:int) -> None:
        random.seed(self.gameSeed)        
        self.mineLocations = random.sample(range(1, 25), numberOfMines)
    
    #When a game is in progress and can call this function
    def setGameData(self, revealedTiles, mineLocations):
        self.revealedTiles = revealedTiles
        self.mineLocations = mineLocations

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
        if tileLocation not in self.revealedTiles:
            if(tileLocation in self.mineLocations):
                #Game over
                self.gameInPlay = False          
            else:
                #Safe tile clicked. also need to re calculate the multiplier 
                self.revealedTiles.append(tileLocation) 
                self.calculateMultiplier()


userid = "test2"
serverSeed = "seeeed"
clientSeed = "I can be anythinig and set by the player"
nonce = 0

test = ProvablyFairGameMines(userid, serverSeed, clientSeed, nonce, 5)
test.generateNewGame(20)

test.calculateMultiplier()
print(test.multiplier)

test.handleTileClick(1)

test.calculateMultiplier()
print(test.multiplier)
