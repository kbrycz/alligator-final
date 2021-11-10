import React from 'react'
import {View, StyleSheet, Image, Dimensions} from 'react-native'

const Circle2Component = () => {

    return (
        <View>
            <View style={[styles.circle1, styles.imageSize]}>
                <Image
                    style={styles.image} 
                    source={require('../../../../assets/opening/circle.png')}
                    />
            </View>
            <View style={[styles.circle2, styles.imageSize]}>
                <Image
                    style={styles.image} 
                    source={require('../../../../assets/opening/circle.png')}
                    />
            </View>
            <View style={[styles.circle3, styles.imageSize]}>
                <Image
                    style={styles.image} 
                    source={require('../../../../assets/opening/circle.png')}
                    />
            </View>
            <View style={[styles.circle4, styles.imageSize]}>
                <Image
                    style={styles.image} 
                    source={require('../../../../assets/opening/circle.png')}
                    />
            </View>
            <View style={[styles.circle5, styles.imageSize]}>
                <Image
                    style={styles.image} 
                    source={require('../../../../assets/opening/circle.png')}
                    />
            </View>

            <View style={[styles.circle7, styles.imageSize]}>
                <Image
                    style={styles.image} 
                    source={require('../../../../assets/opening/circle.png')}
                    />
            </View>
            <View style={[styles.circle8, styles.imageSize]}>
                <Image
                    style={styles.image} 
                    source={require('../../../../assets/opening/circle.png')}
                    />
            </View>
            <View style={[styles.circle9, styles.imageSize]}>
                <Image
                    style={styles.image} 
                    source={require('../../../../assets/opening/circle.png')}
                    />
            </View>
            <View style={[styles.circle10, styles.imageSize]}>
                <Image
                    style={styles.image} 
                    source={require('../../../../assets/opening/circle.png')}
                    />
            </View>
            <View style={[styles.circle11, styles.imageSize]}>
                <Image
                    style={styles.image} 
                    source={require('../../../../assets/opening/circle.png')}
                    />
            </View>
            <View style={[styles.circle12, styles.imageSize]}>
                <Image
                    style={styles.image} 
                    source={require('../../../../assets/opening/circle.png')}
                    />
            </View>
            <View style={[styles.circle13, styles.imageSize]}>
                <Image
                    style={styles.image} 
                    source={require('../../../../assets/opening/circle.png')}
                    />
            </View>
        </View>
        
    )
}

const styles = StyleSheet.create({
    imageSize: {
        position: 'absolute',
        width: Dimensions.get('window').height * .1,
        height: Dimensions.get('window').height * .1,
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
        opacity: .4
    },
    circle1: {
        top: Dimensions.get('window').height * .29
    },
    circle2: {
        top: Dimensions.get('window').height * .43,
        left: Dimensions.get('window').width * .72
    },
    circle3: {
        top: Dimensions.get('window').height * .72,
        left: Dimensions.get('window').width * .54
    },
    circle4: {
        top: Dimensions.get('window').height * .05,
        left: Dimensions.get('window').width * .85
    },
    circle5: {
        top: Dimensions.get('window').height * -.01,
        left: Dimensions.get('window').width * .13
    },
    circle7: {
        top: Dimensions.get('window').height * .65,
        left: Dimensions.get('window').width * .9
    },
    circle8: {
        top: Dimensions.get('window').height * .39,
        left: Dimensions.get('window').width * .35
    },
    circle9: {
        top: Dimensions.get('window').height * .22,
        left: Dimensions.get('window').width * .5
    },
    circle10: {
        top: Dimensions.get('window').height * .6,
        left: Dimensions.get('window').width * .2
    },
    circle11: {
        top: Dimensions.get('window').height * .79,
        left: Dimensions.get('window').width * .2
    },
    circle12: {
        top: Dimensions.get('window').height * .95,
        left: Dimensions.get('window').width * .1
    },
    circle13: {
        top: Dimensions.get('window').height * .9,
        left: Dimensions.get('window').width * .7
    },

})

export default Circle2Component