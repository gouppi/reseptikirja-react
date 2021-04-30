import React, {useState, useEffect} from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
// import * as Svg from 'react-native-svg'; TODO CHECK LATER NAVIGATOR DOES NOT LIKE THIS

import Ionicons from '@expo/vector-icons/Ionicons'; // TODO remove as useless, use svgs!

import AnimatedSplash from "react-native-animated-splash-screen";
// import ImmersiveMode from 'react-native-immersive-mode'; // TODO: CHECK LATER linking issues

import RecipeScreen from './screens/Recipe';
import HomeScreen from './screens/Home';
import CardsScreen from './screens/Cards';
import PantryScreen from './screens/Pantry';

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

const CardsWrapper = () => {
	return (
		<Stack.Navigator
			screenOptions={{headerShown: false}}>
			<Stack.Screen
				name="Home"
				component={CardsScreen}
				/>
			<Stack.Screen name="Recipe" component={RecipeScreen} initialParams={{recipe:{title:""}}} />
		</Stack.Navigator>
	)
}


const NavigationSection = () => (
	<NavigationContainer>
		<Tab.Navigator
			screenOptions={({route}) => ({
				tabBarIcon: ({focused, color, size}) => {
					let iconName;
					if (route.name == 'Reseptit') {
						iconName = focused ? 'ios-information-circle' : 'ios-information-circle-outline'
					} else if (route.name == 'Ainesosat') {
						iconName = focused ? 'ios-list' : 'ios-list-outline';
					}
					// You can return any component that you like here!
					return <Ionicons name={iconName} size={size} color={color}/>;
				},
			})}
			tabBarOptions={{
				activeTintColor: '#8BCF89',
				inactiveTintColor:'gray',


			}}
			>
			<Tab.Screen name="Reseptit" component={CardsWrapper} />
			{/* <Tab.Screen name="Recipe" component={RecipeScreen} /> */}
			<Tab.Screen name="Ainesosat" component={PantryScreen} />
		</Tab.Navigator>
			{/* <Stack.Screen name="Recipe" component={RecipeScreen} initialParams={{recipe:{title:""}}}/> */}
	</NavigationContainer>
);