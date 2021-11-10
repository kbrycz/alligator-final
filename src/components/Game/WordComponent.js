import React from 'react'
import {View, StyleSheet, Text, Dimensions} from 'react-native'
import * as Color from '../../../global/colors'

const WordComponent = ({word, counter}) => {

    const [currentFont, setCurrentFont] = React.useState(Dimensions.get('window').height * .06)

    return (
        <View>
            <Text style={styles.headerText}>The word of the night is...</Text>
            <View style={styles.wordBox}>
                <Text
                onTextLayout={ (e) => {
                    const { lines } = e.nativeEvent;
                    if (lines.length > 1) {
                      setCurrentFont(currentFont - 1);
                    }} } 
                numberOfLines={1}
                      adjustsFontSizeToFit style={styles.word}>{word}</Text>
            </View>
            <Text style={styles.help}>Try to remember this word before the timer runs out! You will only see it this once!</Text>
            <View style={styles.timerBox}>
                <Text style={styles.timer}>{counter}</Text>
            </View>
           
        </View>
    )
}

const styles = StyleSheet.create({
    headerText: {
        marginLeft: Dimensions.get('window').width * .05,
        marginRight: Dimensions.get('window').width * .05,
        marginTop: Dimensions.get('window').height * .1, 
        textAlign: 'center',
        fontSize: Dimensions.get('window').height * .05,
        fontFamily: 'PatrickHand',
        color: '#fff'
    },
    help: {
        marginTop: Dimensions.get('window').height * .04, 
        marginLeft: Dimensions.get('window').width * .12,
        marginRight: Dimensions.get('window').width * .12,
        textAlign: 'justify',
        fontSize: Dimensions.get('window').height * .025,
        fontFamily: 'PatrickHand',
        color: '#fff',
    },
    timer: {
        marginTop: Dimensions.get('window').height * .1, 
        textAlign: 'center',
        fontSize: Dimensions.get('window').height * .035,
        fontFamily: 'PatrickHand',
        color: '#fff'
    },
    wordBox: {
        backgroundColor: Color.SECOND_GREEN,
        width: Dimensions.get('window').width * .8,
        marginTop: Dimensions.get('window').height * .08, 
        marginLeft: Dimensions.get('window').width * .1,
        marginRight: Dimensions.get('window').width * .1, 
        paddingHorizontal: Dimensions.get('window').height * .04, 
        paddingVertical: Dimensions.get('window').height * .08, 
        borderWidth: 10,
        borderRadius: 15,
        borderColor: Color.MAIN_GREEN,
        shadowColor: '#222',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.9,
        shadowRadius: 5,  
        elevation: 5
        
    }, 
    word: {
        textAlign: 'center',
        fontSize: Dimensions.get('window').height * .06,
        fontFamily: 'PatrickHand',
        textTransform: 'capitalize',
        color: '#fff',
        textShadowColor: '#222',
        textShadowOffset: {width: -1, height: 1},
        textShadowRadius: 1,
    }
})

export default WordComponent