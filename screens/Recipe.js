import React from 'react';
import {View, Text, StyleSheet,Image} from 'react-native';

export default function Recipe({route,navigation}) {
	const { recipe } = route.params;
	return (
		<View style={styles.recipe}>
			<Image
				style={styles.cardImage}
				source={{
					uri: recipe.img,
				}}
				/>
				<View style={styles.recipeContent}>
					<Text style={styles.recipeTitle}>{recipe.title}</Text>
					<Text style={styles.recipeTime}>Valmistusaika {recipe.time} min</Text>
					<View style={styles.recipeTabs}>
						<Text>Ainesosat</Text>
						<Text>Resepti</Text>
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