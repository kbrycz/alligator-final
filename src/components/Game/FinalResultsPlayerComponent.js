import React from 'react'
import {View, StyleSheet, Text, TouchableOpacity, Dimensions} from 'react-native'
import * as Color from '../../../global/colors'
import { MaterialCommunityIcons } from '@expo/vector-icons';


const FinalResultsPlayerComponent = ({player, index, toPlayerScreen}) => {

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

    // Get the score and total string
    const getScoreString = () => {
        let score = 0;
        let total = 0;
        for (let i = 0; i < player.answers.length; ++i) {
            if (player.answers[i].isCorrect) {
                score += 1
            }
            total += 1
        }
        return score + ' / ' + total
    }

    return (
        <View>
            {
                player.answers.length > 0
                ?   (<TouchableOpacity onPress={() => toPlayerScreen(player)}>
                        <View style={[styles.container, containerStyle()]}>
                            <Text style={styles.name}>{player.first} {player.last}</Text>
                            <Text style={styles.score}>{getScoreString()}</Text>
                        </View>
                    </TouchableOpacity>)
                :   (<View style={[styles.container, containerStyle()]}>
                        <Text style={styles.name}>{player.first} {player.last}</Text>
                        <MaterialCommunityIcons name="sleep" style={styles.sleepIcon} />
                    </View>)
            }
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
        fontSize: Dimensions.get('window').height * .03,
        fontFamily: 'PatrickHand',
        flex: 3,
        marginLeft: Dimensions.get('window').width * .03,
    },
    score: {
        color: '#fff',
        fontSize: Dimensions.get('window').height * .03,
        fontFamily: 'PatrickHand',
        flex: 1,
    },
    sleepIcon: {
        color: '#fff',
        fontSize: Dimensions.get('window').height * .035,
        flex: 1,
        marginLeft: Dimensions.get('window').width * .08,
    }
})

export default FinalResultsPlayerComponent;