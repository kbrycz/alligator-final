import React from 'react'
import {View, StyleSheet, ScrollView, Dimensions, Image} from 'react-native'
import OpeningComponent from '../../components/auth/OpeningComponent'
import SecondOpeningComponent from '../../components/auth/SecondOpeningComponent'
import ThirdOpeningComponent from '../../components/auth/ThirdOpeningComponent'

class HowToScreen extends React.Component {

    constructor() {
        super()
        this.state = {
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <ScrollView bounces={false} style={styles.background} horizontal pagingEnabled>
                    <OpeningComponent />
                    <SecondOpeningComponent />
                    <ThirdOpeningComponent />
                </ScrollView>
            </View>
        )
    }
    
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
})

export default HowToScreen