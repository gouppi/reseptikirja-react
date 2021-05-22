import React, { useState } from "react";
import {
	StyleSheet,
	Text,
	TextInput,
	View,
	FlatList,
	TouchableWithoutFeedback,
	ScollView,
	RefreshControl,
	ActivityIndicator
} from "react-native";
import Card from "../components/Card";
import {usePantryContext} from '../providers/PantryContext';

let x;
export default function Cards({ navigation }) {
	const {ingredients,recipes, fetchRecipes} = usePantryContext();
	const [searchParam, updateSearchParam] = useState("");
	const [isQuerying, setIsQuerying] = useState(false);

	const changeSearchText = (text) => {
		updateSearchParam(text);
		clearTimeout(x);
		x = setTimeout( async () => {
			if (isQuerying) return; // don't allow DoS, wait for first query to return. TODO: CANCEL INITIAL REQUESTS.
			setIsQuerying(true);
			let data = await fetchRecipes(text);
			setIsQuerying(false);
		}, 1000);
	}

	// const refreshList = async () => {
	// 	setIsQuerying(true);
	// 	await fetchRecipes();
	// 	setIsQuerying(false);
	// }

	// const getGreetingByDeviceTime = () => {
		// TODO: greeting based on date time here?
		// return "Hyvää iltapäivää!";
	// }

	return (recipes && recipes.length > 0) ? (

		<View style={styles.cardsContainer}>
			<FlatList
				refreshControl={
				<RefreshControl
					refreshing={isQuerying}
					onRefresh={() => {fetchRecipes()}}
					/>
				}

				showsVerticalScrollIndicator={false}
				stickyHeaderIndices={[0]}
				ListHeaderComponent={
				<View style={styles.inputContainer}>
					<TextInput
						style={styles.input}
						placeholder="Millaista reseptiä etsit tänään?"
						placeholderTextColor={"#888"}
						onChangeText={changeSearchText}
						value={searchParam}
					/>
				</View>}
				style={styles.flatList}
				data={recipes}
				keyExtractor={d => "recipe_" + d.id}
				renderItem={(d) => (
					<TouchableWithoutFeedback
						onPress={() =>
							navigation.navigate("Recipe", {
								recipe_id: d.item.id,
							})
						}
					>
						<View>
							<Card {...d.item} />
						</View>
					</TouchableWithoutFeedback>
				)}
			/>
		</View>
	) : (
		<View style={styles.cardsContainer}>
			<View style={styles.inputContainer}>
					<TextInput
						style={styles.input}
						placeholder="Millaista reseptiä etsit tänään?"
						placeholderTextColor={"#888"}
						onChangeText={changeSearchText}
						value={searchParam}
					/>
			</View>
			<View style={{flex:1, justifyContent:"center",alignItems:"center"}}>
				<Text>En löytänyt yhtään reseptiä.</Text>
			</View>
		</View>
	) ;
}

const styles = StyleSheet.create({
	cardsContainer: {
		paddingLeft: 15,
		paddingRight: 15,
		flex: 1,
		backgroundColor: "#fff",
		justifyContent: "center",
	},
	textAndInput: {
		flex: 1,
	},
	inputContainer: {
		backgroundColor: "#fff",
		width:"100%",
		paddingVertical:10,
		marginBottom:5,
	},
	input: {
		borderColor: "#c8c8c8",
		backgroundColor: "#fff",
		height: 40,
		paddingTop: 4,
		paddingBottom: 4,
		textAlign: "center",
		borderBottomWidth: 1,
		borderBottomColor:"#d8d8d8",
		borderRadius: 5,
	},
	greeting: {
		textAlign: "center",
		fontSize: 24,
		fontWeight: "500"
	},
	flatList: {
		flex:1
	},
});
