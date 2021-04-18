import React, {useState, useEffect} from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';


import Ionicons from '@expo/vector-icons/Ionicons'; // TODO remove as useless, use svgs!

import AnimatedSplash from "react-native-animated-splash-screen";
// import ImmersiveMode from 'react-native-immersive-mode'; // TODO: CHECK LATER linking issues

import RecipeScreen from './screens/Recipe';
import HomeScreen from './screens/Home';
import CardsScreen from './screens/Cards';
import SettingsScreen from './screens/Settings';

const ThemeContext = React.createContext('light');

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

export default function App() {
	const [loaded, setLoaded] = useState(false);
	useEffect(() => {
		setTimeout(() => {
			setLoaded(true);
		}, 3000);
	}, []);

	// useEffect(() => {
	// 	ImmersiveMode.fullLayout(true);
	// }, []);

	return (
		<AnimatedSplash
			translucent={true}
			isLoaded={loaded}
			logoImage={require("./assets/book2.png")}
			backgroundColor={"#8BCF89"}
			logoHeight={200}
			logoWidth={200}>
			{NavigationSection()}
		</AnimatedSplash>
	);
}


const NavigationSection = () => (
	<NavigationContainer>
		{/* <Stack.Navigator>
			<Stack.Screen name="Recipe" component={R} */}
		<Tab.Navigator
			screenOptions={({route}) => ({
				tabBarIcon: ({focused, color, size}) => {
					let iconName;
					if (route.name == 'Home') {
						iconName = focused ? 'ios-information-circle' : 'ios-information-circle-outline'
					} else if (route.name == 'Settings') {
						iconName = focused ? 'ios-list' : 'ios-list-outline';
					}
					// You can return any component that you like here!
					return <Ionicons name={iconName} size={size} color={color}/>;
				},
			})}
			tabBarOptions={{
				activeTintColor: 'tomato',
				inactiveTintColor:'gray',
			}}
			>
			<Tab.Screen name="Home" component={CardsScreen} />
			<Tab.Screen name="Recipe" component={RecipeScreen} />
			<Tab.Screen name="Settings" component={SettingsScreen} />
		</Tab.Navigator>
	</NavigationContainer>
);