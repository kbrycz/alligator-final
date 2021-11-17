import React from 'react'
import {View, StyleSheet, Text, SafeAreaView, KeyboardAvoidingView, TextInput, Dimensions, Image, TouchableOpacity, Keyboard} from 'react-native'
import api from '../../api/server'
import * as Color from '../../../global/colors'
import AsyncStorage from '@react-native-async-storage/async-storage'
import HideKeyboard from '../../components/general/HideKeyboard'
import global from '../../../global'
import LoadingIndicator from '../../components/general/LoadingIndicator'
import uuid from 'react-native-uuid'

class AuthScreen extends React.Component {

    constructor() {
        super()
        this.state = {
            name: '',
            errorMessage: '',
            loading: false
        }
    }


    // Sets the first name of the user
    setName = (name_in) => {
        this.setState({
            name: name_in,
            errorMessage: ''
        })
    }

    // Makes sure that the given string only has letters
    // Used for names
    onlyLetters(str) {
        const reg = new RegExp("^[A-Za-z ]+$")
        return reg.test(str)
    }


    // Attempts to sign up the user to the app. If succeeds, transfers to home
    // screen. If fails, it will set errorMessage to an error message
    goToGame = async () => {
        this.setState({loading: true})
        console.log(this.state.name)
        let id = uuid.v4()

        // Make sure names are only letters
        if (!this.onlyLetters(this.state.name)) {
            this.setState({
                errorMessage: 'Name must consist of only letters',
                loading: false
            })
            return
        }
        else if (this.state.name.length < 2) {
            this.setState({
                errorMessage: 'Name must be longer',
                loading: false
            })
            return
        }

        // Set player data in async storage as well
        await AsyncStorage.setItem('name', this.state.name)
        await AsyncStorage.setItem('id', id)

        // Set global property
        global.name = this.state.name
        global.id = id

        console.log("got heer")
        // Send to main screen
        this.props.navigation.navigate('Home', { screen: 'Main' })
    }

    render() {
        return (
            <SafeAreaView>
                <LoadingIndicator loading={this.state.loading} color={Color.MAIN_GREEN} />
                <HideKeyboard>
                    <KeyboardAvoidingView behavior='position'>
                        <View style={styles.imageContainer}>
                            <Image
                                style={styles.image} 
                                source={require('../../../assets/alligatorGreen.png')}
                                />
                        </View>
                        <Text style={styles.header}>Enter your name to play!</Text>
                        <TextInput

                                    autoCompleteType="name"
                                    keyboardType="default"
                                    textContentType='givenName'
                                    autoCorrect={true}
                                    style={styles.textInput}
                                    returnKeyType="done"
                                    maxLength={10}
                                    value={this.state.name}
                                    placeholder='Your name'
                                    onChangeText={this.setName} />
                        {
                            this.state.errorMessage === ''
                            ? null
                            : <Text style={styles.errorMessage}>{this.state.errorMessage}</Text>
                        }
                        <TouchableOpacity style={styles.button} onPress={this.goToGame}>
                            <Text style={styles.buttonText}>Play</Text>
                        </TouchableOpacity>
                    </KeyboardAvoidingView>
                </HideKeyboard>
            </SafeAreaView>
        )
    }
    
}

const styles = StyleSheet.create({
    textInput: {
        fontFamily: 'PatrickHand',
        width: Dimensions.get('window').width * .9,
        marginLeft: Dimensions.get('window').width * .05,
        marginRight: Dimensions.get('window').width * .05,
        marginBottom: Dimensions.get('window').height * .015,
        padding: Dimensions.get('window').height * .02,
        fontSize: Dimensions.get('window').height * .02,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: 'rgba(0, 0, 0, .1)',
    },
    imageContainer: {
        width: Dimensions.get('window').width * .8,
        marginLeft: Dimensions.get('window').width * .1,
        marginRight: Dimensions.get('window').width * .1,
        height: Dimensions.get('window').height * .2,
        marginVertical: Dimensions.get('window').height * .03,
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode:'contain',
    },
    button: {
        width: Dimensions.get('window').width * .9,
        marginLeft: Dimensions.get('window').width * .05,
        marginRight: Dimensions.get('window').width * .05,
        marginBottom: Dimensions.get('window').height * .015,
        padding: Dimensions.get('window').height * .02,
        borderWidth: 4,
        borderRadius: 10,
        borderColor: Color.SECOND_GREEN,
        backgroundColor: Color.MAIN_GREEN,
    },
    buttonText: {
        fontFamily: 'PatrickHand',
        fontSize: Dimensions.get('window').height * .02,
        textAlign: 'center',
        color: '#fff',
    },
    errorMessage: {
        fontFamily: 'PatrickHand',
        marginTop: Dimensions.get('window').height * .01,
        marginBottom: Dimensions.get('window').height * .02,
        textAlign: 'center',
        fontSize: Dimensions.get('window').height * .018,
        color: Color.ERROR
    },

    header: {
        width: Dimensions.get('window').width * .7,
        marginHorizontal: Dimensions.get('window').width * .15,
        marginBottom: Dimensions.get('window').height * .07,
        textAlign: 'center',
        color: Color.MAIN_GREEN,
        letterSpacing: Dimensions.get('window').width * .01,
        textTransform: 'capitalize',
        fontSize: Dimensions.get('window').height * .04,
        fontFamily: 'PatrickHand',
        lineHeight: Dimensions.get('window').height * .06,
    },
})

export default AuthScreen