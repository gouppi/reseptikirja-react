import React, { useState } from "react";
import {
	StyleSheet,
	Text,
	TextInput,
	View,
	FlatList,
	TouchableWithoutFeedback,
	ScollView
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

	return (
		<View style={styles.cardsContainer}>
			<FlatList
				ListHeaderComponent={
				<>
					<Text style={styles.greeting}> Moikka Janne!</Text>
					<TextInput
						style={styles.input}
						placeholder="Millaista reseptiä etsit tänään?"
						onChangeText={changeSearchText}
						value={searchParam}
					/>
				</>}
				style={styles.flatList}
				data={recipes}
				keyExtractor={d => "recipe_" + d.id}
				renderItem={(d) => (
					<TouchableWithoutFeedback
						onPress={() =>
							navigation.navigate("Recipe", {
								recipe: d.item,
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
	);
}

const styles = StyleSheet.create({
	cardsContainer: {
		paddingTop: 40,
		paddingLeft: 15,
		paddingRight: 15,
		flex: 1,
		backgroundColor: "#F6F6F6",
		justifyContent: "center",
	},
	textAndInput: {
		flex: 1,
	},
	input: {
		width: "100%",
		borderColor: "#c8c8c8",
		backgroundColor: "#fff",
		height: 40,
		marginBottom: 20,
		marginTop: 10,
		paddingTop: 4,
		paddingBottom: 4,
		textAlign: "center",
		borderWidth: 1,
		borderRadius: 15,
	},
	greeting: {
		textAlign: "center",
		fontSize: 24,
		fontWeight: "600",
	},
	flatList: {
		// flex:1
	},
});
