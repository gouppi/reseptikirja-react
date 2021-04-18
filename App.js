import React, {useState, useEffect} from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';

import AnimatedSplash from "react-native-animated-splash-screen";

import HomeScreen from './screens/Home';
import SettingsScreen from './screens/Settings';

const Tab = createBottomTabNavigator();

export default function App() {
	const [loaded, setLoaded] = useState(false);
	useEffect(() => {
		setTimeout(() => {
			setLoaded(true);
		}, 3000);
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
	);
}


const NavigationSection = () => (
	<NavigationContainer>
		<Tab.Navigator
			screenOptions={({route}) => ({
				tabBarIcon: ({focused, color, size}) => {
					let iconName;
					if (route.Name == 'Home') {
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
			<Tab.Screen name="Home" component={HomeScreen} />
			<Tab.Screen name="Settings" component={SettingsScreen} />
		</Tab.Navigator>
	</NavigationContainer>
);