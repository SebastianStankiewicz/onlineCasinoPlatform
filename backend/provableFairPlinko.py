import random
import json
import os

from provablyFair import ProvablyFairGame

#You cant "loose" plinko you can just loose half your money never all of it

class ProvablyFairGamePlinko(ProvablyFairGame):
    def __init__(self, userId: int, serverSeed: str, clientSeed: str, nonce: int, betAmount: int):
        self.multipliers = [16, 9, 2, 1.4, 1.4, 1.2, 1.1, 1, 0.5, 1, 1.1, 1.2, 1.4, 1.4, 2, 9, 16]
        self.jsonFile = "/Users/sebastianstankiewicz/portfolioOnMac/projects/casinoGames/completeCasino/plinkoDropLocations.json"
        self.gameType = 2

        self.multiplier = None
        self.winnings = None

        self.dropLocation = None
        self.path = None
        super().__init__(userId, serverSeed, clientSeed, nonce, betAmount)
    
    def getRandomDropLocation(self, jsonFile, key):
        with open(jsonFile, 'r') as file:
            data = json.load(file)
            if key in data:
                values = data[key]
                return random.choice(values)
            else:
                return None

    def generateBall(self):
        random.seed(self.gameSeed)
        self.path = [random.choice([-1, 1]) for _ in range(8)]
        self.index = sum(self.path)
        self.multiplier = self.multipliers[self.index + 8]
        self.dropLocation = self.getRandomDropLocation(self.jsonFile, str(self.multiplier))

    
