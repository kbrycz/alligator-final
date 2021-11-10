import React from 'react'
import {View, StyleSheet, Text, ActivityIndicator, Dimensions} from 'react-native'
import * as Color from '../../../global/colors'


const LoadingIndicator = ({loading, color}) => {

    return (
        <>
          <ActivityIndicator
                  style={styles.activityIndicator}
                  animating={loading}
                  size="large"
                  color={color}
              />
        </>
    )
}

const styles = StyleSheet.create({
  activityIndicator: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
},

})

export default LoadingIndicator;