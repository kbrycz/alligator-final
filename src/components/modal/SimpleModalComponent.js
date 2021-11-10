import React, { useState } from "react";
import { Alert, Modal, StyleSheet, Text, Pressable, View, Dimensions, ScrollView } from "react-native";
import * as Color from '../../../global/colors'

const SimpleModalComponent = ({modalVisible, setModalVisible, text, buttonText}) => {
    
  return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setModalVisible(!modalVisible);
            }}>
            <View style={styles.centeredView}>
            <View style={styles.modalView}>
                <Text style={styles.modalText}>{text}</Text>
                <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}
                >
                    <Text style={styles.textStyle}>{buttonText}</Text>
                </Pressable>
            </View>
            </View>
        </Modal>
  );
};

const styles = StyleSheet.create({

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    width: Dimensions.get('window').width * .6,
    marginRight: Dimensions.get('window').width * .3,
    marginLeft: Dimensions.get('window').width * .3,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: Dimensions.get('window').height * .023,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.6,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 20,
    paddingBottom: Dimensions.get('window').width * .01,
    paddingLeft: Dimensions.get('window').width * .08,
    paddingRight: Dimensions.get('window').width * .08,
    elevation: 2,
    marginTop: Dimensions.get('window').height * .02,
  },
  buttonClose: {
    backgroundColor: Color.MAIN_GREEN,
    paddingTop: Dimensions.get('window').width * .015,
    paddingBottom: Dimensions.get('window').width * .015
  },
  textStyle: {
    color: "#fff",
    textAlign: "center",
    fontFamily: 'PatrickHand',
    fontSize: Dimensions.get('window').height * .03,
  },
  modalText: {
    textAlign: 'center',
    color: Color.TEXT,
    fontSize: Dimensions.get('window').height * .03,
    lineHeight: Dimensions.get('window').height * .045,
    fontFamily: 'PatrickHand',
    marginBottom: Dimensions.get('window').height * .015,
  }
});

export default SimpleModalComponent;