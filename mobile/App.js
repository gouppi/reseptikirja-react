import React, {useState, useEffect,useContext} from 'react';
import {StatusBar, Image,View,Text,TextInput,Button} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import AnimatedSplash from "react-native-animated-splash-screen";
import * as Font from 'expo-font';
import 'react-native-gesture-handler';

import RecipeScreen from './screens/RecipeNew';
import CardsScreen from './screens/Cards';
import PantryScreen from './screens/Pantry';

import IngredientModal from './modals/IngredientModal';

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
	const {hasBeenInit, recipes} = usePantryContext();
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
	// useEffect(() => {
	// 	(async() => {
	// 		console.log("Running App useEffect function, calling fetchRecipes @ pantryContext");
	// 		setTimeout(async() => {
	// 			let response = await fetchRecipes();	
	// 			setLoaded(true);
	// 		}, 2000);
	// 		// let success = await loadFonts(); // TODO: debug this, loading fonts seems to be bugging somehow.
			
	// 	})();
	// }, []);

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
				isLoaded={hasBeenInit}
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
			tabOptions={{headerShown: true}}
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
			<Tab.Screen name="Reseptit" component={RecipeWrapper}  />
			<Tab.Screen name="Ruokakomero" component={PantryWrapper} />
		</Tab.Navigator>
	</NavigationContainer>
	
);

const RecipeWrapper = () => {
	return (
		<Stack.Navigator
			screenOptions={{
				headerShown: true,
				headerTintColor:"#000",
				headerBackTitle:" ", // iOS shows "Back" if this isn't set as empty string
				headerTitleAlign:"center",
				headerRight: () => (
					<Button
					  onPress={() => alert('This is a button!')}
					  title="Info"
					  color="#000"
					/>
				  )}}>
			
			<Stack.Screen
				name="Reseptikirja"
				component={CardsScreen}
				
				/>
			<Stack.Screen name="Recipe" component={RecipeScreen} initialParams={{recipe:{title:""}}} />
		</Stack.Navigator>
	)
}

const PantryStack = createStackNavigator();
const PantryWrapper = () => {
	return (
		<PantryStack.Navigator
			screenOptions={{
				headerShown: true,
				headerTintColor:"#000",
				headerBackTitle:" ", // iOS shows "Back" if this isn't set as empty string
				headerTitleAlign:"center"}}>
			
			<PantryStack.Screen
				name="Ruokakomero"
				component={PantryScreen}
				/>
			<PantryStack.Screen name="Ainesosa" component={IngredientModal} />
		</PantryStack.Navigator>
	)
}



/**
	Kun ladataan tiedot -> lähetetään keywordsit backendille ja tehdään ehkä sorttaus.
	Nyt recipe-data on UI:ssa ja recipet statessa. 
	Jos käyttäjä nyt menee ja vaihtaa ingredients-listaa pantry-sivulla, PantryContextissa muuttuu mahdollisesti
	keywords-array.

	Jos keywords array muuttuu:

	- sorttaus ei välttämättä enää pidä paikkaansa (käyttäjä on sortannut ainesosien mukaan, ja sen jälkeen poistaa ainesosat)
	
	-> Fix:

	useEffect-hookki kuuntelemaan jos keywords muuttuu, ja tehdään uusi recipe haku.

	removeItemFromDeviceStorage - manipuloi suoraan AsyncStorageWorkeria

	TODO: jos/kun listan sorttaus ja haluaa sortata ainesosien mukaan, triggeröi automaattisesti uudelleenhaku HETI kun keywords muuttuu
	TODO: Jos pantryContext singleRecipe ei ole tyhjä ja vaihtaa keywords, triggeröi uudelleentarkistus ainesosille!!!!
 */