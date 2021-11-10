import React from 'react'
import {View, StyleSheet, ScrollView, Dimensions, Image} from 'react-native'
import * as Color from '../global/colors'

export const styles = StyleSheet.create({
    headingView: {
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width
    },
    imageContainer: {
        position: 'absolute',
        bottom: -Dimensions.get('window').height * .2,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height * .4,
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover'
    },
    counterContainer: {
        position: 'absolute',
        bottom: 5,
        width: Dimensions.get('window').width * .15,
        height: Dimensions.get('window').height * .1,
        alignSelf: 'center',
    },
    counter: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain'
    },

    phoneContainer: {
        marginTop: Dimensions.get('window').height * .04,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height * .5,
        alignSelf: 'center',
    },
    phone: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain'
    },
    textContainer: {
        padding: Dimensions.get('window').width * .05,
    },
    heading: {
        fontSize: Dimensions.get('window').height * .04,
        textAlign: 'center',
        marginTop: Dimensions.get('window').height * .1,
        fontFamily: 'PatrickHand',
        color: Color.HEADER_COLOR
    }
})


