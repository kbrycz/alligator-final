import * as React from 'react';
import { StyleSheet, View, ActivityIndicator, Dimensions } from 'react-native'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import OpeningScreen from './src/screens/Opening/OpeningScreen';
import AuthScreen from './src/screens/Opening/AuthScreen';
import * as Font from 'expo-font';
import HomeScreen from './src/screens/Home/HomeScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SettingsScreen from './src/screens/Home/SettingsScreen';
import LobbyScreen from './src/screens/Game/LobbyScreen';
import JoinScreen from './src/screens/Game/JoinScreen';
import GameScreen from './src/screens/Game/GameScreen';
import { Asset } from 'expo-asset';
import HowToScreen from './src/screens/Opening/HowToScreen';
import PlayerScreen from './src/screens/Game/PlayerScreen';
import SettingsAccountInfoScreen from './src/screens/Home/SettingsAccountInfoScreen';
import SettingsPasswordScreen from './src/screens/Home/SettingsPasswordScreen';
import SettingsAboutScreen from './src/screens/Home/SettingsAboutScreen';
import * as SplashScreen from 'expo-splash-screen';



// Creates stack for the Authentication screens
const Opening = createStackNavigator();
const OpeningStack = () => {
  return (
    <Opening.Navigator 
        initialRouteName="Opening"
        screenOptions={{
          headerShown: false,
          presentation: 'modal'
        }}>
        <Opening.Screen name="Opening" component={OpeningScreen} /> 
        <Opening.Screen name="Auth" component={AuthScreen} />
    </Opening.Navigator>
  )
}

// Creates stack for the Settings screens
const Settings = createStackNavigator();
const SettingsStack = () => {
  return (
    <Settings.Navigator 
        initialRouteName="SettingsHome"
        screenOptions={{
          headerShown: false,
        }}>
        <Settings.Screen name="SettingsHome" component={SettingsScreen} />
        <Settings.Screen name="AccountInfo" component={SettingsAccountInfoScreen} />
        <Settings.Screen name="Password" component={SettingsPasswordScreen} />
        <Settings.Screen name="About" component={SettingsAboutScreen} />
    </Settings.Navigator>
  )
}


// Creates stack for the Home screens
const Home = createStackNavigator();
const HomeStack = () => {
  return (
    <Home.Navigator 
        initialRouteName="Main"
        screenOptions={{
          headerShown: false,
          presentation: 'modal'
        }}>
        <Home.Screen name="Main" component={HomeScreen} />
        <Home.Screen name="How" component={HowToScreen} />
        <Home.Screen name="Settings" component={SettingsStack} />
    </Home.Navigator>
  )
}

// Creates stack for the Authentication screens
const Game = createStackNavigator();
const GameStack = () => {
  return (
    <Game.Navigator 
        initialRouteName="Gameplay"
        screenOptions={{
          headerShown: false,
        }}>
        <Game.Screen name="Gameplay" component={GameScreen} />
        <Game.Screen name="Player" component={PlayerScreen} />
    </Game.Navigator>
  )
}

const RootStack = createStackNavigator();

class App extends React.Component {

  // Initialize the App Screen state
  constructor() {
    super();
    this.state = {
      loading: true,
      hasToken: false,
      hasGameData: false
    };
  }

  // Loads all assets before screen renders
  // Allows for images and fonts to be in place when the screen is rendered
  async loadEverything() {

    // Keep the splash screen visible while we fetch resources
    await SplashScreen.preventAutoHideAsync();

    // Loads all the images
    await Asset.loadAsync([
      require('./assets/alligator.png'),
      require('./assets/alligatorClick.png'), 
      require('./assets/alligatorGreen.png'),
      require('./assets/opening/circle.png'),
      require('./assets/opening/counter1.png'),
      require('./assets/opening/counter2.png'), 
      require('./assets/opening/counter3.png'), 
      require('./assets/opening/counter4.png'),
      require('./assets/opening/screen1.png'),
      require('./assets/opening/screen2.png'),
      require('./assets/opening/screen3.png'),
    ]);

    // Checks if the users has a login token and sets the hasToken bool
    AsyncStorage.getItem('token').then((token) => {
      this.setState({ hasToken: token !== null})
    })

    // Checks if the users has a login token and sets the hasToken bool
    AsyncStorage.getItem('gameData').then((gameData) => {
      this.setState({ hasGameData: gameData !== null})
    })

    // Loads all the fonts
    await Font.loadAsync({
      PatrickHand: require('./assets/fonts/PatrickHand-Regular.ttf')
    });

    // Sets loading to false, indicating all of the loading is done and we can show the screens
    this.setState({ 
        loading: false,
    });

    setTimeout(async () => {
      await SplashScreen.hideAsync();
    }, 2000);
}
 
  // Check and see if user already has a token to log user in
  componentDidMount() {
    this.loadEverything()
  }

  // Renders the jsx for the UI
  render() {
    if (this.state.loading) {
      return <View style={styles.background}>
             </View>
    } 
   else  {
      return( 
          <NavigationContainer>
             <RootStack.Navigator screenOptions={{
                headerShown: false,
                animationEnabled: false
              }}>
              { 
                !this.state.hasToken 
                ? <>
                  <RootStack.Screen name='Open' component={OpeningStack} />
                  <RootStack.Screen name='Home' component={HomeStack} />
                  <RootStack.Screen name='Lobby' component={LobbyScreen} />
                  <RootStack.Screen name='Join' component={JoinScreen} />
                  <RootStack.Screen name='Game' component={GameStack} />
                  </>
                : this.state.hasGameData
                ? <>
                  <RootStack.Screen name='Game' component={GameStack} />
                  <RootStack.Screen name='Home' component={HomeStack} />
                  <RootStack.Screen name='Open' component={OpeningStack} />
                  <RootStack.Screen name='Lobby' component={LobbyScreen} />
                  <RootStack.Screen name='Join' component={JoinScreen} />
                  </>
                : <>
                  <RootStack.Screen name='Home' component={HomeStack} />
                  <RootStack.Screen name='Open' component={OpeningStack} />
                  <RootStack.Screen name='Lobby' component={LobbyScreen} />
                  <RootStack.Screen name='Join' component={JoinScreen} />
                  <RootStack.Screen name='Game' component={GameStack} />
                  </>
              }
           </RootStack.Navigator>
          </NavigationContainer>  
      );
    }
  }
}

const styles = StyleSheet.create({
  background: {
      backgroundColor: '#fff',
      height: Dimensions.get('window').height
  },
})

export default function(props) {
    return <App {...props} />;
}