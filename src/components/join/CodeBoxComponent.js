import React, {useState, useEffect} from 'react';
import { SafeAreaView, Text, Dimensions, StyleSheet, TouchableOpacity, Clipboard } from 'react-native';
import { CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell } from 'react-native-confirmation-code-field';
import SimpleModalComponent from '../modal/SimpleModalComponent';
import * as Color from '../../../global/colors'


const CodeBoxComponent = ({setValue, value}) => {
    const CELL_COUNT = 5;
    const [modalVisible, setModalVisible] = useState(false)
    const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
      value,
     setValue,
    });
    const text = "Could not find a code from clipboard. Try again!"

    // Gets the clipboard text from the users phone
    const fetchCopiedText = async () => {
        const code = await Clipboard.getString()
        if (!isNaN(code) && code.length === 5) {
            setValue(code)
        } else {
            setModalVisible(true)
        }
    }

  return (
    <SafeAreaView style={styles.root}>
      <CodeField
        ref={ref}
        {...props}
        value={value}
        onChangeText={setValue}
        cellCount={CELL_COUNT}
        rootStyle={styles.codeFieldRoot}
        keyboardType="number-pad"
        returnKeyType="done"
        blurOnSubmit={true}
        textContentType="oneTimeCode"
        renderCell={({index, symbol, isFocused}) => (
          <Text
            key={index}
            style={[styles.cell, isFocused && styles.focusCell]}
            onLayout={getCellOnLayoutHandler(index)}>
            {symbol || (isFocused ? <Cursor /> : null)}
          </Text>
        )}
      />
        <TouchableOpacity onPress={fetchCopiedText}>
            <Text style={styles.paste}>Click to Paste</Text>
        </TouchableOpacity>
        <SimpleModalComponent modalVisible={modalVisible} setModalVisible={setModalVisible} text={text} buttonText={"OK"}/>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    root: {
        marginBottom: Dimensions.get('window').height * .05,
    },
    codeFieldRoot: {
        width: Dimensions.get('window').width * .8,
        marginLeft: Dimensions.get('window').width * .1,
        marginRight: Dimensions.get('window').width * .1,
    },
    cell: {
        width: Dimensions.get('window').width * .15,
        height: Dimensions.get('window').height * .075,
        fontSize: Dimensions.get('window').height * .04,
        paddingTop: Dimensions.get('window').height * .005,
        borderWidth: 2,
        borderRadius: 10,
        backgroundColor: '#fff',
        borderColor: Color.MAIN_GREEN,
        textAlign: 'center',
        fontFamily: 'PatrickHand',
        color: Color.TEXT,
        borderRadius: 10,
        overflow: 'hidden'
    },
    focusCell: {
        borderColor: '#fff',
    },
    paste: {
        width: Dimensions.get('window').width * .8,
        marginTop: Dimensions.get('window').height * .05,
        marginLeft: Dimensions.get('window').width * .1,
        marginRight: Dimensions.get('window').width * .1,
        textAlign: 'center',
        color: '#fff',
        letterSpacing: Dimensions.get('window').height * .003,
        fontSize: Dimensions.get('window').height * .025,
        lineHeight: Dimensions.get('window').height * .04,
        fontFamily: 'PatrickHand'
    }
});

export default CodeBoxComponent;