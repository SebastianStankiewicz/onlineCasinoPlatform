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

        if userCreated:
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
    #If the user return "passes" authentication and got no other active game then:

    #User passes in the client seed NOT from the db
    #User passes in bet amount and number of mines

    #Need to fetch the users nonce, server seed 
    game = ProvablyFairGameMines("serverSeed", "clientSeed", 0)
    game.generateNewGame(5)
    return "pass"

@app.route('/playGame/mines/clickTile', methods=['POST'])
def clickTile():
    #If the user return "pass"es authentication then:
    return "pass"

@app.route('/playGame/mines/cashout', methods=['POST'])
def cashoutMinesGame():
    return "pass"

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
                return jsonify({
                    'success': True,
                    'path': game.path,
                    'dropLocation': game.dropLocation,
                    'multiplier': game.multiplier})
            


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