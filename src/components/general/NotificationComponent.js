import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import React, { useState, useEffect, useRef} from 'react';
import { Text, View, Button, Platform, TouchableOpacity, StyleSheet, Dimensions, SafeAreaView } from 'react-native';
import { Feather } from '@expo/vector-icons'; 
import QuitModalComponent from '../modal/QuitModalComponent';

// Sets what notifications look like
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const NotificationComponent = ({handleNotificationResponse, backFunction, pageId}) => {
    const [notification, setNotification] = useState(false);
    const [modalExitVisible, setModalExitVisible] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();

    useEffect(() => {

      // Not quite sure what it does, leave for now
      notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
          setNotification(notification);
      });

      // Calls handle notification from parent class
      responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
          handleNotificationResponse(response, pageId)
      });   

      // Cancel all notifications when component is closed
      return async () => {
        await Notifications.cancelAllScheduledNotificationsAsync();
        Notifications.removeNotificationSubscription(notificationListener.current);
        Notifications.removeNotificationSubscription(responseListener.current);
      };
    
  }, []);

  // Cancel all notifications and remove listeners
  const getRidOfNotifications = async () => {
      await Notifications.cancelAllScheduledNotificationsAsync();
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
  }

  // Head back to the home screen of app
  const back = async () => {
      console.log("Leaving game and returning to home screen")
      getRidOfNotifications().then(() => {
          backFunction()
      })
  }

  return (
    <>
      {pageId >= 0
      ? null
      : <><TouchableOpacity style={styles.iconContainer} onPress={() => setModalExitVisible(true)} >
          <Feather name="arrow-left" style={styles.back} />
        </TouchableOpacity>
        <QuitModalComponent modalExitVisible={modalExitVisible} setModalExitVisible={setModalExitVisible}
                        text={"Are you sure you want to quit? You will be removed from this game!"} func={back}/>
        </>
      }
       
    </>

  );
}


const styles = StyleSheet.create({
  iconContainer: {
      zIndex: 1
  },
  back: {
      fontSize: Dimensions.get('window').height * .04,
      color: '#fff',
      position: 'absolute',
      top: 0,
      left: Dimensions.get('window').width * .03,
  },
  
})

export default NotificationComponent