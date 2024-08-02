import random
import string
import jsonify
from provableFairMines import ProvablyFairGameMines
from provableFairPlinko import ProvablyFairGamePlinko
from provableFairUpgrade import ProvablyFairGameUpgrade
from flask import Flask, request, jsonify, session
from flask_cors import CORS


from userLogic import *


app = Flask(__name__)

app.config['SECRET_KEY'] = 'supersecretkey'
CORS(app)


@app.route('/user/revealServerSeed', methods=['POST'])
#If the user return "passes" authentication and got no other active game then:
def revealServerSeed():
    #Reveal the users accosiated server seed and then set a new one
    try:
        userName = request.json['userName']
        authenticationToken = request.json['authenticationToken']
        
        prevServerSeed = User().revealServerSeed(userName, authenticationToken)
        return jsonify({'success': True,
                        'prevServerSeed': str(prevServerSeed)})

    
    except Exception as e:
        return jsonify({'success': False,
                        'message': str(e)})
    

@app.route('/user/createUser', methods=["POST"])
def createUserAPI():
    try:
        userName = request.json['userName']
        password = request.json['password']

        user = User()
        userCreated = user.createUser(userName, password)
        walletCreated = user.createUserWallet()
        

        if userCreated and walletCreated:
            return jsonify({'success': True,
                            'authenticationToken': user.authenticationToken})
        else:
            return jsonify({'success': False})

    
    except Exception as e:
        return jsonify({'success': False,
                        'message': str(e)})
    
@app.route('/user/login', methods=["POST"])
def loginAPI():
    try:
        userName = request.json['userName']
        password = request.json['password']

        user = User()
        validLogin = user.login(userName, password)
        balance = user.getBalance()

        if validLogin:
            return jsonify({'success': True,
                            'authenticationToken': user.authenticationToken,
                            'balance': balance
                            })
        else:
            return jsonify({'success': False})

    
    except Exception as e:
        return jsonify({'success': False,
                        'message': str(e)})
    

@app.route('/user/wallet/checkForDeposit', methods=["POST"])
def checkForDepositAPI():
    try:
        userName = request.json['userName']
        authenticaionToken = request.json['authenticationToken']

        user = User()
        verificationCheck = user.authenticateUser(userName, authenticaionToken)

        if verificationCheck:
            if user.checkForDeposit():

                return jsonify({'success': True,
                                'message': "Deposit recieved",
                                'balance': user.getBalance()})
        return jsonify({'success': False,
                                'message': "Deposit not recieved"})
            
        

    except Exception as e:
        return jsonify({'success': False,
                        'message': str(e)})
    
@app.route('/user/wallet/withdraw', methods=["POST"])
def withdrawAPI():
    try:
        userName = request.json['userName']
        authenticaionToken = request.json['authenticationToken']
        withdrawAmount = request.json['withdrawAmount']
        withdrawPublicKey = request.json['withdrawPublicKey']

        user = User()
        verificationCheck = user.authenticateUser(userName, authenticaionToken)

        if verificationCheck:
            if user.withdrawBalance(withdrawAmount, withdrawPublicKey):
                return jsonify({'success': True,
                                'balance': user.getBalance(),
                                'message': "Withdraw made"})
            
        return jsonify({'success': False,
                                'message': "Withdraw failed"})
            
        

    except Exception as e:
        return jsonify({'success': False,
                        'message': str(e)})
    
@app.route('/user/wallet/getDepositAddress', methods=["POST"])
def getDepositAddress():
    try:
        userName = request.json['userName']
        authenticaionToken = request.json['authenticationToken']
        user = User()
        verificationCheck = user.authenticateUser(userName, authenticaionToken)

        if verificationCheck:
            depositAddress = user.getDepositAddress()
            return jsonify({'success': True,
                        'depositAddress': depositAddress}) 

        return jsonify({'success': False,
                        'message': "Failed to get address"})

    except Exception as e:
        return jsonify({'success': False,
                        'message': str(e)})
    
@app.route('/user/wallet/getBalance', methods=["POST"])
def getBalanceAPI():
    try:
        userName = request.json['userName']
        authenticaionToken = request.json['authenticationToken']
        user = User()
        verificationCheck = user.authenticateUser(userName, authenticaionToken)

        if verificationCheck:
            balance = user.getBalance()
            return jsonify({'success': True,
                        'balance': balance})  
                 
        return jsonify({'success': False,
                        'message': "Failed to get balance"})
    except Exception as e:
        return jsonify({'success': False,
                        'message': str(e)})

    

########################################################

@app.route('/playGame/mines/create', methods=['POST'])
def createMinesGame():
    try:
        userName = request.json['userName']
        authenticationToken = request.json['authenticationToken']
        betAmount = request.json['betAmount']
        numberOfMines = request.json["numberOfMines"]

        user = User()
        verificationCheck = user.authenticateUser(userName, authenticationToken)
        
        if verificationCheck:
            if user.updateUserObjectWithSeedInputs():
                game = ProvablyFairGameMines(user.userId, user.serverSeed, user.clientSeed, user.nonce, betAmount)
                game.generateNewGame(numberOfMines)
                user.payForBet(game.betAmount)
                if game.saveToGamesTable():
                    if user.incrementNonce():
                        return jsonify({'success': True,
                                        'revealedTiles': [],
                                         'balance': user.getBalance() })
        return jsonify({'success': False})
    
    except Exception as e:
        return jsonify({'success': False,
                        'message': str(e)})

@app.route('/playGame/mines/clickTile', methods=['POST'])
def clickTile():
    try:
        userName = request.json['userName']
        authenticationToken = request.json['authenticationToken']
        tileLocation = request.json['tileLocation']

        user = User()
        verificationCheck = user.authenticateUser(userName, authenticationToken)
        
        if verificationCheck and user.setNonceAndSeedForIncompleteMinesGame():
            #Need to search the mines table for latest game thats not complete yet
            #TODO Refactor and look back at this code!
            
            if user.getCurrentMinesGameData():
                game = ProvablyFairGameMines(user.userId, user.serverSeed, user.clientSeed, user.nonce, None)
                game.setGameData(user.revealedTiles, user.mineLocaions, user.gameId)
                if game.handleTileClick(tileLocation):
                    #User clicked a mine
                    if game.gameInProgress == 0:
                        return jsonify({'success': True,
                                        'mine': True,
                                        'mineLocations': game.mineLocations,
                                        'multiplier': game.multiplier})
                    else:
                        return jsonify({'success': True,
                                        'mine': False,
                                        'revealedTiles': game.revealedTiles,
                                        'multiplier': game.multiplier})
        return jsonify({'success': False})

    except Exception as e:
        return jsonify({'success': False,
                        'message': str(e)})


@app.route('/playGame/mines/cashout', methods=['POST'])
def cashoutMinesGame():
    try:
        userName = request.json['userName']
        authenticationToken = request.json['authenticationToken']
        user = User()
        verificationCheck = user.authenticateUser(userName, authenticationToken)

        if verificationCheck:
            if user.getCurrentMinesGameData():
                game = ProvablyFairGameMines(user.userId, user.serverSeed, user.clientSeed, user.nonce, user.betAmount)
                game.setGameData(user.revealedTiles, user.mineLocaions, user.gameId)
                if game.cashout():
                    return jsonify({'success': True,
                                    'balance': user.getBalance()})
                else:
                    return jsonify({'success': False})
        return jsonify({'success': False})


    except Exception as e:
        return jsonify({'success': False,
                        'message': str(e)})

#TODO Use this and implement it
@app.route('/playGame/mines/getActiveGame', methods=['POST'])
def getActiveMinesGame():
    return "pass"

########################################################

@app.route('/playGame/plinko/dropBall', methods=['POST'])
def dropBall():
    try:
        #TODO Authentice and add wallet balance check
        userName = request.json['userName']
        authenticationToken = request.json['authenticationToken']
        betAmount = request.json['betAmount']

        user = User()
        verificationCheck = user.authenticateUser(userName, authenticationToken)

        if verificationCheck:
            if user.updateUserObjectWithSeedInputs():
                game = ProvablyFairGamePlinko(user.userId, user.serverSeed, user.clientSeed, user.nonce, betAmount)
                game.generateBall()
                user.payForBet(game.betAmount)
                if game.saveToGamesTable():
                    betOutcome = round(game.multiplier * game.betAmount, 2)
                    db = getDataBase()
                    cursor = db.cursor()
                    cursor.execute('UPDATE wallet SET balance = balance + ? WHERE uniqueUserId = ?', (betOutcome, game.userId))
                    db.commit()
                    user.incrementNonce()
                    return jsonify({
                        'success': True,
                        'path': game.path,
                        'dropLocation': game.dropLocation,
                        'multiplier': game.multiplier,
                        'betOutcome': betOutcome,
                        'balance': user.getBalance()})
            
        return jsonify({'success': False,
                        'message': str(e)})

    except Exception as e:
        return jsonify({'success': False,
                        'message': str(e)})
########################################################

@app.route('/playGame/upgrade/makeUpgrade', methods=['POST'])
def makeUpgrade():
    try:
        userName = request.json['userName']
        authenticationToken = request.json['authenticationToken']
        betAmount = request.json['betAmount']
        targetValue = request.json['targetValue']


        user = User()
        verificationCheck = user.authenticateUser(userName, authenticationToken)

        if targetValue > betAmount and verificationCheck:
            if user.updateUserObjectWithSeedInputs():
                game = ProvablyFairGameUpgrade(user.userId, user.serverSeed, user.clientSeed, user.nonce, betAmount)
                game.generateNewGame(targetValue)
                user.payForBet(game.betAmount) #Dont like this implementation.
                user.incrementNonce()
                game.saveToGamesTable()
                return jsonify({
                    'success': True,
                    'rotationAngle': game.rotationAngle,
                    'gameOutCome': game.gameOutcome,
                    'balance': user.getBalance()})

        return jsonify({'success': False})

    except Exception as e:
        return jsonify({'success': False,
                        'message': str(e)})

########################################################



if __name__ == '__main__':
    app.run(debug=True)