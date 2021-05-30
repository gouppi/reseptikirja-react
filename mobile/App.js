import React from 'react';
import {StatusBar, Image,View,Text,TextInput,Button} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import AnimatedSplash from "react-native-animated-splash-screen";
import { SingleRecipe as RecipeScreen } from './screens/SingleRecipe';
import CardsScreen from './screens/Cards';
import PantryScreen from './screens/Pantry';
import NewRecipeScreen from './screens/NewRecipe';
import IngredientModal from './modals/IngredientModal';
import {usePantryContext, PantryContextProvider} from './providers/PantryContext';
import {ThemeProvider} from 'react-native-elements';
import { useFonts } from 'expo-font';
import { useTheme } from 'react-native-elements';
import 'react-native-gesture-handler';
import AddNewRecipeIngredient from './modals/AddNewRecipeIngredient';

import Toast from 'react-native-toast-message';


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const PantryStack = createStackNavigator();

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
			<Toast ref={(ref) => Toast.setRef(ref)} />
		</ThemeProvider>
	);
}

/**
 * Wrapper component is used only because we need App component to initialize context before.
 */

const Wrapper = (props) => {
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
					} else if (route.name == "Uusi Resepti") {
						return <Image style={{width:20, height:20}}  source={require('./assets/add.png')} />
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
				activeTintColor: theme.colors.primary,
				inactiveTintColor:'gray',
			}}
			>
			<Tab.Screen name="Reseptit" component={RecipeWrapper}  />
			<Tab.Screen name="Uusi Resepti" component={NewRecipeWrapper} />
			<Tab.Screen name="Ruokakomero" component={PantryWrapper} />
		</Tab.Navigator>
	</NavigationContainer>
	
);

const NewRecipeWrapper = () => {
	const {theme} = useTheme();
	return (
		<Stack.Navigator
			screenOptions={{
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
				name="Uusi Resepti"
				component={NewRecipeScreen} />
			<Stack.Screen
				name="Lisää ainesosa"
				component={AddNewRecipeIngredient} />
		</Stack.Navigator>
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