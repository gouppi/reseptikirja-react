import React, {useState, useEffect} from 'react';
import { View, SafeAreaView,Image,ScrollView,SectionList, Animated,Button,TouchableWithoutFeedback,ActivityIndicator} from 'react-native'
import {usePantryContext} from '../providers/PantryContext';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Text, useTheme } from 'react-native-elements';


const Tab = createMaterialTopTabNavigator();

export function SingleRecipe({route, navigation}) {
	const {fetchSingleRecipe, singleRecipe, setSingleRecipe} = usePantryContext();
	const {recipe_id} = route.params;
	const {theme} = useTheme();
	// When user navigates to recipe page, trigger API call to fetch full recipe data. (Search page has lite data).
	// After the fetch is complete, show the UI.
	useEffect(() => {
		fetchSingleRecipe(recipe_id);
		return () => setSingleRecipe(null);
	}, []);

	React.useLayoutEffect(() => {
		navigation.setOptions({
			headerTitle: singleRecipe ? singleRecipe.title : "",
			});
	}, [navigation, singleRecipe]);


	return (
		singleRecipe === null ? (<View style={{flex:1,justifyContent:"center",alignItems:"center"}}><ActivityIndicator color={theme.colors.grey1}/></View>) :
			(
				<SafeAreaView style={{flex:1}}>
					
					<Image
						style={{height:200,width:"100%"}}
						source={{uri: singleRecipe.img}}
						/>
					<Tab.Navigator
						tabBarOptions={{
							labelStyle:{
								fontFamily:"Quicksand-Bold"
							},
							indicatorStyle :{
								backgroundColor:theme.colors.secondary
							}}}
						style={{flex:1}} backBehavior={"none"}  >
						<Tab.Screen style={{flex:1, minHeight:"100%"}} name="Tarvitset nämä" component={IngredientsTab}/>
						<Tab.Screen name="Valmistus" component={RecipeTab} />
					</Tab.Navigator>
				</SafeAreaView>
			)
		)
	}

const IngredientsTab = ({props}) => {
	const {singleRecipe} = usePantryContext();
	return (
		<View style={{flex:1, paddingHorizontal:20, backgroundColor:"#fff"}}>
			<SectionList
				style={{backgroundColor:"#fff"}}
				showsVerticalScrollIndicator={false}
				showsHorizontalScrollIndicator={false}
				sections={singleRecipe.ingredients}
				keyExtractor={(item, index) => item + index}
				renderItem={({item}) => <IngredientsItem {...item} />
				}
				renderSectionHeader={({ section: { section } }) => <SectionHeader header={section} />}
			/>
		</View>);
}

const SectionHeader = ({header}) => {
	return (
		<View style={{padding:8, backgroundColor:"#fff", width:"100%", borderBottomWidth:1, borderBottomColor: "#ddd"}}>
			<Text style={{fontFamily:"Quicksand-Medium",fontSize:20}} >{header}</Text>
		</View>
	)
}

const IngredientsItem = (item) => {
	const {theme} = useTheme();
	return (
		<View style={{display:"flex",flexDirection:"row", justifyContent:"space-between", alignItems:"center", padding:8, paddingTop:16, backgroundColor:"#fff", width:"100%", borderBottomWidth:1, borderBottomColor: "#f8f8f8"}}>
			<View style={{display:"flex"}}>
				<Text style={{fontSize:16, fontFamily:"Quicksand-Medium", paddingBottom:4}}>
					{item.ingredient} {item.in_pantry && ( <Ionicons name="checkmark" size={16} color={theme.colors.primary}/> )}
				</Text>

				<Text style={{fontSize:14, fontFamily:"Quicksand", color:theme.colors.grey1}}>
					{item.amount +  " " + item.unit + (item.in_pantry ? ", ruokakomerossa" : "") }
				</Text>
			</View>
		</View>
	)
}


const RecipeTab = () => {
	const {singleRecipe} = usePantryContext();
	return (
		<View style={{flex:1, paddingHorizontal:20, backgroundColor:"#fff"}}>
		<SectionList
			style={{backgroundColor:"#fff"}}
			showsVerticalScrollIndicator={false}
			showsHorizontalScrollIndicator={false}
			sections={singleRecipe.steps}
			keyExtractor={(item, index) => item + index}
			renderItem={({item, index, section}) => (
				<TouchableWithoutFeedback
					onPress={() =>
							console.log("foo")
						}
					>
					<View style={{padding:8, paddingTop:16, backgroundColor:"#fff", width:"100%", borderBottomWidth:1, borderBottomColor: "#ddd"}}>
						<Text style={{fontSize:15,marginBottom:8}}>{item}</Text>
						{section.time && section.data.length - 1 == index && (
							<View style={styles.alertButton}>
								<TouchableOpacity>
									<Text style={styles.btnActive}>Hälytä minulle {section.time} min kuluttua</Text>
								</TouchableOpacity>
							</View>
						)}
					</View>
				</TouchableWithoutFeedback>

			)}
			renderSectionHeader={({ section: { section } }) => <SectionHeader header={section} />}
		/>
		</View>
	);
}


