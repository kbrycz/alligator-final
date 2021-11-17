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
            name: '',
            errorMessage: '',
            successMessage: '',
            loading: ''
        }
    }


    // Sets the users main info
    componentDidMount() {
        this.setState({
            name: global.name,
        })
    }

    // Set the first name of the user
    setName = (n) => {
        this.setState({name: n, errorMessage: '', successMessage: ''})
    }

    // Makes sure that the given string only has letters
    // Used for names
    onlyLetters(str) {
        const reg = new RegExp("^[A-Za-z ]+$")
        return reg.test(str)
    }

    // Change the account info of the user
    changeAccountInfo = async () => {
        console.log(this.state.name)
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

        await AsyncStorage.removeItem('name')
        await AsyncStorage.setItem('name', this.state.name) 
        global.name = this.state.name
        this.setState({successMessage: "Successfully changed your name", errorMessage: ''})
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
                        <Text style={styles.headerText}>Change your Name</Text>
                            <View>
                                <View style={styles.container}>
                                    <TextInput
                                        maxLength={10}
                                        autoCompleteType="name"
                                        keyboardType="default"
                                        textContentType='givenName'
                                        autoCorrect={true}
                                        style={styles.textInput}
                                        returnKeyType="done"
                                        value={this.state.name}
                                        placeholder='Your new name'
                                        onChangeText={this.setName} />
                                </View>
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
        color: Color.MAIN_GREEN,
        textTransform: 'capitalize'
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