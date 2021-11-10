import React from 'react'
import {View, StyleSheet, Text, Dimensions, Image} from 'react-native'
import Circle2Component from './circles/Circle2Component'
import * as AuthStyle from '../../../styles/auth'

const SecondOpeningComponent = () => {
    
    return (
        <View style={AuthStyle.styles.headingView}>
            <Circle2Component />
            <View style={AuthStyle.styles.textContainer}>
                <Text style={AuthStyle.styles.heading}>Get notified throughout the night and in the morning to guess</Text>
            </View>
            <View style={AuthStyle.styles.phoneContainer}>
                <Image
                    style={AuthStyle.styles.phone} 
                    source={require('../../../assets/opening/screen2.png')}
                    />
            </View>
            <View style={AuthStyle.styles.counterContainer}>
                <Image
                    style={AuthStyle.styles.counter} 
                    source={require('../../../assets/opening/counter2.png')}
                    />
            </View>
        </View>
        
    )
}

const styles = StyleSheet.create({

})

export default SecondOpeningComponent