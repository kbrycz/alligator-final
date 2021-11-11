import React from 'react'
import {View, StyleSheet, Text, TouchableOpacity, Dimensions, SafeAreaView, FlatList} from 'react-native'
import * as Color from '../../../global/colors'
import CircleHomeComponent from '../../components/auth/circles/CircleHomeComponent'
import { Feather } from '@expo/vector-icons'; 
import AnswersListComponent from '../../components/Game/AnswersListComponent';
import NotificationComponent from '../../components/general/NotificationComponent';
import SimpleModalComponent from '../../components/modal/SimpleModalComponent';

class PlayerScreen extends React.Component {

    constructor() {
        super()
        this.state = {
            player: {},
            code: '',
            score: 0,
            total: 0, 
            text: '',
            word: '',
            modalVisible: false,
            isActive: false
        }
    }

    // Gets the player from the route and sets notification status to active
    componentDidMount() {
        this.setState({
            player: this.props.route.params.player,
            word: this.props.route.params.word,
            isActive: true
        }, () => {
            this.getScoreAndTotal()
        })
    }

    // Get the score and total variables from the player object
    getScoreAndTotal = () => {
        let score = 0;
        let total = 0;
        for (let i = 0; i < this.state.player.answers.length; ++i) {
            if (this.state.player.answers[i].isCorrect) {
                score += 1
            }
            total += 1
        }
        this.setState({
            score: score,
            total: total
        })
    }

    // Gets the blackout text based on the players average
    blackoutText = () => {
        let number = this.state.score / this.state.total
        if (number < .34) {
            return <Text style={styles.blackout}>Blacked out!</Text>
        }
        else if (number < .67) {
            return <Text style={styles.blackout}>Almost blacked out!</Text>
        }
        else {
            return <Text style={styles.blackout}>Didn't black out!</Text>
        }
    }

    // Sets the modal visible to true
    setModalVisible = (isVis) => {
        this.setState({modalVisible: isVis})
    }

    // handle the notification response when user clicks on the notification
    handleNotificationResponse = async (response, pageId) => {
        if (pageId === 3 && this.state.isActive) {
            console.log("in players notif")
            this.setState({
                text: 'You have no active games at the moment...',
                modalVisible: true
            })
        }
    }
    
    // Go back to the previous page
    goBack = () => {
        this.setState({isActive: false})
        this.props.navigation.goBack()
    }

    render() {
        return (
            <View style={styles.background}>
                <CircleHomeComponent />
                <SafeAreaView>
                    <TouchableOpacity onPress={this.goBack} >
                        <Feather name="arrow-left" style={styles.back} />
                    </TouchableOpacity>  
                    <Text style={styles.headerText}>{this.state.player.name}</Text>
                    <Text style={styles.usernameText}>"{this.state.word}"</Text>
                    <FlatList
                        data={this.state.player.answers}
                        renderItem={({ item, index }) => (
                            <AnswersListComponent guess={item} index={index} />
                        )}
                        keyExtractor={item => item.round.toString()}
                        style={styles.list} />
                    <Text style={styles.scoreText}>{this.state.score} / {this.state.total}</Text>
                    {this.blackoutText()}
                    <SimpleModalComponent modalVisible={this.state.modalVisible} setModalVisible={this.setModalVisible} text={this.state.text} buttonText="OK" />
                    <NotificationComponent handleNotificationResponse={this.handleNotificationResponse} backFunction={() => console.log("Do nothing")} pageId={3} />
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
    back: {
        fontSize: Dimensions.get('window').height * .04,
        color: '#fff',
        position: 'absolute',
        top: 0,
        left: Dimensions.get('window').width * .03,
    },
    headerText: {
        marginLeft: Dimensions.get('window').width * .05,
        marginRight: Dimensions.get('window').width * .05,
        marginTop: Dimensions.get('window').height * .1, 
        textAlign: 'center',
        fontSize: Dimensions.get('window').height * .05,
        fontFamily: 'PatrickHand',
        color: '#fff',
        textTransform: 'capitalize'
    },
    scoreText: {
        marginTop: Dimensions.get('window').height * .025, 
        textAlign: 'center',
        fontSize: Dimensions.get('window').height * .025,
        fontFamily: 'PatrickHand',
        color: 'rgba(255, 255, 255, .8)',
        textTransform: 'capitalize'
    },
    usernameText: {
        marginTop: Dimensions.get('window').height * .01, 
        textAlign: 'center',
        fontSize: Dimensions.get('window').height * .025,
        fontFamily: 'PatrickHand',
        color: 'rgba(255, 255, 255, .8)',
        textTransform: 'capitalize'
    },
    blackout: {
        marginLeft: Dimensions.get('window').width * .1,
        marginRight: Dimensions.get('window').width * .1,
        marginTop: Dimensions.get('window').height * .025, 
        textAlign: 'center',
        fontSize: Dimensions.get('window').height * .04,
        fontFamily: 'PatrickHand',
        color: '#fff',
    },
    list: {
        marginTop: Dimensions.get('window').height * .05,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        maxHeight: Dimensions.get('window').height * .5,
    },
})

export default PlayerScreen