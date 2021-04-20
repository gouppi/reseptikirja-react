import React,{useState} from 'react';
import { Tab, TabView } from 'react-native-easy-tabs';

import {View, Text, StyleSheet,Image,Button} from 'react-native';

export default function Recipe({route,navigation}) {
	const [currentTab, setCurrentTab] = useState(0);
	const { recipe } = route.params;

	return (
		<View style={styles.recipe}>
			<Image
				style={styles.cardImage}
				source={{uri: recipe.img}}
				/>
			<View style={styles.recipeContent}>
				<Text style={styles.recipeTitle}>{recipe.title}</Text>
				<Text style={styles.recipeTime}>Valmistusaika {recipe.time} min</Text>

				<View style={styles.buttonsContainer}>
					<Button style={styles.button} title="Ainesosat" onPress={() => setCurrentTab(0)} />
					<Button style={styles.button} title="Resepti" onPress={() => setCurrentTab(1)} />
				</View>

				<View style={{width:'100%'}}>
				<TabView selectedTabIndex={currentTab}>
					<Tab>
						<View style={styles.container}>
							<Text style={styles.paragraph}>This is tab 1</Text>
						</View>
					</Tab>

					<Tab lazy>
						<View style={styles.container}>
						<Text style={styles.paragraph}>
							Second tab here, yo
						</Text>
						</View>
					</Tab>
				</TabView>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	recipe:{
		flex:1,
		justifyContent:'center',
		alignItems: 'center',
		paddingTop:80,
		paddingLeft: 15,
		paddingRight: 15,
		//backgroundColor:"#fff",
		height:"100%",
	},
	fill: {
		 flex:1,
	},

	buttonsContainer: {
		marginTop:4,
		flexDirection:'row',
		justifyContent:'space-evenly',
		width:'100%',
	},
	button: {
		backgroundColor: "#fff",
		color:"#000",
		fontSize:20
	},
	container: {
		padding:10,
		flex:1,
	},

	recipeContent: {
		flex:1,
		height:"100%",
		width:"100%",
		alignItems: 'center',
		backgroundColor:"#ffffff"
	},
	recipeTitle: {
		paddingTop:20,
		fontSize: 24,
	},
	recipeTime: {
		paddingTop:4,
	},

	recipeTabs: {
		flex:1,
		paddingTop:30,
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