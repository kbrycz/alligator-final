import React from 'react'
import {View, StyleSheet, Text, Dimensions, ScrollView, RefreshControl} from 'react-native'

const WaitingComponent = ({waitText, getUserOnRightPage}) => {

    const [isRefreshing, setIsRefreshing] = React.useState(false)

    const onRefresh = async () => {
        setIsRefreshing(true)
        if (getUserOnRightPage(true)) {
            return
        }
        setTimeout(() => {
            setIsRefreshing(false)
        }, 1000)
    }

    return (
        <ScrollView
        style={styles.sv}
        refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              tintColor="#fff"
            />}
        >
            <Text style={styles.headerText}>{waitText}</Text>
            <Text style={styles.sub}>* Click notification or pull down to refresh to participate in the round! (Keep app open in background!)</Text>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    headerText: {
        marginTop: Dimensions.get('window').height * .25,
        marginLeft: Dimensions.get('window').width * .05,
        marginRight: Dimensions.get('window').width * .05,
        lineHeight: Dimensions.get('window').height * .08,
        textAlign: 'center',
        fontSize: Dimensions.get('window').height * .04,
        fontFamily: 'PatrickHand',
        color: '#fff'
    },
    sub: {
        marginTop: Dimensions.get('window').height * .1,
        paddingLeft: Dimensions.get('window').width * .1,
        paddingRight: Dimensions.get('window').width * .1,
        paddingVertical: Dimensions.get('window').height * .02,
        textAlign: 'justify',
        fontSize: Dimensions.get('window').height * .025,
        fontFamily: 'PatrickHand',
        color: '#fff',
        backgroundColor: 'rgba(255,255,255,0.1)'
    },
    sv: {
        height: Dimensions.get('window').height
    }
})

export default WaitingComponent