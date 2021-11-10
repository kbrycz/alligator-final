import React from 'react'
import {View, StyleSheet, Text, TouchableOpacity, Dimensions, TextInput, KeyboardAvoidingView, Keyboard} from 'react-native'
import * as Color from '../../../global/colors'
import Circle1Component from '../../components/auth/circles/Circle1Component'
import HideKeyboard from '../../components/general/HideKeyboard'
import global from '../../../global'
import AsyncStorage from '@react-native-async-storage/async-storage'
import api from '../../api/server'
import { Feather } from '@expo/vector-icons'; 
import LoadingIndicator from '../../components/general/LoadingIndicator'

class SettingsAccountInfoScreen extends React.Component {

    constructor() {
        super()
        this.state = {
            first: '',
            last: '',
            username: '',
            errorMessage: '',
            successMessage: '',
            loading: ''
        }
    }


    // Sets the users main info
    componentDidMount() {
        this.setState({
            first: global.first,
            last: global.last,
            username: global.username
        })
    }

    // Set the first name of the user
    setFirst = (f) => {
        this.setState({first: f, errorMessage: '', successMessage: ''})
    }
    
    // Set the last name of the user
    setLast = (l) => {
        this.setState({last: l, errorMessage: '', successMessage: ''})
    }

    // Set the username name of the user
    setUsername = (u) => {
        this.setState({username: u, errorMessage: '', successMessage: ''})
    }

    // Makes sure that given string only has letters and numbers
    // Used for usernames
    onlyLettersAndNumbers(str) {
        const reg = new RegExp("^[A-Za-z0-9]+$")
        return reg.test(str)
    }

    // Makes sure that the given string only has letters
    // Used for names
    onlyLetters(str) {
        const reg = new RegExp("^[A-Za-z]+$")
        return reg.test(str)
    }

    // Change the account info of the user
    changeAccountInfo = async () => {

        this.setState({loading: true})

        // Create variables so easier to read
        const username = this.state.username
        const first = this.state.first.replace(/\s+/g, '')
        const last = this.state.last.replace(/\s+/g, '')
        const id = global.id
        const oldUsername = global.username

        // Make sure names are only letters
        if (!this.onlyLetters(first) || !this.onlyLetters(last)) {
            this.setState({
                errorMessage: 'Name must consist of only letters',
                loading: false
            })
            return
        }

        // Make sure username is only letters and numbers
        if (!this.onlyLettersAndNumbers(username)) {
            this.setState({
                errorMessage: 'Username must be only letters and numbers',
                loading: false
            })
            return
        }

        try {
            // Begin trying to send the users data to the server to see 
            // if they can create an account
            const response = await api.post('/changeAccountInfo', {
              username, first, last, id, oldUsername
            })

            if ('error' in response.data) {
                this.setState({
                    errorMessage: response.data.error,
                    loading: false
                })
                return
            }
      
            // Set the token in Async storage so user will log in automatically
            await AsyncStorage.removeItem('token')
            await AsyncStorage.removeItem('first')
            await AsyncStorage.removeItem('last')
            await AsyncStorage.removeItem('username')
            await AsyncStorage.setItem('token', response.data.token)

            // Set player data in async storage as well
            await AsyncStorage.setItem('first', first)
            await AsyncStorage.setItem('last', last)
            await AsyncStorage.setItem('username', username)

            // Update global variables
            global.username = username
            global.first = first
            global.last = last
      
            // Show user a success message
            console.log("Successfully updated account")
            this.setState({successMessage: 'Sucessfully updated account', errorMessage: '', loading: false})
          } 
          catch (err) {
            this.setState({
              errorMessage: 'Something went wrong with updating your account',
              successMessage: '',
              loading: false
            })
          }
    }

    render() {
        return (
            <View>
                <LoadingIndicator loading={this.state.loading} color={Color.MAIN_GREEN} />
                <TouchableOpacity style={styles.iconContainer} onPress={() => this.props.navigation.goBack()} >
                    <Feather name="arrow-left" style={styles.back} />
                </TouchableOpacity>
                <Circle1Component />
                <HideKeyboard>
                    <KeyboardAvoidingView behavior='position'>
                        <Text style={styles.headerText}>Account Information</Text>
                            <View>
                                <View style={styles.container}>
                                    <TextInput
                                        onSubmitEditing={() => { this.lastNameField.focus(); }}
                                        autoCompleteType="name"
                                        keyboardType="default"
                                        textContentType='givenName'
                                        autoCorrect={true}
                                        style={[styles.textInput, styles.left]}
                                        returnKeyType="done"
                                        value={this.state.first}
                                        placeholder='First'
                                        onChangeText={this.setFirst} />
                                    <TextInput
                                        ref={(input) => { this.lastNameField = input; }}
                                        onSubmitEditing={() => { this.usernameField.focus(); }}
                                        autoCompleteType="name"
                                        keyboardType="default"
                                        textContentType='familyName'
                                        autoCorrect={true}
                                        style={[styles.textInput, styles.right]}
                                        returnKeyType="done"
                                        value={this.state.last}
                                        placeholder='Last'
                                        onChangeText={this.setLast} />
                                </View>
                                <TextInput
                                    ref={(input) => { this.usernameField = input; }}
                                    onSubmitEditing={() => { Keyboard.dismiss() }}
                                    blurOnSubmit={false}
                                    textContentType="username"
                                    autoCompleteType='off'
                                    autoCorrect={false}
                                    style={styles.textInput}
                                    keyboardType="default"
                                    returnKeyType="done"
                                    value={this.state.username}
                                    placeholder='Username'
                                    onChangeText={this.setUsername} />
                                {
                                    this.state.errorMessage === ''
                                    ? null
                                    : <Text style={styles.errorMessage}>{this.state.errorMessage}</Text>
                                }
                                {
                                    this.state.successMessage === ''
                                    ? null
                                    : <Text style={styles.successMessage}>{this.state.successMessage}</Text>
                                }
                                <TouchableOpacity style={styles.button} onPress={this.changeAccountInfo}>
                                    <Text style={styles.buttonText}>Update</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.button2} onPress={() => {this.props.navigation.goBack()}}>
                                    <Text style={styles.buttonText2}>Return</Text>
                                </TouchableOpacity>
                            </View>
                    </KeyboardAvoidingView>
                </HideKeyboard>
                
                
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
        color: Color.MAIN_GREEN,
        position: 'absolute',
        top: 15,
        left: Dimensions.get('window').width * .03,
    },
    container: {
        flexDirection: 'row'
    },
    headerText: {
        marginTop: Dimensions.get('window').height * .1,
        marginBottom: Dimensions.get('window').height * .05,
        marginLeft: Dimensions.get('window').width * .12,
        marginRight: Dimensions.get('window').width * .12,
        lineHeight: Dimensions.get('window').height * .08,
        textAlign: 'center',
        fontSize: Dimensions.get('window').height * .06,
        fontFamily: 'PatrickHand',
        color: Color.MAIN_GREEN
    },

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

    left: {
        marginLeft: Dimensions.get('window').width * .05,
        marginRight: Dimensions.get('window').width * .015,
        flex: 1,
    },
    right: {
        marginRight: Dimensions.get('window').width * .05,
        marginLeft: Dimensions.get('window').width * .015,
        flex: 1,
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
    button2: {
        width: Dimensions.get('window').width * .9,
        marginLeft: Dimensions.get('window').width * .05,
        marginRight: Dimensions.get('window').width * .05,
        marginBottom: Dimensions.get('window').height * .015,
        padding: Dimensions.get('window').height * .02,
        borderWidth: 4,
        borderRadius: 10,
        borderColor: Color.SECOND_GREEN,
        backgroundColor: '#fff',
    },
    buttonText2: {
        fontFamily: 'PatrickHand',
        fontSize: Dimensions.get('window').height * .02,
        textAlign: 'center',
        color: Color.MAIN_GREEN,
    },
    errorMessage: {
        fontFamily: 'PatrickHand',
        marginTop: Dimensions.get('window').height * .01,
        marginBottom: Dimensions.get('window').height * .02,
        textAlign: 'center',
        fontSize: Dimensions.get('window').height * .018,
        color: Color.ERROR
    },
    successMessage: {
        fontFamily: 'PatrickHand',
        marginTop: Dimensions.get('window').height * .01,
        marginBottom: Dimensions.get('window').height * .02,
        textAlign: 'center',
        fontSize: Dimensions.get('window').height * .018,
        color: Color.MAIN_GREEN
    },
})

export default SettingsAccountInfoScreen