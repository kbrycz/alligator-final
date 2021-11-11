import React from 'react'
import {View, StyleSheet, Text, TouchableOpacity, Dimensions} from 'react-native'
import * as Color from '../../../global/colors'

const PlayerListComponent = ({player, index}) => {

    // Gets the correct container color for even / odd
    const containerStyle = () => {
        // Even number
        if (index % 2 == 0) {
            return {
                backgroundColor: 'rgba(83, 134, 46, 0.5)',
            }
        } else {
            return {
                backgroundColor: 'rgba(67, 109, 37, 0.5)'
            }
        }
    }

    return (
        <View style={[styles.container, containerStyle()]}>
            <Text style={styles.name}>{player.name}</Text>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding:  Dimensions.get('window').height * .02,
        flexDirection: 'row',
    }, 
    name: {
        color: '#fff',
        textTransform: 'capitalize',
        fontSize: Dimensions.get('window').height * .035,
        fontFamily: 'PatrickHand',
        flex: 2,
        marginLeft: Dimensions.get('window').width * .03,
        textAlign: 'center'
    },


})

export default PlayerListComponent;