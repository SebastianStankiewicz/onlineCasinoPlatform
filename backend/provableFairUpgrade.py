import random

from provablyFair import ProvablyFairGame, getDataBase


class ProvablyFairGameUpgrade(ProvablyFairGame):
    def __init__(self, userId: int, serverSeed: str, clientSeed: str, nonce: int, betAmount: int) -> None:
        self.targetValue = None
        self.rotationAngle = None
        self.gameOutcome = None
        super().__init__(userId, serverSeed, clientSeed, nonce, int(betAmount))
        self.gameType = 3

    def generateNewGame(self, targetValue: int) -> None:
        self.targetValue = int(targetValue)
        random.seed(self.gameSeed)
        winPercentage = (self.betAmount / self.targetValue) * 100
        gameRoll = random.randrange(1, 100)
        print(f'win percentage: {(winPercentage / 100) * 360}. Game Roll: {gameRoll}')
        
        if gameRoll < winPercentage:
            #Game won - Roll between 360 MINUS win perenntage and from there to 360
            maxWinAngle = (winPercentage / 100) * 360;
            self.rotationAngle = 360 - (random.random() * maxWinAngle)
            self.gameOutcome = "won"
        else:
            #Game lost Roll between 0 and win percentage?
            self.rotationAngle = random.random() * (winPercentage / 100) * 360;
            self.gameOutcome = "lost"

    def saveToGamesTable(self) -> bool:
        super().saveToGamesTable()

        try:
            db = getDataBase()
            cursor = db.cursor()
            if self.gameOutcome == "won":
                outcome = 1
            else:
                outcome = 0
            cursor.execute('INSERT INTO upgrade (wager, target, success, uniqueGameId) VALUES (?,?,?,?)', (self.betAmount, self.targetValue, outcome, self.gameId))
            db.commit()
            db.close()
            return True
        except Exception as e:
            print(str(e))
            return False