import React from 'react'
import {View, StyleSheet, Text, TouchableOpacity, Dimensions, SafeAreaView} from 'react-native'
import * as Color from '../../../global/colors'
import { Feather } from '@expo/vector-icons'; 
import CodeBoxComponent from '../../components/join/CodeBoxComponent';
import global from '../../../global';
import SimpleModalComponent from '../../components/modal/SimpleModalComponent';
import uuid from 'react-native-uuid'
import CircleHomeComponent from '../../components/auth/circles/CircleHomeComponent';
import LoadingIndicator from '../../components/general/LoadingIndicator';
import NotificationComponent from '../../components/general/NotificationComponent';


class JoinScreen extends React.Component {

    constructor() {
        super()
        this.state = {
            code: '',
            modalVisible: false,
            text: '',
            localPlayer: {},
            loading: false,
            isActive: false
        }
    }

    // Calls socket functions while also making sure state is active for notifications
    componentDidMount() {
        this.setState({isActive: true})
        this.socketFunctions()
    }

    // Socket functions if message is sent from the server
    socketFunctions = () => {

        // If the room was not found
        global.socket.on('roomNotFound', (isNotFound) => {
            if (isNotFound === 0) {
                this.setState({
                    text: 'Unable to find game. Make sure you typed in the code correctly!',
                    loading: false
                }, () => {
                    this.setCode('')
                    this.setModalVisible(true)
                })
            }
            else if (isNotFound === 1) {
                this.setState({
                    text: 'Game is already full. Please try another game!',
                    loading: false
                }, () => {
                    this.setCode('')
                    this.setModalVisible(true)
                })
            }
            else {
                this.setState({
                    text: 'This game has already started! Please try a different code!',
                    loading: false
                }, () => {
                    this.setCode('')
                    this.setModalVisible(true)
                })
            }
        })

        // Gives the player the correct information and sends them to lobby
        global.socket.on('updatePlayersArray', (players) => {
            console.log("giving the new player the correct players array and sending to lobby")
            this.setState({loading: false, isActive: false})
            this.props.navigation.navigate('Lobby', {code: this.state.code, players: players, isHost: false, localPlayer: this.state.localPlayer})
        })
    }

    // Updates the code variable
    setCode = (code_in) => {
        this.setState({code: code_in})
    }

    // Updates the modalVisible variable
    setModalVisible = (isVisible) => {
        this.setState({modalVisible: isVisible})
    }

    // Connect to server and see if roomname is even available
    checkRoomName = () => {
        this.setState({loading: true})
        let player = {
            id: global.id,
            socketId: global.socket.id,
            name: global.name,
            isHost: false,
            answers: []
        }
        let obj = {
            player : player,
            code: this.state.code
        }
        this.setState({
            localPlayer: player
        }, () => {
            try {
                global.socket.emit('isRoomAvailable', obj);
            }
            catch (err) {
                this.setState({loading: false, text: 'There was a problem finding the room. Please try again!',})
            }
        })
       
    }

    // handle the notification response when user clicks on the notification
    handleNotificationResponse = async (response, pageId) => {
        if (pageId === 1 && this.state.isActive) {
            console.log("in join notif")
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
                <SafeAreaView style={styles.safeView}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()} >
                        <Feather name="arrow-left" style={styles.back} />
                    </TouchableOpacity>  
                    <Text style={styles.title}>Enter the Game Code</Text>
                    <CodeBoxComponent setValue={this.setCode} value={this.state.code} />
                    <Text style={styles.paragraph}>Don't have a code? Someone has to create a game first! They will see a code when the game is created!</Text>
                    <View style={styles.playButtonContainer}>
                        <TouchableOpacity onPress={this.checkRoomName}>
                            <Text style={styles.playButton}>Join</Text>
                        </TouchableOpacity> 
                    </View>
                    <SimpleModalComponent modalVisible={this.state.modalVisible} setModalVisible={this.setModalVisible} text={this.state.text} buttonText="OK" />
                    <NotificationComponent handleNotificationResponse={this.handleNotificationResponse} backFunction={() => console.log("Do nothing")} pageId={1} />
                </SafeAreaView>
            </View>
            
        )
    }
}

const styles = StyleSheet.create({
    safeView: {
        flex: 1
    },
    background: {
        backgroundColor: Color.MAIN_GREEN,
        height: Dimensions.get('window').height,
        flexDirection: 'column',
    },
    back: {
        fontSize: Dimensions.get('window').height * .04,
        color: '#fff',
        position: 'absolute',
        top: 0,
        left: Dimensions.get('window').width * .03,
    },
    playButtonContainer: {
        position: 'absolute',
        bottom: 50,
    },
    playButton: {
        width: Dimensions.get('window').width * .8,
        marginLeft: Dimensions.get('window').width * .1,
        marginRight: Dimensions.get('window').width * .1,
        marginBottom: Dimensions.get('window').height * .02,
        color: Color.MAIN_GREEN,
        fontSize: Dimensions.get('window').height * .035,
        textAlign: 'center',
        borderWidth: 1,
        borderColor: Color.MAIN_GREEN,
        borderRadius: 10,
        backgroundColor: '#fff',
        padding: Dimensions.get('window').height * .01,
        overflow: 'hidden',
        fontFamily: 'PatrickHand'
    },
    title: {
        width: Dimensions.get('window').width * .8,
        marginLeft: Dimensions.get('window').width * .1,
        marginRight: Dimensions.get('window').width * .1,
        marginBottom: Dimensions.get('window').height * .07,
        marginTop: Dimensions.get('window').height * .1,
        textAlign: 'center',
        color: '#fff',
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: {width: -2, height: 2},
        textShadowRadius: 3,
        fontSize: Dimensions.get('window').height * .07,
        fontFamily: 'PatrickHand'
    },
    paragraph: {
        width: Dimensions.get('window').width * .8,
        marginLeft: Dimensions.get('window').width * .1,
        marginRight: Dimensions.get('window').width * .1,
        marginBottom: Dimensions.get('window').height * .2,
        textAlign: 'justify',
        color: '#fff',
        fontSize: Dimensions.get('window').height * .025,
        fontFamily: 'PatrickHand',
        lineHeight: Dimensions.get('window').height * .04
    },
})

export default JoinScreen