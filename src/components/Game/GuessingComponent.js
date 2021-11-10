import React from 'react'
import {View, StyleSheet, Text, Dimensions, TextInput, TouchableOpacity, KeyboardAvoidingView} from 'react-native'
import * as Color from '../../../global/colors'
import HideKeyboard from '../general/HideKeyboard'
import SimpleModalComponent from '../modal/SimpleModalComponent'

const GuessingComponent = ({guess, setGuess, submitGuess, title}) => {

    const [modalVisible, setModalVisible] = React.useState(false)
    const [text, setText] = React.useState("Guess is not long enough!")

    const tempSubmitGuess = () => {
        if (guess.length > 3) {
            submitGuess()
        }
        else {
            setModalVisible(true)
        }
    }

    return (
        <View>
            <Text style={styles.headerText}>{title}</Text>
            <HideKeyboard>
                <KeyboardAvoidingView behavior='position'>
                    <TextInput
                        blurOnSubmit={false}
                        textContentType="none"
                        autoCompleteType='off'
                        autoCorrect={false}
                        style={styles.textInput}
                        keyboardType="default"
                        returnKeyType="done"
                        value={guess}
                        blurOnSubmit={true}
                        placeholder='Your Guess...'
                        onChangeText={setGuess} />
                    <TouchableOpacity style={styles.button} onPress={tempSubmitGuess}>
                        <Text style={styles.buttonText}>Submit</Text>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            </HideKeyboard>
            <SimpleModalComponent modalVisible={modalVisible} setModalVisible={setModalVisible} text={text} buttonText="OK" />
        </View>
    )
}

const styles = StyleSheet.create({
    headerText: {
        marginTop: Dimensions.get('window').height * .15,
        marginLeft: Dimensions.get('window').width * .12,
        marginRight: Dimensions.get('window').width * .12,
        lineHeight: Dimensions.get('window').height * .08,
        textAlign: 'center',
        fontSize: Dimensions.get('window').height * .06,
        fontFamily: 'PatrickHand',
        color: '#fff'
    },
    textInput: {
        marginTop: Dimensions.get('window').height * .1, 
        fontFamily: 'PatrickHand',
        width: Dimensions.get('window').width * .8,
        marginLeft: Dimensions.get('window').width * .1,
        marginRight: Dimensions.get('window').width * .1,
        padding: Dimensions.get('window').height * .02,
        fontSize: Dimensions.get('window').height * .025,
        borderWidth: 1,
        borderRadius: 15,
        borderColor: 'rgba(0, 0, 0, .1)',
        backgroundColor: '#fff'
    },
    buttonText: {
        fontSize: Dimensions.get('window').height * .035,
        textAlign: 'center',
        color: Color.MAIN_GREEN,
        fontFamily: 'PatrickHand'
    },
    button: {
        width: Dimensions.get('window').width * .8,
        marginLeft: Dimensions.get('window').width * .1,
        marginRight: Dimensions.get('window').width * .1,
        backgroundColor: '#fff',
        marginTop: Dimensions.get('window').height * .02,
        paddingVertical: Dimensions.get('window').width * .03,
        paddingHorizontal: Dimensions.get('window').width * .07,
        borderWidth: 4,
        borderColor: Color.MAIN_GREEN,
        borderRadius: 20,
    },
})

export default GuessingComponent