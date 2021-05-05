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

	const getGreetingByDeviceTime = () => {
		// TODO: greeting based on date time here?
		return "Hyvää iltapäivää!";
	}

	return (
		<View style={styles.cardsContainer}>
			<FlatList
				// stickyHeaderIndices={[0]}
				showsVerticalScrollIndicator={false}
				ListHeaderComponent={
				<>
					<Text style={styles.greeting}>{getGreetingByDeviceTime()}</Text>
					<TextInput
						style={styles.input}
						placeholder="Millaista reseptiä etsit tänään?"
						placeholderTextColor={"#888"}
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
	);
}

const styles = StyleSheet.create({
	cardsContainer: {
		marginTop:10,
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
		height: 44,
		marginBottom: 20,
		marginTop: 10,
		paddingTop: 4,
		paddingBottom: 4,
		textAlign: "center",
		borderWidth: 1,
		borderRadius: 10,
	},
	greeting: {
		textAlign: "center",
		fontSize: 24,
		fontWeight: "500"
	},
	flatList: {
		// flex:1
	},
});
