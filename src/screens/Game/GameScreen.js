import React from 'react'
import {View, StyleSheet, Text, TouchableOpacity, Dimensions, SafeAreaView} from 'react-native'
import * as Color from '../../../global/colors'
import CircleHomeComponent from '../../components/auth/circles/CircleHomeComponent'
import GuessingComponent from '../../components/Game/GuessingComponent'
import PlayerLobbyComponent from '../../components/Game/PlayerLobbyComponent'
import WaitingComponent from '../../components/Game/WaitingComponent'
import WordComponent from '../../components/Game/WordComponent'
import { Feather } from '@expo/vector-icons'; 
import QuitModalComponent from '../../components/modal/QuitModalComponent'
import * as Notifications from 'expo-notifications';
import api from '../../api/server'
import global from '../../../global'
import NotificationComponent from '../../components/general/NotificationComponent'
import AsyncStorage from '@react-native-async-storage/async-storage'
import LoadingIndicator from '../../components/general/LoadingIndicator'
import SimpleModalComponent from '../../components/modal/SimpleModalComponent'
// import * as TaskManager from 'expo-task-manager';
import { AdMobInterstitial } from 'expo-ads-admob';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
    handleSuccess: () => {
        // let g = new GameScreen()
        // g.updateRoundInfo(null)
    },
    handleError: async (err) => {
        console.log(err)
    }
  });

//   const BACKGROUND_NOTIFICATION_TASK = 'BACKGROUND-NOTIFICATION-TASK';

//   TaskManager.defineTask(BACKGROUND_NOTIFICATION_TASK, ({ data, error, executionInfo }) => {
//     console.log('Received a notification in the background!');
//     // Do something with the notification data
//     console.log(data)
//   });
  
//   Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);

class GameScreen extends React.Component {

    // Initializes the state
    constructor() {
        super()
        this.state = {
            code: '',
            word: '',
            counter: 15, 
            guess: '',
            status: 0,
            players: [],
            modalExitVisible: false,
            quitText: '',
            notification: null,
            round: 1,
            answers: [],
            waitText: '',
            hasGuessed: 0,
            notificationTimes: [],
            timerOn: false,
            loading: false,
            modalVisible: false,
            popUpText: '',
            timerDone: false,
            leavingGame: false,
            isActive: false,
        }
        this.focusListener = null
    }

    // Get the up to date gameData object
    initializeAsyncStorage = async () => {
        try {
            let gameDataTemp = await AsyncStorage.getItem('gameData')
            if (!gameDataTemp) {
                console.log("inside the first one")
                this.setState({
                    status: 0,
                    leavingGame: false,
                    word: this.props.route.params.word,
                    code: this.props.route.params.code,
                    players: this.props.route.params.players,
                    notificationTimes: this.props.route.params.notificationTimes
                }, async () => {
                    await AsyncStorage.setItem("gameData", "")
                    await this.updateAsyncStorage()
                            
                    // Updating all of the players in the lobby's player array
                    global.socket.on('timerDone', () => {
                        console.log("Timer is done for everyone")
                        this.setState({timerDone: true}, () => global.socket.disconnect())
                    })

                    global.socket.on("disconnect", () => {
                        if (this.state.leavingGame) {
                            console.log("Disconnecting from socket to leave the game")
                            return
                        }
                        console.log("disconnecting")
                        this.setState({
                            status: 1
                        }, () => {
                            this.updateAsyncStorage()
                        })
                    });
                    global.socket.on('hostEndedGame', () => {
                        console.log("host left the game.")
                    })
                })
            } else {
                console.log("inside the second one")
                let gameData = JSON.parse(gameDataTemp)
                this.setState({
                    code: gameData.code,
                    word: gameData.word,
                    counter: gameData.counter,
                    guess: gameData.guess,
                    status: gameData.status === 0 ? 1 : gameData.status,
                    players: gameData.players,
                    modalExitVisible: gameData.modalExitVisible,
                    quitText: gameData.quitText,
                    notification: gameData.notification,
                    round: gameData.round,
                    answers: gameData.answers,
                    waitText: gameData.waitText,
                    hasGuessed: gameData.hasGuessed,
                    notificationTimes: gameData.notificationTimes,
                    timerOn: gameData.timerOn,
                    loading: false
                })
            }
            
        }
        catch (err) {
            console.log(err)
        }

    }

    // Removes any gameData token, and then adds new one with updated state
    updateAsyncStorage = async () => {
        let stateCopy = JSON.parse(JSON.stringify(this.state));
        await AsyncStorage.setItem("gameData", JSON.stringify(stateCopy))
    }

    // Starts the game by starting counter and triggers everyones notifications
    start = () => {
        this.initializeAsyncStorage().then(() => {
            console.log(this.state.status)
            if (this.state.status === 0) {
                this.counter()
                this.triggerAllNotifications()
            }
        })
    }

    // Triggers when page is focused in order to disable notification problems
    componentDidMount() {
        this.focusListener = this.props.navigation.addListener('focus', () => {
           console.log("page being focused")
           this.setState({isActive: true})
           this.start()
        });
    }

    // Removes the focus listener to avoid memory leak
    componentWillUnmount() {
        if (this.focusListener != null && this.focusListener.remove) {
            this.focusListener.remove();
        }
        this.setState({
            timerOn: false
        })
    }


    // Updates the round info and sends user to correct screen on notification click
    updateRoundInfo = (data) => {

        // Sends user a pop up that they used the wrong game code
        if (data.code !== this.state.code) {
            console.log("in here")
            console.log(data.code)
            console.log(this.state.code)
            this.setState({
                popUpText: 'This notification was not sent for the current game. Please use the correct one!',
                modalVisible: true
            })   
            console.log("User used an old notification")
            return
        }

        const isNotTooLate = this.checkIfLate(data)

        // Sends user to page telling them they're too late for this round
        if (!isNotTooLate) {
            console.log("too late to guess")
            this.setState({status: 6}, () => this.updateAsyncStorage())
            return
        }

        // Sends user to correct screen while updating async storage
        if (data.wordRound === 4) {
            this.setState({
                status: 4,
                round: data.wordRound
            }, () => {
                this.updateAsyncStorage()
            })
        } else {
            this.setState({
                status: 2,
                round: data.wordRound
            }, () => {
                this.updateAsyncStorage()
            })
        }
    }

    // Sends user to the individual player screen
    toPlayerScreen = (player) => {
        this.setState({isActive: false})
        this.props.navigation.navigate('Player', {player, word: this.state.word})
    }

    // Sets the exit modal variable for leaving the game
    setModalExitVisible = (isVisible) => {
        this.setState({
            modalExitVisible: isVisible
        })
    }

    // Sets the modal variable for in game pop ups
    setModalVisible = (isVisible) => {
        this.setState({
            modalVisible: isVisible
        })
    }

    // Sets the guess variable
    setGuess = (g) => {
        this.setState({guess: g.trim()}, () => { this.updateAsyncStorage() })
    }

    // Sets the players array
    setPlayers = (p) => {
        this.setState({players: p}, () => { this.updateAsyncStorage() })
    }

    // Sets the pop up text variable
    setPopUpText = (p) => {
        this.setState({popUpText: p})
    }

    // Displays the full screen ad
    displayAd = async () => {
        // Display an interstitial (Change to ca-app-pub-3940256099942544/1033173712 for test)
        await AdMobInterstitial.setAdUnitID('ca-app-pub-1470582515457694/3435075959'); // Test ID, Replace with your-admob-unit-id
        await AdMobInterstitial.requestAdAsync({ servePersonalizedAds: true});
        await AdMobInterstitial.showAdAsync();
        console.log("Ad will show here")
    }
        
    // Triggered if the user hits the back button
    back = async () => {
        console.log("Navigating back to home screen")
        this.setState({loading: true, leavingGame: true}, () => {
            if (global.socket) {
                global.socket.disconnect()
            }
        })

        this.setState({timerOn: false}, async () => {
            this.setState({
                loading: false,
            }, async () => {
                await AsyncStorage.removeItem('gameData').then(() => {
                    console.log("Quitting the game!")
                    this.props.navigation.navigate('Home')
                })
            })
        })
    }

    // When you receive the notification while in the app, not sure if needed
    handleNotification = notification => {
        this.setState({ notification: notification }, () => { this.updateAsyncStorage() });
    };

    // Checks whether the user clicked on a notification that has expired, true if can guess
    checkIfLate = (data) => {
        let {hour, minute, wordRound} = data
        console.log("hour: ", hour)
        console.log("min: ", minute)
        console.log(wordRound)
        if (wordRound === 4) {
            return true
        }
        let currentHour = new Date().getHours()
        let currentMinute = new Date().getMinutes()
        console.log("Chour: ", currentHour)
        console.log("Cmin: ", currentMinute)
        if (currentHour === hour + 1) {
            if (currentMinute < minute) {
                return true
            }
            return false
        } 
        else if (currentHour < hour + 1) {
            return true
        }
        else {
            return false
        }

    }

    // handle the notification response when user clicks on the notification
    handleNotificationResponse = async (response, pageId) => {
        if (this.state.status === 5 && pageId === -1 && this.state.isActive) {
            console.log("in game end notif")
            this.setState({
                popUpText: 'You have no active games at the moment...',
                modalVisible: true
            })
        }
        if (pageId === -1 && this.state.status !== 5 && this.state.isActive) {
            console.log("in game notif")
            const {data} = response.notification.request.content
            this.updateRoundInfo(data)
        }
    }

    // Triggers the notification for guessing when timer is up
    triggerAllNotifications = async () => {

        for (let i = 0; i < this.state.notificationTimes.length; ++i) {
            await Notifications.scheduleNotificationAsync({
                content: {
                    title: "Alligator - Party Game",
                    body: "Round " + this.state.notificationTimes[i].wordRound + ": It's time to guess the word!",
                    data: {
                        wordRound: this.state.notificationTimes[i].wordRound,
                        hour: this.state.notificationTimes[i].hour,
                        minute: this.state.notificationTimes[i].minute,
                        code: this.state.code
                    },
                    payload: {
                        "content-available": 1 
                    }
                },
                trigger: {
                    hour: this.state.notificationTimes[i].hour,
                    minute: this.state.notificationTimes[i].minute,
                    repeats: false,
                }
            });
        }
    }

    // Starts the timer for word screen
    counter = () => {
        this.setState({timerOn: true}, () => {
            let timer = setInterval(() => {
                if (this.state.timerOn) {
                    this.setState({
                        counter: this.state.counter - 1
                    })
                    if (this.state.counter < 1) {
                        this.setState({timerOn: false}, () => this.updateAsyncStorage() )
                        clearInterval(timer)
                    }
                } else {
                    clearInterval(timer)
                }
            }, 1000)
        })
        
    }

    // Submits answers to server and sends user to final screen
    submitAllAnswers = async () => {
        try {
            
            this.setState({loading: true})
            // Send post request to server giving it the answers for player with id global.id and in the current room (code)
            const response = await api.post('/submitAnswers', {answers: this.state.answers, code: this.state.code, id: global.id})
            await this.displayAd()
            if (!response) {
                this.setState({loading: false, modalVisible: true, popUpText: 'Unable to connect to the server. Please try again!'})
                return
            }
            this.setState({
                players: response.data.players,
                guess: '',
                status: 5,
                loading: false
            }, () => { this.updateAsyncStorage() })
            
        }
        catch (err) {
            console.log("Unable to connect to the server")
            this.setState({loading: false, modalVisible: true, popUpText: 'Unable to connect to the server. Please try again!'})
        }

    }

    // Submits the guess and sends user to appropriate screen
    submitGuess = async () => {
        let answer = {}
        this.setState({loading: true})
        if (this.state.guess.toLowerCase() === this.state.word.toLowerCase()) {
            console.log("Guess was correct")
            answer = {
                round: this.state.round,
                answer: this.state.guess.toLowerCase(),
                isCorrect: true,
            }
        } else {
            console.log("Guess was not correct")
            answer = {
                round: this.state.round,
                answer: this.state.guess.toLowerCase(),
                isCorrect: false,
            }
        }

        // Add answer to answers array
        let temp = this.state.answers
        temp.push(answer)
        this.setState({answers: temp})

        // Display ad after round 2
        if (this.state.round === 2) {
            await this.displayAd()
        }

        if (this.state.status < 4) {
            let text = "Your guess has been submitted! Come back when you get a notification!"
            // Make the timer go off in the morning
            if (this.state.round === 3) {
                text = "You're done for the night! Come back in the morning when you get a notification!"
            }
            this.setState({status: 3, guess: '', round: this.state.round + 1, waitText: text, hasGuessed: this.state.hasGuessed + 1, loading: false}, () => { this.updateAsyncStorage() })
        }
        else {
            this.submitAllAnswers()
        }
    }

    // Renders which screen to show in the gameplay
    renderElements = () => {
        switch(this.state.status) {
            case 0:
                return <WordComponent word={this.state.word} counter={this.state.counter}/>
            case 1: 
                return <WaitingComponent waitText={"Come back when you get a notification to guess! Good luck!"} />
            case 2:
                return <GuessingComponent guess={this.state.guess} setGuess={this.setGuess} submitGuess={this.submitGuess} title={"Guess the Word!"} />
            case 3: 
                return <WaitingComponent waitText={this.state.waitText} />
            case 4:
                return <GuessingComponent guess={this.state.guess} setGuess={this.setGuess} submitGuess={this.submitGuess} title={"Good Morning! Guess the Word!"} />
            case 5:
                return <PlayerLobbyComponent players={this.state.players} toPlayerScreen={this.toPlayerScreen} 
                                             word={this.state.word} code={this.state.code} setPlayers={this.setPlayers} 
                                             setModalVisible={this.setModalVisible} setPopUpText={this.setPopUpText} />
            case 6: 
                return <WaitingComponent waitText={"You are too late for this round! Make sure to click the most recent notification or wait for next round!"} />
        }
    }


    render() {
        return (
            <View style={styles.background}>
                <LoadingIndicator loading={this.state.loading} color={"#fff"} />    
                <CircleHomeComponent />
                <SafeAreaView style={styles.safeView}>
                    <NotificationComponent handleNotificationResponse={this.handleNotificationResponse} backFunction={this.back} pageId={-1} />
                    <SimpleModalComponent modalVisible={this.state.modalVisible} setModalVisible={this.setModalVisible} text={this.state.popUpText} buttonText={'OK'} />
                    {this.renderElements()}
                </SafeAreaView>
            </View>
        )
    }
    
}

const styles = StyleSheet.create({
    background: {
        backgroundColor: Color.MAIN_GREEN,
        height: Dimensions.get('window').height,
    },
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
    
})

export default GameScreen