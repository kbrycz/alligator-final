import React from 'react'
import {View, StyleSheet, Text, TouchableOpacity, Dimensions, SafeAreaView, FlatList, Clipboard, Share} from 'react-native'
import * as Color from '../../../global/colors'
import global from '../../../global'
import PlayerListComponent from '../../components/Lobby/PlayerListComponent'
import { Feather } from '@expo/vector-icons'; 
import QuitModalComponent from '../../components/modal/QuitModalComponent'
import SimpleModalComponent from '../../components/modal/SimpleModalComponent'
import CircleHomeComponent from '../../components/auth/circles/CircleHomeComponent'
import api from '../../api/server'
import LoadingIndicator from '../../components/general/LoadingIndicator'
import NotificationComponent from '../../components/general/NotificationComponent'

class LobbyScreen extends React.Component {

    constructor() {
        super()
        this.state = {
            players: [],
            code: '',
            modalVisible: false,
            modalExitVisible: false,
            isHost: false,
            quitText: '',
            localPlayer: {},
            text: '',
            isGoingHome: false,
            loading: false,
            startGame: false,
            isActive: false
        }
    }

    componentDidMount() {
        this.setState({isActive: true})
        this.setUpNewPlayer()
        this.socketFunctions()
    }

    // Receives data from the previous screen to set up the new player
    setUpNewPlayer = () => {
        this.setState({
            players: this.props.route.params.players,
            code: this.props.route.params.code,
            isHost: this.props.route.params.isHost,
            localPlayer: this.props.route.params.localPlayer
        }, () => {
            this.setState({quitText: this.state.isHost ? "Would you like to leave the lobby and end the game for everyone?" : "Are you sure you want to quit? You will disconnect from the game."})
        })
    }

    // Sets the exit modal variable for leaving the game
    setModalExitVisible = (isVisible) => {
        this.setState({
            modalExitVisible: isVisible
        })
    }

    // Sets the normal modal visible in case host ends the game
    setModalVisible = (isVisible) => {
        this.setState({
            modalVisible: isVisible
        })
    }

    // Socket functions listening to server for messages
    socketFunctions = () => {

        // Telling the host to add a player to the lobby
        global.socket.on('hostAddPlayer', (obj) => {
            for (let i = 0; i < this.state.players.length; ++i) {
                if (this.state.players[i].id === obj.player.id) {
                    console.log("Duplicate player. Do not add")
                    return
                }
            }
            console.log("Adding player " + obj.player.username + " to lobby")
            let tempPlayers = this.state.players
            tempPlayers.push(obj.player)
            let newObj = {
                players: tempPlayers,
                code: obj.code
            }
            global.socket.emit('hostSendPlayersArray', newObj);
        })

        // Updating all of the players in the lobby's player array
        global.socket.on('updatePlayersArray', (players) => {
            console.log("updating this players arrays to the hosts one")
            this.setState({
                players: players
            })
        })

        // Lets the lobby know that the host has ended the game
        global.socket.on('hostEndedGame', () => {
            if (this.state.startGame) {
                return
            }
            console.log("Host ended game, leaving lobby")

            this.setState({
                text: "The host has ended the game. Returning to lobby.",
                modalVisible: true,
                isGoingHome: true
            })
            global.socket.disconnect()
        })

        // Lets all the other players know that a player left the lobby
        global.socket.on('playerLeftLobby', (id) => {
            console.log("Player left game. Removing the id " + id)
            let tempPlayers = []
            for (let i = 0; i < this.state.players.length; ++i) {
                if (this.state.players[i].socketId !== id) {
                    tempPlayers.push(this.state.players[i])
                } 
            }
            this.setState({
                players: tempPlayers
            })
        })

        // Lets all players know that the host has started the game
        global.socket.on('hostStartedGame', async (word) => {
            console.log("Host has started game")
            // Get the game object async working
            let tempNotificationTimes = this.getNotificationTimes()

            let obj = {
                screen: 'Gameplay',
                params: {word: word, code: this.state.code, players: this.state.players, notificationTimes: tempNotificationTimes}
            }
            this.setState({loading: false, startGame: true, isActive: false})
            this.props.navigation.navigate('Game', obj)
        })

        // Updates all users with a new players ready up sign
        global.socket.on('updateReadyUp', (playersInLobby_in) => {
            console.log("Updating players array for a ready up")
            this.setState({
                players: playersInLobby_in,
            })
        })
    }

    
    // Gets the notification times for testing - 1 min apart
    getNotificationTimes2 = () => {
        let notifs = []
        let currentHour = new Date().getHours()
        let currentMinute = new Date().getMinutes()
        // Get the first notif

        notifs.push({
            hour: currentHour,
            minute: currentMinute + 1,
            wordRound: 1
        })
        notifs.push({
            hour: currentHour,
            minute: currentMinute + 2,
            wordRound: 2
        })
        notifs.push({
            hour: currentHour,
            minute: currentMinute + 3,
            wordRound: 3
        })
        notifs.push({
            hour: currentHour,
            minute: currentMinute + 4,
            wordRound: 4
        })
        return notifs
    }

    // Gets the notification times based on the current user time
    getNotificationTimes = () => {
        let notifs = []
        let currentHour = new Date().getHours()
        let currentMinute = new Date().getMinutes()
        // Get the first notif
        if (currentHour + 1 < 25) {
            notifs.push({
                hour: currentHour + 1,
                minute: currentMinute,
                wordRound: 1
            })
        } else {
            notifs.push({
                hour: 0,
                minute: currentMinute,
                wordRound: 1
            })
        }
        // Get the second notif
        if (currentHour + 2 < 25) {
            notifs.push({
                hour: currentHour + 2,
                minute: currentMinute,
                wordRound: 2
            })
        } else {
            notifs.push({
                hour: (currentHour + 2) - 24,
                minute: currentMinute,
                wordRound: 2
            })
        }
        // Get the 3rd notif
        if (currentHour + 3 < 25) {
            notifs.push({
                hour: currentHour + 3,
                minute: currentMinute,
                wordRound: 3
            })
        } else {
            notifs.push({
                hour: (currentHour + 3) - 24,
                minute: currentMinute,
                wordRound: 3
            })
        }
        // Get the morning notif
        if (currentHour > 3 && currentHour < 8) {
            notifs.push({
                hour: currentHour + 4,
                minute: currentMinute,
                wordRound: 4
            })
        } else {
            notifs.push({
                hour: 7,
                minute: 30,
                wordRound: 4
            })
        }

        return notifs
    }

    // Returns the user to the home screen when the host quits
    closeModal = (isVis) => {
        if (this.state.isGoingHome) {
            this.setState({isActive: false})
            this.props.navigation.navigate('Home')
        } else {
            this.setModalVisible(isVis)
        }
    }

    // Copy the code to the users clipboard
    copyCode = () => {
        Clipboard.setString(this.state.code)
    }

    // Triggered if the user hits the back button. Checks whether it is host and handles accordingly
    back = () => {
        global.socket.emit('leavingGame');
        global.socket.disconnect()
        this.setState({isActive: false})
        this.props.navigation.navigate('Home')
    }

    // Starts the game
    startGame = async () => {
        try {
            this.setState({loading: true})
            // Send post request to server giving it the data to create a game object
            const response = await api.post('/createGame', {players: this.state.players, code: this.state.code})

            if (!response) {
                this.setState({
                    text: "Unable to connect to the server! Please try again!",
                    modalVisible: true,
                    loading: false
                })
                return
            }

            // Send notification to all players that the game has started
            console.log("sending start game stuff")
            global.socket.emit('startGame', this.state.code);
            global.socket.emit('startTimer', this.state.code);
        }
        catch (err) {
            this.setState({
                text: "Unable to connect to the server! Please try again!",
                modalVisible: true,
                loading: false
            })
            console.log("Could not connect to server to start the game!")
        }
    }

    // Sends server signal that player has readied up. Creates whole new playersInLobby array
    readyUp = (id) => {
        let tempArray = []
        for (let i = 0; i < this.state.players.length; ++i) {
            let p = this.state.players[i]
            if (this.state.players[i].id === id) {
                p.isReady = true
            }
            tempArray.push(p)
        }

        this.setState({
            players: tempArray
        }, () => {
            const obj = {code: this.state.code, players: tempArray}
            global.socket.emit("updateReadyUp", obj)
        })

    }

    // Lets users share the app with other people
    shareButton = async () => {
        try {
            const result = await Share.share({
                message: "Alligator game code: " + this.state.code
            });
            } catch (error) {
                this.setState({
                    text: 'Unable to share game. Please try again!',
                    modalVisible: true,
                })
            }
    }

    // handle the notification response when user clicks on the notification
    handleNotificationResponse = async (response, pageId) => {
        if (pageId === 2 && this.state.isActive) {
            console.log("in lobby notif")
            this.setState({
                text: 'You have no active games at the moment...',
                modalVisible: true
            })
        }
    }

    render() {
        return (
            <View style={styles.background}>
                <LoadingIndicator loading={this.state.loading} color={"#fff"} />
                <CircleHomeComponent />
                <SafeAreaView>
                    <TouchableOpacity style={styles.iconContainer} onPress={() => this.setModalExitVisible(true)} >
                        <Feather name="arrow-left" style={styles.back} />
                    </TouchableOpacity>  
                    <TouchableOpacity style={styles.iconContainer} onPress={this.shareButton} >
                        <Feather name="share" style={styles.invite} />
                    </TouchableOpacity>  
                    <View style={styles.container}>
                        <View style={styles.headerContainer}>
                            <Text style={styles.header}>Game Lobby</Text>
                        </View>
                        <FlatList
                            data={this.state.players}
                            renderItem={({ item, index }) => (
                                <PlayerListComponent player={item} index={index} readyUp={this.readyUp}/>
                            )}
                            keyExtractor={item => item.id.toString()}
                            style={styles.list} />
                        <TouchableOpacity onPress={this.copyCode} style={styles.codeContainer}>
                            <Feather name="copy" style={styles.icon} />
                            <Text style={styles.code}>{this.state.code}</Text>
                        </TouchableOpacity>
                        {
                            this.state.isHost
                            ?
                            <TouchableOpacity style={styles.playContainer} onPress={this.startGame}>
                                <Text style={styles.playButton}>Start Game</Text>
                            </TouchableOpacity>
                            : <Text style={styles.waiting}>Waiting for host!</Text>
                        }
                    </View>
                    <QuitModalComponent modalExitVisible={this.state.modalExitVisible} setModalExitVisible={this.setModalExitVisible}
                        text={this.state.quitText} func={this.back}/>
                    <SimpleModalComponent modalVisible={this.state.modalVisible} setModalVisible={this.closeModal} text={this.state.text} buttonText={"OK"} />
                    <NotificationComponent handleNotificationResponse={this.handleNotificationResponse} backFunction={() => console.log("Do nothing")} pageId={2} />
                </SafeAreaView>
            </View>
        )
    }
    
}

const styles = StyleSheet.create({
    iconContainer: {
        zIndex: 1
    },
    back: {
        fontSize: Dimensions.get('window').height * .04,
        color: '#fff',
        position: 'absolute',
        top: 0,
        left: Dimensions.get('window').width * .03,
    },
    invite: {
        fontSize: Dimensions.get('window').height * .03,
        color: '#fff',
        position: 'absolute',
        top: 5,
        right: Dimensions.get('window').width * .03,
    },
    background: {
        backgroundColor: Color.MAIN_GREEN,
        height: Dimensions.get('window').height
    },
    headerContainer: {
        marginTop: Dimensions.get('window').height * .01,
        borderBottomWidth: 3,
        borderColor: 'rgba(255, 255, 255, 0.5)',
    },
    header: {
        width: Dimensions.get('window').width,
        padding: Dimensions.get('window').height * .03,
        textAlign: 'center',
        color: '#fff',
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: {width: -2, height: 2},
        textShadowRadius: 10,
        letterSpacing: Dimensions.get('window').width * .01,
        textTransform: 'uppercase',
        fontSize: Dimensions.get('window').height * .04,
        fontFamily: 'PatrickHand',
    },
    list: {
        height: Dimensions.get('window').height * .6,
        borderBottomWidth: 3,
        borderColor: 'rgba(255, 255, 255, 0.5)',
    },
    codeContainer: {
        flexDirection: 'row',
        width: Dimensions.get('window').width * .4,
        marginLeft: Dimensions.get('window').width * .3,
        marginRight: Dimensions.get('window').width * .3,
        justifyContent: 'center',
        marginTop: Dimensions.get('window').height * .01,
    },
    code: {
        color: '#fff',
        fontSize: Dimensions.get('window').height * .05,
        fontFamily: 'PatrickHand',
    },
    icon: {
        textAlign: 'right',
        marginRight: Dimensions.get('window').width * .05,
        fontSize: Dimensions.get('window').height * .025,
        color: '#fff',
        marginTop: Dimensions.get('window').height * .025,
    },
    playContainer: {
        backgroundColor: '#fff',
        marginTop: Dimensions.get('window').height * .03,
        borderRadius: 100,
        borderWidth: 1,
        padding: Dimensions.get('window').height * .01,
        width: Dimensions.get('window').width * .7,
        marginLeft: Dimensions.get('window').width * .15,
        marginRight: Dimensions.get('window').width * .15,
    },
    playButton: {
        textAlign: 'center',
        fontSize:  Dimensions.get('window').height * .03,
        fontFamily: 'PatrickHand',
        color: Color.MAIN_GREEN
    },
    waiting: {
        marginTop: Dimensions.get('window').height * .02,
        textAlign: 'center',
        fontSize:  Dimensions.get('window').height * .03,
        fontFamily: 'PatrickHand',
        color: '#fff'
    }
})

export default LobbyScreen