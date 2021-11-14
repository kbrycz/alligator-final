import React from 'react'
import {View, StyleSheet, Text, TouchableOpacity, Dimensions} from 'react-native'
import * as Color from '../../../global/colors'
import global from '../../../global'

const PlayerListComponent = ({player, readyUp, index}) => {

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

    // Render the ready up button component
    const renderElements = () => {
        // If player is the local player
        if (player.id === global.id) {
            if (player.isReady) {
                return <Text style={styles.done}>Ready</Text>
            } else {
                return (
                    <TouchableOpacity onPress={() => readyUp(player.id)} style={styles.readyContainer}>
                        <Text style={styles.ready}>Ready up</Text>
                    </TouchableOpacity>
                )
            }
        } else {
            if (player.isReady) {
                return <Text style={styles.done}>Ready</Text>
            } else {
                return <Text style={styles.waiting}>Waiting</Text>
            }
        }
    }

    return (
        <View style={[styles.container, containerStyle()]}>
            <Text style={styles.name}>{player.name}</Text>
            {renderElements()}
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
        marginLeft: Dimensions.get('window').width * .05,
    },
    readyContainer: {
        flex: 1,
    },
    ready: {
        color: '#fff',
        textTransform: 'uppercase',
        paddingTop: Dimensions.get('window').height * .005,
        fontSize: Dimensions.get('window').height * .025,
        fontFamily: 'PatrickHand',
        textAlign: 'center',
        backgroundColor: '#2a411a',
        borderRadius: 10,
        overflow: 'hidden',
        flex: 1,
    },
    waiting: {
        color: '#fff',
        textTransform: 'uppercase',
        fontSize: Dimensions.get('window').height * .03,
        fontFamily: 'PatrickHand',
        textAlign: 'center',
        flex: 1,
    },
    done: {
        color: '#fff',
        textTransform: 'uppercase',
        fontSize: Dimensions.get('window').height * .03,
        fontFamily: 'PatrickHand',
        textAlign: 'center',
        flex: 1,
    },

})

export default PlayerListComponent;