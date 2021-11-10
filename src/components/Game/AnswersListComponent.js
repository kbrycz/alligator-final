import React from 'react'
import {View, StyleSheet, Text, TouchableOpacity, Dimensions} from 'react-native'
import * as Color from '../../../global/colors'
import { AntDesign } from '@expo/vector-icons'; 

const AnswersListComponent = ({guess, index}) => {

    // Gets the correct background color for the container
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

    // Gets the text and icon colors for right and wrong
    const getColor = () => {
        if (guess.isCorrect) {
            return {
                color: Color.THIRD_GREEN
            }
        } else {
            return {
                color:'#2a411a'
            }
        }
    }

    return (
        <View style={[styles.container, containerStyle()]}>
            <Text style={[styles.round, getColor()]}>{guess.round}:</Text>
            <Text style={[styles.name, getColor()]}>{guess.answer}</Text>
            {
                guess.isCorrect
                ? <AntDesign name="checkcircle" style={[styles.icon, getColor()]} />
                : <AntDesign name="closecircle" style={[styles.icon, getColor()]} />
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
        flex: 4,
        marginLeft: Dimensions.get('window').width * .03,
    },
    round: {
        color: '#fff',
        fontSize: Dimensions.get('window').height * .03,
        fontFamily: 'PatrickHand',
        flex: 1,
    },
    icon: {
        fontSize: Dimensions.get('window').height * .03,
        flex: 1,
        marginTop: Dimensions.get('window').height * .005,
    }

})

export default AnswersListComponent;