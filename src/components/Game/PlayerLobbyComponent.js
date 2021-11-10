import React from 'react'
import {View, StyleSheet, Text, Dimensions, FlatList, TouchableOpacity, SafeAreaView, RefreshControl} from 'react-native'
import FinalResultsPlayerComponent from '../Game/FinalResultsPlayerComponent'
import * as Color from '../../../global/colors'
import api from '../../api/server'

const PlayerLobbyComponent = ({players, toPlayerScreen, word, code, setPlayers, setModalVisible, setPopUpText}) => {

    const [isRefreshing, setIsRefreshing] = React.useState(false)

    const onRefresh = async () => {
        setIsRefreshing(true)
        try {
            const response = await api.get('/otherPlayersData', {params: {code: code}})
            if (!response) {
                setModalVisible(true)
                setPopUpText('Unable to connect to the server. Please try again!')
                return
            }
            console.log(response.data.players)
            setPlayers(response.data.players)
            // setting timeout for more natural look on refresh
            setTimeout(() => {
                setIsRefreshing(false)
            }, 1000)
            
        }
        catch (err) {
            console.log(err)
            setTimeout(() => {
                setIsRefreshing(false)
                setModalVisible(true)
                setPopUpText('Unable to connect to the server. Please try again!')
            }, 1000)
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.header}>Final Results</Text>
            </View>
            <FlatList
                refreshControl={
                <RefreshControl
                  refreshing={isRefreshing}
                  onRefresh={onRefresh}
                  tintColor="#fff"
                />}  
                data={players}
                renderItem={({ item, index }) => (
                    <FinalResultsPlayerComponent player={item} index={index} toPlayerScreen={toPlayerScreen}/>
                )}
                keyExtractor={item => item.id.toString()}
                style={styles.list} />
            <Text style={styles.word}>{word}</Text>
            <Text style={styles.bottomText}>Click on players to view stats!</Text>
        </View>
    )
}

const styles = StyleSheet.create({

    headerContainer: {
        marginTop: Dimensions.get('window').height * .01,
        borderBottomWidth: 3,
        borderColor: 'rgba(255, 255, 255, 0.5)',
    },
    header: {
        width: Dimensions.get('window').width,
        padding: Dimensions.get('window').height * .03,
        textAlign: 'center',
        color: '#fff',
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: {width: -2, height: 2},
        textShadowRadius: 10,
        letterSpacing: Dimensions.get('window').width * .01,
        textTransform: 'uppercase',
        fontSize: Dimensions.get('window').height * .04,
        fontFamily: 'PatrickHand',
    },
    list: {
        height: Dimensions.get('window').height * .65,
        borderBottomWidth: 3,
        borderColor: 'rgba(255, 255, 255, 0.5)',
    },
    word: {
        marginTop: Dimensions.get('window').height * .015,
        textAlign: 'center',
        fontSize:  Dimensions.get('window').height * .04,
        fontFamily: 'PatrickHand',
        color: '#fff',
        textTransform: 'capitalize',
    },
    bottomText: {
        marginTop: Dimensions.get('window').height * .02,
        textAlign: 'center',
        fontSize:  Dimensions.get('window').height * .02,
        fontFamily: 'PatrickHand',
        color: '#fff'
    }

})

export default PlayerLobbyComponent