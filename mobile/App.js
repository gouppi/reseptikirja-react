import React from 'react';
import {StatusBar, Image,View,Text,TextInput,Button} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import AnimatedSplash from "react-native-animated-splash-screen";
import 'react-native-gesture-handler';

import { SingleRecipe as RecipeScreen } from './screens/SingleRecipe';
import CardsScreen from './screens/Cards';
import PantryScreen from './screens/Pantry';

import IngredientModal from './modals/IngredientModal';

// import NewIngredientScreen from './screens/depr_NewIngredient';
// import ImmersiveMode from 'react-native-immersive-mode'; // TODO: CHECK LATER linking issues TODO REMOVE AS USELESS?
// import Ionicons from '@expo/vector-icons/Ionicons'; // TODO remove as useless, use svgs! TODO REMOVE AS USELESS?
// import * as Svg from 'react-native-svg'; TODO CHECK LATER NAVIGATOR DOES NOT LIKE THIS TODO REMOVE AS USELESS?

import {usePantryContext, PantryContextProvider} from './providers/PantryContext';

import {ThemeProvider} from 'react-native-elements';
import { useFonts } from 'expo-font';
import { useTheme } from 'react-native-elements';


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const theme = {
	colors: {
		primary: "#4AAE47",
		secondary: "#63BE60",
		white: "#fff",
		black:"#000",
		grey0:"#c8c8c8",
		grey1:"#8F8F8F",
		grey2: "#EBEBEB",
		error: "#CC0000",
	},
	Text: {
		style: {
			fontFamily: "Quicksand"
		}
	},
	Button: {
		titleStyle: {
			fontFamily:"Quicksand-Medium"
		}
	}
}

const screenOptions = {
	headerTitleStyle:{fontFamily:"Quicksand-Bold", letterSpacing:0.5},
	headerStyle:{
		borderBottomWidth:1,
		borderBottomColor:theme.colors.grey2,
	},
	headerShown: true,
	headerTintColor:"#000",
	headerBackTitle:" ", // iOS shows "Back" if this isn't set as empty string
	headerTitleAlign:"center"
}

export default function App() {

	const [fontLoaded] = useFonts({
		"Quicksand-Bold": require('./assets/fonts/Quicksand-Bold.ttf'),
		"Quicksand-Light": require('./assets/fonts/Quicksand-Light.ttf'),
		"Quicksand-Medium": require('./assets/fonts/Quicksand-Medium.ttf'),
		"Quicksand": require('./assets/fonts/Quicksand-Regular.ttf'),
		"Quicksand-Semibold": require('./assets/fonts/Quicksand-SemiBold.ttf'),
	});

	if (!fontLoaded) {
		return null;
	}

	return (
		<ThemeProvider theme={theme}>
			<PantryContextProvider>
				<Wrapper/>
			</PantryContextProvider>
		</ThemeProvider>
	);
}

/**
 * Wrapper component is used only because we need App component to initialize context before.
 */

const Wrapper = () => {
	const {hasBeenInit} = usePantryContext();
	const {theme} = useTheme();
	

	return (
		<>
			<StatusBar
				animated={true}
				barStyle={"dark-content"}
				showHideTransition={"fade"}
				hidden={false} />

			<AnimatedSplash
				translucent={true}
				isLoaded={hasBeenInit}
				logoImage={require("./assets/book2.png")}
				backgroundColor={theme.colors.grey2}
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
				labelPosition:"below-icon",
				headerTitleAlign:"center",
				labelStyle: {
					fontFamily:"Quicksand-Semibold",
					fontSize:12,
					paddingBottom:2
				},
				
				activeTintColor: '#000',
				inactiveTintColor:'gray',
			}}
			>
			<Tab.Screen name="Reseptit" component={RecipeWrapper}  />
			<Tab.Screen name="Ruokakomero" component={PantryWrapper} />
		</Tab.Navigator>
	</NavigationContainer>
	
);

const HeaderTitle = (props) => {
	return (
		<View style={{display:"flex", flexDirection:"row", alignItems:"center", justifyContent:"space-between"}}>
			<Image style={{width:19, height:19}}  source={require('./assets/pantry.png')} />
			<Text>ReseptiKirjan logo</Text>
		</View>
	)
}

const RecipeWrapper = () => {
	const {theme} = useTheme();
	return (
		<Stack.Navigator
			screenOptions={{
				// headerTitle: props => <HeaderTitle {...props} />,
				headerTitleStyle:{fontFamily:"Quicksand-Bold", letterSpacing:0.5},
				headerShown: true,
				headerTintColor:theme.colors.black,
				headerStyle:{
					borderBottomWidth:1,
					borderBottomColor:theme.colors.grey2,
				},
				headerBackTitle:" ", // iOS shows "Back" if this isn't set as empty string
				headerTitleAlign:"center",
				}}>
			
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
			screenOptions={screenOptions}>
			<PantryStack.Screen
				name="Ruokakomero"
				component={PantryScreen}
				/>
			<PantryStack.Screen name="Ainesosa" component={IngredientModal} />
		</PantryStack.Navigator>
	)
}