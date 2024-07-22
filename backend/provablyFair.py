import random
import hashlib
import os
import json

#ALl of attributes should be stored in the user table of database


#Both client and server seed 40 characters long



#IMPORTANT. THis game object should be "destroyed" or not re used for multiple games. 

def sha512Hash(data):
    hashedData = hashlib.sha512(data.encode('utf-8')).hexdigest()
    return hashedData

#Game type an int eg 1 being upgrade for example
class ProvablyFairGame:
    def __init__(self, userId: int, serverSeed: str, clientSeed: str, nonce: int, betAmount: int):
        self.userId = userId
        self.gameId = os.urandom(10).hex() #Shouldnt be made in the object!! create and pass in to db not needed with objet at all
        self.betAmount = betAmount
        self.serverSeed = serverSeed #Both 40 in length
        self.clientSeed = clientSeed
        self.nonce = nonce
        self.gameSeed = f"{self.serverSeed}{self.clientSeed}{self.nonce}"
        self.hashedGameSeed = sha512Hash(self.gameSeed)

 
    def getGameSeed(self) -> str:
        return self.gameSeed
    
    def getGameHash(self) -> str:
        return self.hashedGameSeed











