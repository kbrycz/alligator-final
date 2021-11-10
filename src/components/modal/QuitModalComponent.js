import React, { useState } from "react";
import { Alert, Modal, StyleSheet, Text, Pressable, View, Dimensions } from "react-native";
import * as Color from '../../../global/colors'

const QuitModalComponent = ({modalExitVisible, setModalExitVisible, text, func}) => {

  // Runs the callback function passed in  
  const runFunc = () => {
      setModalExitVisible(!modalExitVisible)
      func()
  }
    
  return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalExitVisible}
            onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setModalExitVisible(!modalExitVisible);
            }}>
            <View style={styles.centeredView}>
            <View style={styles.modalView}>
                <Text style={styles.modalText}>{text}</Text>
                <View style={{flexDirection: 'row', borderRadius: 5, overflow: 'hidden'}}>
                  <Pressable
                  style={[styles.button, styles.buttonClose1]}
                  onPress={() => setModalExitVisible(!modalExitVisible)}
                  >
                      <Text style={styles.textStyle1}>Cancel</Text>
                  </Pressable>
                  <Pressable
                  style={[styles.button, styles.buttonClose2]}
                  onPress={runFunc}
                  >
                      <Text style={styles.textStyle2}>Quit</Text>
                  </Pressable>
                </View>
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
    width: Dimensions.get('window').width * .7,
    marginRight: Dimensions.get('window').width * .15,
    marginLeft: Dimensions.get('window').width * .15,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: Dimensions.get('window').height * .025,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.6,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    padding: Dimensions.get('window').height * .005,
    paddingBottom: Dimensions.get('window').height * .006,
    elevation: 2,
    flex: 1
  },
  buttonClose1: {
    backgroundColor: "#fff",
    borderColor: Color.MAIN_GREEN,
    borderWidth: 2,
  },
  buttonClose2: {
    backgroundColor: Color.MAIN_GREEN,
  },
  textStyle1: {
    color: Color.MAIN_GREEN,
    textAlign: "center",
    fontFamily: 'PatrickHand',
    fontSize: Dimensions.get('window').height * .03,
    padding: Dimensions.get('window').width * .01,
  },
  textStyle2: {
    color: "#fff",
    textAlign: "center",
    fontFamily: 'PatrickHand',
    fontSize: Dimensions.get('window').height * .03,
    padding: Dimensions.get('window').width * .01,
  },
  modalText: {
    textAlign: 'center',
    color: Color.TEXT,
    fontSize: Dimensions.get('window').height * .03,
    lineHeight: Dimensions.get('window').height * .045,
    fontFamily: 'PatrickHand',
    marginBottom: Dimensions.get('window').height * .03,
  }
});

export default QuitModalComponent;