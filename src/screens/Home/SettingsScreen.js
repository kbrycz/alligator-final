import React from 'react'
import {View, StyleSheet, Text, TouchableOpacity, Dimensions} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Color from '../../../global/colors'
import Circle1Component from '../../components/auth/circles/Circle1Component'
import * as Notifications from 'expo-notifications';
import LoadingIndicator from '../../components/general/LoadingIndicator'

class SettingsScreen extends React.Component {

    constructor() {
        super()
        this.state = {
            loading: false
        }
    }

    // Signout of the app by removing the token and
    // navigating the user back to the login screen
    signout = async () => {
        this.setState({loading: true}, async () => {
            await AsyncStorage.removeItem('name')
            await AsyncStorage.removeItem('id')
            this.setState({
                loading: false
            })
            this.props.navigation.navigate('Open', { screen: 'Opening' })
        })

    }

    render() {
        return (
            <View>
                <Circle1Component />
                <LoadingIndicator loading={this.state.loading} color={Color.MAIN_GREEN} />
                <Text style={styles.headerText}>Settings</Text>
                <TouchableOpacity style={styles.changeInfo} onPress={() => {this.props.navigation.navigate('AccountInfo')}}>
                    <Text style={styles.changeText}>Change Your Name</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.changeInfoPassword} onPress={() => {this.props.navigation.navigate('About')}}>
                    <Text style={styles.changeText}>About</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.changeInfoPassword} onPress={this.signout}>
                    <Text style={styles.changeText}>Sign Out</Text>
                </TouchableOpacity>
            </View>
        )
    }
    
}

const styles = StyleSheet.create({

    changeText: {
        fontSize: Dimensions.get('window').height * .023,
        textAlign: 'center',
        color: Color.MAIN_GREEN,
        fontFamily: 'PatrickHand'
    },
    changeInfo: {
        width: Dimensions.get('window').width,
        marginTop: Dimensions.get('window').height * .04,
        paddingVertical: Dimensions.get('window').width * .1,
        paddingHorizontal: Dimensions.get('window').width * .07,
        backgroundColor: 'rgba(255, 255, 255, .5)',
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, .1)'
    },
    changeInfoPassword: {
        width: Dimensions.get('window').width,
        paddingVertical: Dimensions.get('window').width * .1,
        paddingHorizontal: Dimensions.get('window').width * .07,
        backgroundColor: 'rgba(255, 255, 255, .5)',
        borderBottomWidth: 1,
        borderColor: 'rgba(0, 0, 0, .1)'
    },
    headerText: {
        marginTop: Dimensions.get('window').height * .1,
        marginLeft: Dimensions.get('window').width * .12,
        marginRight: Dimensions.get('window').width * .12,
        lineHeight: Dimensions.get('window').height * .08,
        textAlign: 'center',
        fontSize: Dimensions.get('window').height * .06,
        fontFamily: 'PatrickHand',
        color: Color.MAIN_GREEN
    },
})

export default SettingsScreen