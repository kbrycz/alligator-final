import React from 'react'
import {View, StyleSheet, Text, Dimensions, TouchableOpacity, Image} from 'react-native'
import * as Color from '../../../global/colors'
import Circle2Component from './circles/Circle2Component'
import * as AuthStyle from '../../../styles/auth'

const SignupComponent = ({showAuthScreen}) => {

    return (
        <View style={AuthStyle.styles.headingView}>
            <Circle2Component />
            <View style={AuthStyle.styles.textContainer}>
                <Text style={AuthStyle.styles.heading}>Tonight is your night. Let's see if it's one you can remember</Text>
            </View>
            <TouchableOpacity style={styles.logoContainer} onPress={showAuthScreen}>
                <Image
                    style={styles.logo} 
                    source={require('../../../assets/alligatorClick.png')}
                    />
            </TouchableOpacity>
            <View style={AuthStyle.styles.counterContainer}>
                <Image
                    style={AuthStyle.styles.counter} 
                    source={require('../../../assets/opening/counter4.png')}
                    />
            </View>
        </View>
        
    )
}

const styles = StyleSheet.create({
    logo: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain'
    },
    logoContainer: {
        marginTop: Dimensions.get('window').height * .05,
        marginRight: Dimensions.get('window').width * .02,
        width: Dimensions.get('window').height * .42,
        height: Dimensions.get('window').height * .42,
        alignSelf: 'center',
    },
})


export default SignupComponent