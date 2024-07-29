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

        if validLogin:
            return jsonify({'success': True,
                            'authenticationToken': user.authenticationToken})
        else:
            return jsonify({'success': False})

    
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
                if game.saveToGamesTable():
                    if user.incrementNonce():
                        return jsonify({'success': True})
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
                if game.handleTileClick(tileLocation) : 
                    return jsonify({'success': True})
                else:
                    return jsonify({'success': False})

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
                game = ProvablyFairGameMines(user.userId, user.serverSeed, user.clientSeed, user.nonce, None)
                game.setGameData(user.revealedTiles, user.mineLocaions, user.gameId)
                if game.cashout():
                    return jsonify({'success': True})
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
                if game.saveToGamesTable():
                    user.incrementNonce()
                    return jsonify({
                        'success': True,
                        'path': game.path,
                        'dropLocation': game.dropLocation,
                        'multiplier': game.multiplier,
                        'betOutcome': round(game.multiplier * game.betAmount, 2)})
            
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
                user.incrementNonce()
                game.saveToGamesTable()
                return jsonify({
                    'success': True,
                    'rotationAngle': game.rotationAngle,
                    'gameOutCome': game.gameOutcome,})

        return jsonify({'success': False})

    except Exception as e:
        return jsonify({'success': False,
                        'message': str(e)})

########################################################



if __name__ == '__main__':
    app.run(debug=True)