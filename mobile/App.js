import React, {useState, useEffect,useContext} from 'react';
import {StatusBar, Image,View,Text,TextInput} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import AnimatedSplash from "react-native-animated-splash-screen";
import * as Font from 'expo-font';
import 'react-native-gesture-handler';

import RecipeScreen from './screens/RecipeNew';
import CardsScreen from './screens/Cards';
import PantryScreen from './screens/Pantry';

// import ImmersiveMode from 'react-native-immersive-mode'; // TODO: CHECK LATER linking issues TODO REMOVE AS USELESS?
import Ionicons from '@expo/vector-icons/Ionicons'; // TODO remove as useless, use svgs! TODO REMOVE AS USELESS?
// import * as Svg from 'react-native-svg'; TODO CHECK LATER NAVIGATOR DOES NOT LIKE THIS TODO REMOVE AS USELESS?

import {usePantryContext, PantryContextProvider} from './providers/PantryContext';

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
	const {fetchRecipes, recipes} = usePantryContext();
	const [loaded, setLoaded] = useState(false);
	
	// const loadFonts = async() => {
	// 	console.log("Loading fonts");
	// 	let result = await Font.loadAsync({
	// 		'Quicksand-Bold': require('./assets/fonts/Quicksand-Bold.ttf')
	// 	});
	// 	console.log("load ASync result", result);
	// }

	/**
	 * This useEffect handles pre-fetching initial set of recipes from the API, and only after the request is completed
	 * (or the request has taken too long) - will the Splash screen hide.
	 * TODO: Add an additional spinner icon to the splash screen, show it once the request takes more than 2 seconds.
	 * TODO: Add a toast (messagebox) showing a request failure, if we're unable to perform API request ATM.
	 */
	useEffect(() => {
		(async() => {
			console.log("Running App useEffect function, calling fetchRecipes @ pantryContext");
			setTimeout(async() => {
				let response = await fetchRecipes();	
				setLoaded(true);
			}, 2000);
			// let success = await loadFonts(); // TODO: debug this, loading fonts seems to be bugging somehow.
			
		})();
	}, []);

	return (
		<>
		<StatusBar
			animated={true}
			backgroundColor="#61dafb"
			barStyle={"dark-content"}
			showHideTransition={"fade"}
			hidden={false} />

		<AnimatedSplash
			translucent={true}
			isLoaded={loaded}
			logoImage={require("./assets/book2.png")}
			backgroundColor={"#8BCF89"}
			logoHeight={200}
			logoWidth={200}>
			{NavigationSection()}
		</AnimatedSplash>
		</>
	)
}


const NavigationSection = () => (
	
	<NavigationContainer>
		<Tab.Navigator
			// tabOptions={{headerShown: true}}
			screenOptions={({route}) => ({
				
				tabBarIcon: ({focused, color, size}) => {
					let iconName;
					if (route.name == 'Reseptit') {
						return <Image style={{width:26, height:19}}  source={require('./assets/recipes.png')} />
					} else if (route.name == 'Ruokakomero') {
						return <Image style={{width:19, height:19}}  source={require('./assets/pantry.png')} />
					}
					// You can return any component that you like here!
					// return <Ionicons name={iconName} size={size} color={color}/>;
					
				},
			})}
			
			tabBarOptions={{
				headerShown:true,
				headerBackTitle:" ",
				headerTitleAlign:"center",
				labelStyle: {
					fontSize:14,
					paddingBottom:4
				},
				
				activeTintColor: '#4AAE47',
				inactiveTintColor:'gray',
			}}
			>
			<Tab.Screen name="Reseptit" component={CardsWrapper}  />
			<Tab.Screen name="Ruokakomero" component={PantryScreen} />
		</Tab.Navigator>
	</NavigationContainer>
	
);

const LogoTitle = (props) => {
	return (
		<View style={{height:100,alignItems:"center", justifyContent:"center"}}>
			<TextInput
				style={{borderBottomWidth:1, borderBottomColor:"#ccc"}}
				placeholder="Millaista reseptiä etsit tänään?"
				placeholderTextColor={"#888"}
				onChangeText={() => console.log("moi")}
			/>
		</View>
	)
}


const CardsWrapper = () => {
	return (
		<Stack.Navigator
			screenOptions={{
				headerShown: true,
				headerTintColor:"#000",
				headerBackTitle:" ", // iOS shows "Back" if this isn't set as empty string
				headerTitleAlign:"center"}}>
			
			<Stack.Screen
				name="Reseptikirja"
				component={CardsScreen}
				/>
			<Stack.Screen name="Recipe" component={RecipeScreen} initialParams={{recipe:{title:""}}} />
		</Stack.Navigator>
	)
}