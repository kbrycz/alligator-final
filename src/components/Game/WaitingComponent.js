import React from 'react'
import {View, StyleSheet, Text, Dimensions} from 'react-native'

const WaitingComponent = ({waitText}) => {

    return (
        <View>
            <Text style={styles.headerText}>{waitText}</Text>
            <Text style={styles.sub}>* Make sure to click the notification to participate in the round! (Keep app open in background!)</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    headerText: {
        marginTop: Dimensions.get('window').height * .25,
        marginLeft: Dimensions.get('window').width * .05,
        marginRight: Dimensions.get('window').width * .05,
        lineHeight: Dimensions.get('window').height * .08,
        textAlign: 'center',
        fontSize: Dimensions.get('window').height * .04,
        fontFamily: 'PatrickHand',
        color: '#fff'
    },
    sub: {
        marginTop: Dimensions.get('window').height * .1,
        paddingLeft: Dimensions.get('window').width * .1,
        paddingRight: Dimensions.get('window').width * .1,
        paddingVertical: Dimensions.get('window').height * .02,
        textAlign: 'justify',
        fontSize: Dimensions.get('window').height * .025,
        fontFamily: 'PatrickHand',
        color: '#fff',
        backgroundColor: 'rgba(255,255,255,0.1)'
    },
})

export default WaitingComponent