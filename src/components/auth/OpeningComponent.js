import React from 'react'
import {View, StyleSheet, Text, Dimensions, Image} from 'react-native'
import Circle1Component from './circles/Circle1Component'
import * as AuthStyle from '../../../styles/auth'

const OpeningComponent = () => {

    return (
        <View style={AuthStyle.styles.headingView}>
            <Circle1Component />
            <View style={AuthStyle.styles.textContainer}>
                <Text style={AuthStyle.styles.heading}>Everyone gets a random word to remember for the night</Text>
            </View>
            <View style={AuthStyle.styles.phoneContainer}>
                <Image
                    style={AuthStyle.styles.phone} 
                    source={require('../../../assets/opening/screen1.png')}
                    />
            </View>
            <View style={AuthStyle.styles.counterContainer}>
                <Image
                    style={AuthStyle.styles.counter} 
                    source={require('../../../assets/opening/counter1.png')}
                    />
            </View>
        </View>
        
    )
}


export default OpeningComponent