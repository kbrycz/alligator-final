import React from 'react'
import {View, StyleSheet, Text, TouchableOpacity, Dimensions} from 'react-native'
import * as Color from '../../../global/colors'
import Circle1Component from '../../components/auth/circles/Circle1Component'
import global from '../../../global'
import { Feather } from '@expo/vector-icons'; 

class SettingsAboutScreen extends React.Component {

    constructor() {
        super()
        this.state = {
        }
    }

    render() {
        return (
            <View>
                <TouchableOpacity style={styles.iconContainer} onPress={() => this.props.navigation.goBack()} >
                    <Feather name="arrow-left" style={styles.back} />
                </TouchableOpacity>
                <Circle1Component />
                <Text style={styles.headerText}>About</Text>
                <Text style={styles.version}>{global.version}</Text>
                <Text style={styles.p}>Alligator Games LLC is a Chicago based company specializing in party games. Our mission
                                        is to bring joy to our users through group party games. </Text>
                <Text style={styles.p}>"Alligator - The Memory Party Game" is our second game released to the app store! Although it was not the first game released,
                                        we decided to name the company after it because it was the first game in development and marks the start of our journey!</Text>
                <Text style={styles.p}>Come learn more about us at https://alligator.games! More games are on the way! Keep an eye out for our releases!</Text>
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
    version: {
        marginTop: Dimensions.get('window').height * .005,
        textAlign: 'center',
        fontSize: Dimensions.get('window').height * .03,
        fontFamily: 'PatrickHand',
        color: Color.MAIN_GREEN,
        marginBottom: Dimensions.get('window').height * .05,
    },
    p: {
        marginLeft: Dimensions.get('window').width * .1,
        marginRight: Dimensions.get('window').width * .1,
        marginBottom: Dimensions.get('window').height * .04,
        textAlign: 'justify',
        fontSize: Dimensions.get('window').height * .025,
        fontFamily: 'PatrickHand',
        color: Color.MAIN_GREEN
    },
    
})

export default SettingsAboutScreen