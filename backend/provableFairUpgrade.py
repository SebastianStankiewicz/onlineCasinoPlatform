import random

from provablyFair import ProvablyFairGame


class ProvablyFairGameUpgrade(ProvablyFairGame):
    def __init__(self, userId: int, serverSeed: str, clientSeed: str, nonce: int, betAmount: int) -> None:
        self.targetValue = None
        self.rotationAngle = None
        self.gameOutcome = None
        self.gameType = 3
        super().__init__(userId, serverSeed, clientSeed, nonce, betAmount)

    def generateNewGame(self, targetValue: int) -> None:
        self.targetValue = targetValue
        random.seed(self.gameSeed)
        winPercentage = (self.betAmount / self.targetValue) * 100
        gameRoll = random.randrange(1, 100)
        if gameRoll < winPercentage:
            #Game won
            maxWinAngle = (winPercentage / 100) * 360
            self.rotationAngle = random.random() * maxWinAngle
            self.gameOutcome = "won"
        else:
            #Game lost
            self.rotationAngle = winPercentage + (random.random() * (360 - winPercentage));
            self.gameOutcome = "lost"

test = ProvablyFairGameUpgrade(5, "nice", "nice", 11, 23)
test.generateNewGame(26)
print(f'Game outcome: {test.gameOutcome} Game hash: {test.getGameHash()}')