import React from 'react'
import {View, StyleSheet, Text, Dimensions, TouchableOpacity, SafeAreaView, Image, Share, Linking} from 'react-native'
import * as Color from '../../../global/colors'
import { Feather } from '@expo/vector-icons'; 
import io from "socket.io-client";
import {serverName} from '../../api/serverName'
import SimpleModalComponent from '../../components/modal/SimpleModalComponent';
import global from '../../../global';
import AsyncStorage from '@react-native-async-storage/async-storage'
import CircleHomeComponent from '../../components/auth/circles/CircleHomeComponent';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import LoadingIndicator from '../../components/general/LoadingIndicator';
import NotificationComponent from '../../components/general/NotificationComponent';

class HomeScreen extends React.Component {

    constructor() {
        super()
        this.state = {
            socket: null,
            modalVisible: false,
            text: '',
            notificationsOn: '',
            loading: false,
            connected: false,
            isActive: false
        }
    }

    // Sets up all main parts of app
    componentDidMount() {
        this.getAllAsyncs()
        this.registerForPushNotificationsAsync().then(n => {
            this.setState({notificationsOn: n, isActive: true})
        })
        // If the screen gets focus, update the gamedata field
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            this.setState({connected: false, isActive: true})
        });
    }

    // Removes async storage item
    removeItemValue = async (key) => {
        try {
            await AsyncStorage.removeItem(key);
            return true;
        }
        catch(exception) {
            return false;
        }
    }

    // Gets all of the user data and sets it to the global variables to be used later
    getAllAsyncs = async () => {
        AsyncStorage.getItem('first').then((first) => {
            global.first = first
        })
        AsyncStorage.getItem('last').then((last) => {
            global.last = last
        })
        AsyncStorage.getItem('username').then((username) => {
            global.username = username
        })
        AsyncStorage.getItem('id').then((id) => {
            global.id = id
        })
        await this.removeItemValue("gameData")
    }

    // If the create button is pressed, call connect to server function
    createGame = () => {
        this.setState({loading: true})
        if (this.state.notificationsOn) {
            this.connectToServer('createRoom')
        } else {
            this.setState({
                text: "You must allow notifications! Go to your phone's settings and restart the app",
                modalVisible: true,
                loading: false
            })
        }
    }

    // If the join button is pressed, call the connect to server function
    joinGame = () => {
        this.setState({loading: true})
        if (this.state.notificationsOn) {
            this.connectToServer('joinRoom')
        } else {
            this.setState({
                text: "You must allow notifications! Go to your phone's settings and restart the app",
                modalVisible: true,
                loading: false
            })
        }
    }

    // Makes sure the user has signed up for push notifications
    registerForPushNotificationsAsync = async () => {
        let notificationsOn = false
    
        // Checks if user is using a device and not simulator
        if (Constants.isDevice) {
          const { status: existingStatus } = await Notifications.getPermissionsAsync();
          let finalStatus = existingStatus;
    
          // Gets the permission from the device
          if (existingStatus !== 'granted') {
            console.log("requesting permisson for device notifications")
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
          }
          // The user has denied the permisson for notifications
          if (finalStatus !== 'granted') {
            console.log('Failed to get push token for push notification!');
            return;
          }
          notificationsOn = true
        } 
        else {
            console.log("Has to be a device to receive notifications")
        }
      
        return notificationsOn;
    }

    // Connects the socket to the server
    // If unable to connect, send error message back to user
    // If connected, send user to correct page
    connectToServer = (room) => {
        if (this.state.connected) {
            console.log("Already connected to server")
            this.setState({loading: false})
            return
        }
        this.setState({
            loading: true,
            connected: true
        }, () => {
            global.socket = io(serverName)
            global.socket.connect()
    
            // If unable to connect to server
            global.socket.on('connect_error', () => {
                console.log('Connection Failed');
                this.setState({
                    text: 'Unable to connect to the server. Please try again!',
                    modalVisible: true,
                    loading: false,
                    connected: false
                })
                global.socket.disconnect()
            });
    
            // If we are able to connect to the server
            global.socket.on('connect', () => {
                console.log('Connection Sucessful');
                this.setState({
                    socket: global.socket
                }, () => {
                    if (room === 'joinRoom') {
                        this.setState({isActive: false, loading: false})
                        this.props.navigation.navigate('Join')
                    } else {
                        global.socket.emit('createRoom')
                    }
                })
            });
            
            // Game is created, given roomname and transferring over to lobby
            global.socket.on('createRoom', code => {
                console.log("Room Created successfully: " + code)
                let player = {
                    id: global.id,
                    socketId: global.socket.id,
                    first: global.first,
                    last: global.last,
                    username: global.username,
                    isHost: true, 
                    answers: []
                }
                let players = []
                players.push(player)
                this.setState({loading: false, isActive: false})
                this.props.navigation.navigate('Lobby', {'code': code, 'players': players, 'isHost': true, localPlayer: player})
            })
        })
        
    }

    // Sets the simple modal to isVisible variable
    setModalVisible = (isVisible) => {
        this.setState({
            modalVisible: isVisible
        })
    }

    // Lets users share the app with other people
    // shareButton = async () => {
    //     try {
    //         const result = await Share.share({
    //             url: 'https://alligator.games',
    //         });

    //         } catch (error) {
    //             this.setState({
    //                 text: 'Unable to share app. Please try again!',
    //                 modalVisible: true,
    //             })
    //         }
    // }

    // Sends the user to the app store to rate the app
    // rateApp = () => {
    //     Linking.openURL('https://alligator.games');
    // }

    // handle the notification response when user clicks on the notification
    handleNotificationResponse = async (response, pageId) => {
        if (pageId === 0 && this.state.isActive) {
            console.log("in home notif")
            this.setState({
                text: 'You have no active games at the moment...',
                modalVisible: true
            })
        }
    }

    render() {
        return (
        <SafeAreaView style={styles.background}>
            
            <LoadingIndicator loading={this.state.loading} color={"#fff"} />
            <CircleHomeComponent />
            <View style={styles.imageContainer}>
                <Image
                    style={styles.image} 
                    source={require('../../../assets/alligatorGreen.png')}
                    />
            </View>
            <Text style={styles.title}>Alligator</Text>
            <Text style={styles.subHeaderText}>The Memory Party Game</Text>
            <View style={styles.headingView}>
                <TouchableOpacity style={styles.button} onPress={this.createGame}>
                    <Text style={styles.buttonText}>Create Game</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={this.joinGame}>
                    <Text style={styles.buttonText}>Join Game</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.howToPlay} onPress={() => this.props.navigation.navigate('How')}>
                    <Text style={styles.howToPlayText}>How to Play</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.howToPlay} onPress={() => this.props.navigation.navigate('Settings')}>
                    <Text style={styles.howToPlayText}>Settings</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.iconView}>
                {/* <TouchableOpacity onPress={this.shareButton}>
                    <Feather name="share-2" style={styles.icon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={this.rateApp}>
                    <Feather name="star" style={styles.icon}/>
                </TouchableOpacity> */}
                {/* <TouchableOpacity onPress={() => this.props.navigation.navigate('Settings')}>
                    <Feather name="settings" style={styles.icon} />
                </TouchableOpacity> */}
            </View>
            <SimpleModalComponent modalVisible={this.state.modalVisible} setModalVisible={this.setModalVisible} text={this.state.text} buttonText={'OK'} />
            <NotificationComponent handleNotificationResponse={this.handleNotificationResponse} backFunction={() => console.log("Do nothing")} pageId={0} />
        </SafeAreaView>
        )
    }
    
}

const styles = StyleSheet.create({
    background: {
        backgroundColor: Color.MAIN_GREEN,
        height: Dimensions.get('window').height
    },
    imageContainer: {
        marginTop: Dimensions.get('window').height * .055,
        width: Dimensions.get('window').width * .7,
        marginHorizontal: Dimensions.get('window').width * .15,
        height: Dimensions.get('window').height * .28,
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain'
    },
    title: {
        width: Dimensions.get('window').width * .9,
        marginLeft: Dimensions.get('window').width * .05,
        marginRight: Dimensions.get('window').width * .05,
        textAlign: 'center',
        color: '#fff',
        letterSpacing: Dimensions.get('window').height * .005,
        textTransform: 'uppercase',
        fontSize: Dimensions.get('window').width * .12,
        fontFamily: 'PatrickHand',
        marginBottom: Dimensions.get('window').height * .01,
    },
    subHeaderText: {
        fontSize: Dimensions.get('window').height * .03,
        textAlign: 'center',
        marginBottom: Dimensions.get('window').height * .04,
        fontFamily: 'PatrickHand',
        color: '#fff',
        opacity: .8
    },
    buttonText: {
        fontSize: Dimensions.get('window').height * .03,
        textAlign: 'center',
        color: Color.MAIN_GREEN,
        fontFamily: 'PatrickHand'
    },
    button: {
        width: Dimensions.get('window').width * .7,
        marginLeft: Dimensions.get('window').width * .15,
        marginRight: Dimensions.get('window').width * .15,
        backgroundColor: '#fff',
        marginTop: Dimensions.get('window').height * .02,
        paddingVertical: Dimensions.get('window').width * .02,
        paddingHorizontal: Dimensions.get('window').width * .05,
        borderWidth: 4,
        borderColor: Color.MAIN_GREEN,
        borderRadius: 20,
    },
    howToPlayText: {
        fontSize: Dimensions.get('window').height * .025,
        textAlign: 'center',
        color: '#fff',
        fontFamily: 'PatrickHand'
    },
    howToPlay: {
        width: Dimensions.get('window').width * .7,
        marginLeft: Dimensions.get('window').width * .15,
        marginRight: Dimensions.get('window').width * .15,
        marginTop: Dimensions.get('window').height * .02,
        paddingVertical: Dimensions.get('window').width * .012,
        paddingHorizontal: Dimensions.get('window').width * .03,
        borderWidth: 3,
        borderColor: '#fff',
        borderRadius: 15,
    },
    iconView: {
        marginTop: Dimensions.get('window').height * .04,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    icon: {
        color: '#fff',
        marginHorizontal: Dimensions.get('window').width * .04,
        fontSize: Dimensions.get('window').height * .04,
    },
    activityIndicator: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },
})

export default HomeScreen