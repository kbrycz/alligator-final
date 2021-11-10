import React from 'react'
import {View, StyleSheet, ScrollView, Dimensions, Image} from 'react-native'
import OpeningComponent from '../../components/auth/OpeningComponent'
import SecondOpeningComponent from '../../components/auth/SecondOpeningComponent'
import SignupComponent from '../../components/auth/SignupComponent'
import ThirdOpeningComponent from '../../components/auth/ThirdOpeningComponent'

class OpeningScreen extends React.Component {

    constructor() {
        super()
        this.state = {
        }
    }

    // Navigates to the auth screen when user is ready to sign up/sign in
    showAuthScreen = () => {
        this.props.navigation.navigate("Auth")
    }

    render() {
        return (
            <View style={styles.container}>
                <ScrollView bounces={false} style={styles.background} horizontal pagingEnabled>
                    <OpeningComponent />
                    <SecondOpeningComponent />
                    <ThirdOpeningComponent />
                    <SignupComponent showAuthScreen={this.showAuthScreen}/>
                </ScrollView>
            </View>
        )
    }
    
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e9e9e9'
    },
})

export default OpeningScreen