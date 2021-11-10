import React from 'react'
import {View, StyleSheet, Text, Dimensions, Image} from 'react-native'
import Circle3Component from './circles/Circle3Component'
import * as AuthStyle from '../../../styles/auth'

const ThirdOpeningComponent = () => {

    return (
        <View style={AuthStyle.styles.headingView}>
            <Circle3Component />
            <View style={AuthStyle.styles.textContainer}>
                <Text style={AuthStyle.styles.heading}>See the results in the morning! Which friends blacked out?</Text>
            </View>
            <View style={AuthStyle.styles.phoneContainer}>
                <Image
                    style={AuthStyle.styles.phone} 
                    source={require('../../../assets/opening/screen3.png')}
                    />
            </View>
            <View style={AuthStyle.styles.counterContainer}>
                <Image
                    style={AuthStyle.styles.counter} 
                    source={require('../../../assets/opening/counter3.png')}
                    />
            </View>
        </View>
        
    )
}

const styles = StyleSheet.create({

})


export default ThirdOpeningComponent