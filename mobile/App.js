import React, {useState, useEffect,useContext} from 'react';
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

import {usePantryContext, PantryContextProvider} from './providers/PantryContext';

// const ThemeContext = React.createContext('light');

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

export default function App() {
	return (
		<PantryContextProvider>
			<Wrapper/>
		</PantryContextProvider>
	);
}

/**
 * Wrapper component is used only because we need App component to initialize context before.
 */

const Wrapper = () => {
	const {fetchRecipes} = usePantryContext();
	const [loaded, setLoaded] = useState(false);
	
	/**
	 * This useEffect handles pre-fetching initial set of recipes from the API, and only after the request is completed
	 * (or the request has taken too long) - will the Splash screen hide.
	 * TODO: Add an additional spinner icon to the splash screen, show it once the request takes more than 2 seconds.
	 * TODO: Add a toast (messagebox) showing a request failure, if we're unable to perform API request ATM.
	 */
	useEffect(() => {
		(async() => {
			console.log("Running App useEffect function, calling fetchRecipes @ pantryContext");
			let response = await fetchRecipes();
			setLoaded(true);
		})();
	}, []);

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
	</NavigationContainer>
);


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