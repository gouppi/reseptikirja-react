import React,{useState, useEffect, useCallback,useRef} from 'react';
import PagerView from 'react-native-pager-view';

import {View, Text, StyleSheet,Image,Button,SectionList,TouchableOpacity} from 'react-native';

import {fetchSingleRecipe} from '../workers/APIWorker';
import {usePantryContext} from '../providers/PantryContext';

export default function Recipe({route,navigation}) {
	const [currentTab, setCurrentTab] = useState(0);
	const { recipe_id } = route.params;
	const [recipe, setRecipe] = useState({});
	const {keywords} = usePantryContext();
	const ref = useRef();
	const setPage = useCallback((page) => ref.current?.setPage(page), [true]);

	// When user navigates to recipe page, trigger API call to fetch full recipe data. (Search page has lite data).
	// After the fetch is complete, show the UI.
	useEffect(() => {
		const fetchRecipeData = async (id,kw) => {
			let data = await fetchSingleRecipe(id,kw);
			setRecipe(data);
		}
		fetchRecipeData(recipe_id, keywords);
	}, []);

	React.useLayoutEffect(() => {
		navigation.setOptions({
		headerRight: () => (
			<Button onPress={() => setCount(c => c + 1)} title="Update count" />
		),
		});
	}, [navigation]);



	return (
		recipe.hasOwnProperty('title') ? ( 
			<View style={styles.recipe}>
				<Image
					style={styles.cardImage}
					source={{uri: recipe.img}}
					/>

				<View style={styles.fill}>
					<View style={styles.recipeContent}>
						<Text style={styles.recipeTitle}>{recipe.title}</Text>
						<Text style={styles.recipeTime}>Valmistusaika {recipe.time} min</Text>
					</View>
					<View style={styles.buttonsContainer}>
						<TouchableOpacity onPress={() => {setCurrentTab(0); setPage(0);}}>
							<Text style={currentTab == 0 ? styles.btnActive : styles.btnNotActive}>Ainesosat</Text>
						</TouchableOpacity>

						<TouchableOpacity onPress={() => {setCurrentTab(1); setPage(1); } }>
							<Text style={currentTab == 1 ? styles.btnActive : styles.btnNotActive}>Resepti</Text>
						</TouchableOpacity>
					</View>

					<PagerView
						ref={ref}
						style={{flex:1}}
						onPageScroll={(e) => {
								setCurrentTab(e.nativeEvent.position);
						}}
						initialPage={currentTab}
						>

						<View key="1" style={styles.view}>
							<SectionList
									showsVerticalScrollIndicator={false}
									showsHorizontalScrollIndicator={false}
									sections={recipe.ingredients}
									keyExtractor={(item, index) => item + index}
									renderItem={({item}) => (
										<Text style={{fontSize:16,marginBottom:8}}>{item.amount +  " " + item.unit + " " +  item.ingredient}</Text>)
									}
									renderSectionHeader={({ section: { section } }) => (
										// <View style={{borderBottomWidth:1}}>
											<Text style={{backgroundColor:"#fff",fontSize:20, paddingBottom:16}}>{section}</Text>
										// </View>
									)}
								/>
						</View>

						<View key="2" style={styles.view}>
						<SectionList
									showsVerticalScrollIndicator={false}
									showsHorizontalScrollIndicator={false}
									sections={recipe.steps}
									keyExtractor={(item, index) => item + index}
									renderItem={({item, index, section}) => (

										<>
											<Text style={{fontSize:15,marginBottom:8}}>{item}</Text>
											{section.time && section.data.length - 1 == index && (
												<View style={styles.alertButton}>
													<TouchableOpacity>
														<Text style={styles.btnActive}>Hälytä minulle {section.time} min kuluttua</Text>
													</TouchableOpacity>
												</View>
											)}
										</>

									)}
									renderSectionHeader={({ section: { section } }) => (
										// <View style={{borderBottomWidth:1}}>
											<Text style={{backgroundColor:"#fff",fontSize:20, paddingBottom:16}}>{section}</Text>
										//  </View>
									)}
								/>
						</View>
					</PagerView>
				</View>
			</View>
		) : ( <View style={{flex:1,justifyContent:"center",alignItems:"center"}}><Text>Loading</Text></View>)
	);
}

const styles = StyleSheet.create({
	recipe:{
		flex:1,
		marginLeft:16,
		marginRight:16,
		paddingTop:60,
	},
	fill: {
		 flex:1,
		 backgroundColor:"#fff"
	},
	view: {
		padding:16,
	},
	alertButton: {
		marginTop:8,
		marginBottom:8,
		alignItems:'center',
	},

	buttonsContainer: {
		marginTop:4,
		flexDirection:'row',
		justifyContent:'space-evenly',
	},
	btnActive: {
		fontSize:16,
		borderRadius:15,
		borderWidth:1,
		paddingVertical:6,
		paddingHorizontal:12,
		color: "#fff",
		backgroundColor:"#8BCF89",
		borderColor:"#c8c8c8"

	},
	btnNotActive: {
		fontSize:16,
		borderRadius:15,
		borderWidth:1,
		paddingVertical:6,
		paddingHorizontal:12,
		color: "#232323",

		backgroundColor:"#AEAEAE",
		opacity:0.45,
		borderColor:"#c8c8c8"

	},


	container: {
		//padding:10,
		//marginHorizontal:16,
		//  flex:1,/
	},

	recipeContent: {
		justifyContent:'center',
		alignItems:'center',
		flexDirection:'column',


	},
	recipeTitle: {
		paddingTop:10,
		fontSize: 24,
	},
	recipeTime: {
		// paddingTop:4,
		paddingBottom:4,
	},

	recipeTabs: {
		flex:1,
		paddingTop:20,
		fontSize:14,
		width:"100%",
		justifyContent: 'space-evenly',
		flexDirection:'row'
	},

	cardImage: {
		flex:1,
		borderTopLeftRadius: 15,
		borderTopRightRadius: 15,
		width: "100%",
		height: 250,
		maxHeight: 150,
	},
})