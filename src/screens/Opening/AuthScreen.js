import React from 'react'
import {View, StyleSheet, Text, SafeAreaView, KeyboardAvoidingView, TextInput, Dimensions, Image, TouchableOpacity, Keyboard} from 'react-native'
import api from '../../api/server'
import * as Color from '../../../global/colors'
import AsyncStorage from '@react-native-async-storage/async-storage'
import HideKeyboard from '../../components/general/HideKeyboard'
import global from '../../../global'
import LoadingIndicator from '../../components/general/LoadingIndicator'


class AuthScreen extends React.Component {

    constructor() {
        super()
        this.state = {
            first: '',
            last: '',
            username: '',
            password: '',
            confirmPassword: '',
            isLogin: false,
            errorMessage: '',
            loading: false
        }
    }

    // Sets the username of the user
    setUsername = (user_in) => {
        this.setState({
            username: user_in,
            errorMessage: ''
        })
    }

    // Sets the password of the user
    setPassword = (pass_in) => {
        this.setState({
            password: pass_in,
            errorMessage: ''
        })
    }

    // Sets the confirmed password of the user
    setConfirmedPassword = (pass_in) => {
        this.setState({
            confirmPassword: pass_in,
            errorMessage: ''
        })
    }

    // Sets the first name of the user
    setFirst = (first_in) => {
        this.setState({
            first: first_in,
            errorMessage: ''
        })
    }

    // Sets the last name of the user
    setLast = (last_in) => {
        this.setState({
            last: last_in,
            errorMessage: ''
        })
    }

    // Figures out if login or sign up was pressed, and calls appropriate function
    bigButtonPressed = () => {
        this.setState({
            loading: true
        })
        if (this.state.isLogin) {
            this.login()
        } else {
            this.signup()
        }
    }

    // Switches the login or signup screen to the other, and clears all the fields
    littleButtonPressed = () => {
        this.setState({
            isLogin: !this.state.isLogin,
            first: '',
            last: '',
            username: '',
            password: '',
            confirmPassword: '',
            errorMessage: ''
        })
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

    // Attempts to log the user into the app. If succeeds, transfers to home
    // screen. If fails, it will set errorMessage to an error message
    login = async () => {

        // Create variables so easier to read
        const username = this.state.username
        const password = this.state.password

        try {
            // Send the users data to the server to see if they can create an account
            const response = await api.post('/signin', {username, password})

            if (!response) {
                this.setState({
                    errorMessage: 'Invalid email or password',
                    loading: false
                  })
                  return
            }
      
            // Set the token in Async storage so user will log in automatically
            await AsyncStorage.setItem('token', response.data.token)

            // Set player data in async storage as well
            await AsyncStorage.setItem('first', response.data.first)
            await AsyncStorage.setItem('last', response.data.last)
            await AsyncStorage.setItem('username', response.data.username)
            await AsyncStorage.setItem('id', response.data.id)

            // Set global variables
            global.first = response.data.first,
            global.last = response.data.last,
            global.username = response.data.username,
            global.id = response.data.id
      
            // Reset error message 
            this.setState({
              errorMessage: '',
              loading: false
            })
            
            // Navigate to the main screen now that you are signed in
            console.log("Successfully logged into account")
            this.props.navigation.navigate('Home', { screen: 'Main' })
          } 
          catch (err) {
            this.setState({
              errorMessage: 'Invalid email or password',
              loading: false
            })
          }
        
    }

    // Attempts to sign up the user to the app. If succeeds, transfers to home
    // screen. If fails, it will set errorMessage to an error message
    signup = async () => {

        // Create variables so easier to read
        const username = this.state.username
        const password = this.state.password
        const confirmPassword = this.state.confirmPassword
        const first = this.state.first.replace(/\s+/g, '')
        const last = this.state.last.replace(/\s+/g, '')

        // Make sure names are only letters
        if (!this.onlyLetters(first) || !this.onlyLetters(last)) {
            this.setState({
                errorMessage: 'Name must consist of only letters',
                loading: false
            })
            return
        }

        // Check and make sure the user's password and confirm password match
        if (password !== confirmPassword) {
            this.setState({
                errorMessage: 'Passwords do not match',
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

        // Make sure username is only letters and numbers
        if (username.length < 5) {
            this.setState({
                errorMessage: 'Username must be longer',
                loading: false
            })
            return
        }

        // Make sure username is only letters and numbers
        if (password.length < 5) {
            this.setState({
                errorMessage: 'Password must be longer',
                loading: false
            })
            return
        }

        try {
            // Begin trying to send the users data to the server to see 
            // if they can create an account
            const response = await api.post('/signup', {
              username, password, first, last
            })

            if (!response) {
                this.setState({
                    errorMessage: 'Something went wrong with signup',
                    loading: false
                  })
                  return
            }

            if ('error' in response.data) {
                if (response.data.error.toString() === '11000') {
                    this.setState({
                        errorMessage: 'Username already in use',
                        loading: false
                    })
                } else {
                    this.setState({
                        errorMessage: 'Something went wrong with signup',
                        loading: false
                    })
                }
                console.log("inside error room")
                return
            }
      
            // Set the token in Async storage so user will log in automatically
            await AsyncStorage.setItem('token', response.data.token)

            // Set player data in async storage as well
            await AsyncStorage.setItem('first', first)
            await AsyncStorage.setItem('last', last)
            await AsyncStorage.setItem('username', username)
            await AsyncStorage.setItem('id', response.data.id)

            // sets global variables
            global.first = first,
            global.last = last,
            global.username = username,
            global.id = response.data.id
      
            // Reset error message 
            this.setState({
              errorMessage: '',
              loading: false
            })
      
            // Navigate to the main screen now that you are signed in
            console.log("Successfully created an account")
            this.props.navigation.navigate('Home', { screen: 'Main' })
          } 
          catch (err) {
            console.log(err)
            this.setState({
              errorMessage: 'Something went wrong with signup',
              loading: false
            })
          }
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
                        {
                            !this.state.isLogin
                            ? 
                            (<View style={styles.container}>
                                <TextInput
                                    onSubmitEditing={() => { this.lastNameField.focus(); }}
                                    autoCompleteType="name"
                                    keyboardType="default"
                                    textContentType='givenName'
                                    autoCorrect={true}
                                    style={[styles.textInput, styles.left]}
                                    returnKeyType="done"
                                    maxLength={12}
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
                                    maxLength={12}
                                    style={[styles.textInput, styles.right]}
                                    returnKeyType="done"
                                    value={this.state.last}
                                    placeholder='Last'
                                    onChangeText={this.setLast} />
                            </View>)
                        : null
                        }
                        
                        <TextInput
                            ref={(input) => { this.usernameField = input; }}
                            onSubmitEditing={() => { this.passwordField.focus(); }}
                            blurOnSubmit={false}
                            textContentType="username"
                            maxLength={16}
                            autoCompleteType='off'
                            autoCorrect={false}
                            style={styles.textInput}
                            keyboardType="default"
                            returnKeyType="done"
                            value={this.state.username}
                            placeholder='Username'
                            onChangeText={this.setUsername} />
                        <TextInput
                            ref={(input) => { this.passwordField = input; }}
                            onSubmitEditing={() => { 
                                if (!this.state.isLogin) {
                                    this.confirmField.focus(); 
                                }
                            }}
                            style={styles.textInput}
                            autoCompleteType="password"
                            secureTextEntry={true}
                            keyboardType="default"
                            textContentType="password"
                            autoCorrect={false}
                            returnKeyType="done"
                            value={this.state.password}
                            placeholder={"Password"}
                            onChangeText={this.setPassword} />
                        {
                            this.state.isLogin
                            ? null
                            : <TextInput
                            ref={(input) => { this.confirmField = input; }}
                            style={styles.textInput}
                            autoCompleteType="password"
                            secureTextEntry={true}
                            keyboardType="default"
                            textContentType="password"
                            autoCorrect={false}
                            returnKeyType="done"
                            value={this.state.confirmPassword}
                            placeholder={"Confirm Password"}
                            onChangeText={this.setConfirmedPassword} />
                        }
                        {
                            this.state.errorMessage === ''
                            ? null
                            : <Text style={styles.errorMessage}>{this.state.errorMessage}</Text>
                        }

                        <TouchableOpacity style={styles.button} onPress={this.bigButtonPressed}>
                            {
                                this.state.isLogin
                                ? <Text style={styles.buttonText}>Log in</Text>
                                : <Text style={styles.buttonText}>Sign up</Text>
                            }
                            
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.littleButtonPressed}>
                            {
                                this.state.isLogin
                                ? <Text style={styles.otherButtonText}>Don't have an account? Sign up</Text>
                                : <Text style={styles.otherButtonText}>Already have an account? Log in</Text>
                            }
                            
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
    otherButtonText: {
        fontFamily: 'PatrickHand',
        textAlign: 'center',
        marginTop: Dimensions.get('window').height * .01,
        fontSize: Dimensions.get('window').height * .018,
    },
    errorMessage: {
        fontFamily: 'PatrickHand',
        marginTop: Dimensions.get('window').height * .01,
        marginBottom: Dimensions.get('window').height * .02,
        textAlign: 'center',
        fontSize: Dimensions.get('window').height * .018,
        color: Color.ERROR
    },
    container: {
        flexDirection: 'row'
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
    }
})

export default AuthScreen