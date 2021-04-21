import React,{useState, useEffect} from 'react';
import { Tab, TabView } from 'react-native-easy-tabs';

import {View, Text, StyleSheet,Image,Button,SectionList,Dimensions,TouchableOpacity} from 'react-native';

export default function Recipe({route,navigation}) {
	const [currentTab, setCurrentTab] = useState(0);
	const [width, setWidth] = useState(Dimensions.get('window').width);
	const { recipe } = route.params;

	useEffect(() => {
		console.log("Setting window change event listener");
		Dimensions.addEventListener('change', ({window}) => {
			setWidth(window.width);
		})
	}, []);

	return (
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
					<TouchableOpacity onPress={() => setCurrentTab(0)}>
						<Text style={currentTab == 0 ? styles.btnActive : styles.btnNotActive}>Ainesosat</Text>
					</TouchableOpacity>

					<TouchableOpacity onPress={() => setCurrentTab(1)}>
						<Text style={currentTab == 1 ? styles.btnActive : styles.btnNotActive}>Resepti</Text>
					</TouchableOpacity>
					{/* <Button title="Ainesosat" onPress={() => setCurrentTab(0)} /> */}
					{/* <Button title="Resepti" onPress={() => setCurrentTab(1)} /> */}

				</View>

				<TabView
					// style={{marginVertical:8,marginHorizontal:16, textWrap:'wrap'}}
					selectedTabIndex={currentTab}
				>
					{/* <Tab style={{flex:1,marginVertical:8,marginHorizontal:16, textWrap:'wrap'}}> */}
					<Tab>
						<View style={{:16, backgroundColor:"#d8c7f2"}} >
						{/* <View style={{justifyContent:"center",alignItems:"center"}}>
							<Text>Ainesosat</Text>
						</View> */}
						<SectionList
								showsVerticalScrollIndicator={false}
								showsHorizontalScrollIndicator={false}
								sections={recipe.ingredients}
								keyExtractor={(item, index) => item + index}
								renderItem={({item}) => (<Text>{item}</Text>)}
								renderSectionHeader={({ section: { section } }) => (
									// <View style={{borderBottomWidth:1}}>
										<Text style={{fontSize:20}}>{section}</Text>
									// </View>
								)}
							/>
							</View>
					</Tab>

					<Tab style={{backgroundColor: "#f0c8c8",marginVertical:12,marginHorizontal:16, paddingHorizontal:4, textWrap:'wrap'}}>
						<SectionList
								showsVerticalScrollIndicator={false}
								showsHorizontalScrollIndicator={false}
								sections={recipe.steps}
								keyExtractor={(item, index) => item + index}
								renderItem={({item}) => (<Text>{item}</Text>)}
								renderSectionHeader={({ section: { section } }) => (
									// <View style={{borderBottomWidth:1}}>
										<Text style={{fontSize:20}}>{section}</Text>
									// </View>
								)}
							/>
					</Tab>

				</TabView>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	recipe:{
		flex:1,
		marginLeft:16,
		marginRight:16,
		paddingTop:60,
		// marginVertical:16,
	},
	fill: {
		 flex:1,
		 backgroundColor:"#fff"
	},

	buttonsContainer: {
		marginTop:4,
		flexDirection:'row',
		justifyContent:'space-evenly',
		backgroundColor:"#ccc" // DEBUG
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