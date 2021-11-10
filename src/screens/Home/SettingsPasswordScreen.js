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

class SettingsPasswordScreen extends React.Component {

    constructor() {
        super()
        this.state = {
            first: '',
            last: '',
            username: '',
            errorMessage: '',
            successMessage: '',
            oldPassword: '',
            newPassword: '',
            passwordConfirmed: '',
            loading: false
        }
    }

    // Set the first name of the user
    setOldPassword = (p) => {
        this.setState({oldPassword: p, errorMessage: '', successMessage: ''})
    }
    
    // Set the last name of the user
    setNewPassword = (p) => {
        this.setState({newPassword: p, errorMessage: '', successMessage: ''})
    }

    // Set the username name of the user
    setPasswordConfirmed = (p) => {
        this.setState({passwordConfirmed: p, errorMessage: '', successMessage: ''})
    }

    // Change the account info of the user
    changePassword = async () => {
        this.setState({loading: true})

        const oldPassword = this.state.oldPassword
        const newPassword = this.state.newPassword
        const id = global.id

        // If the confirmed doesn't match new password
        if (this.state.passwordConfirmed !== newPassword) {
            this.setState({
                errorMessage: 'Passwords do not match',
                loading: false
            })
            return
        }

        try {
            // Begin trying to send the users data to the server to see 
            // if they can create an account
            const response = await api.post('/changePassword', {
              id, oldPassword, newPassword
            })
      
            // Set the token in Async storage so user will log in automatically
            await AsyncStorage.removeItem('token')
            await AsyncStorage.setItem('token', response.data.token)
      
            // Show user a success message
            console.log("Successfully updated password")
            this.setState({
                successMessage: 'Sucessfully updated password', 
                errorMessage: '',
                oldPassword: '',
                newPassword: '',
                passwordConfirmed: '',
                loading: false
            })
          } 
          catch (err) {
            this.setState({
              errorMessage: 'Something went wrong with updating your password',
              successMessage: '',
              oldPassword: '',
              newPassword: '',
              passwordConfirmed: '',
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
                        <Text style={styles.headerText}>Password</Text>
                            <View>
                            <TextInput
                                ref={(input) => { this.oldPasswordField = input; }}
                                onSubmitEditing={() => { 
                                    this.newPassword.focus(); 
                                }}
                                style={styles.textInput}
                                autoCompleteType="password"
                                secureTextEntry={true}
                                keyboardType="default"
                                textContentType="password"
                                autoCorrect={false}
                                returnKeyType="done"
                                value={this.state.oldPassword}
                                placeholder={"Old Password"}
                                onChangeText={this.setOldPassword} />
                            <TextInput
                                ref={(input) => { this.newPassword = input; }}
                                onSubmitEditing={() => { 
                                    this.newPasswordConfirmed.focus(); 
                                }}
                                style={styles.textInput}
                                autoCompleteType="password"
                                secureTextEntry={true}
                                keyboardType="default"
                                textContentType="password"
                                autoCorrect={false}
                                returnKeyType="done"
                                value={this.state.newPassword}
                                placeholder={"New Password"}
                                onChangeText={this.setNewPassword} />
                            <TextInput
                                ref={(input) => { this.newPasswordConfirmed = input; }}
                                onSubmitEditing={() => { 
                                    Keyboard.dismiss() 
                                }}
                                style={styles.textInput}
                                autoCompleteType="password"
                                secureTextEntry={true}
                                keyboardType="default"
                                textContentType="password"
                                autoCorrect={false}
                                returnKeyType="done"
                                value={this.state.passwordConfirmed}
                                placeholder={"Confirm New Password"}
                                onChangeText={this.setPasswordConfirmed} />
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
                                <TouchableOpacity style={styles.button} onPress={this.changePassword}>
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

export default SettingsPasswordScreen