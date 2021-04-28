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
import DATA from '../dummydata';

export default function Cards({ navigation }) {
	const [text, onChangeText] = useState("");

	return (
		<View style={styles.cardsContainer}>


			<FlatList
				ListHeaderComponent={
				<>
					<Text style={styles.greeting}> Moikka Janne!</Text>
					<TextInput
						style={styles.input}
						placeholder="Millaista reseptiä etsit tänään?"
						onChangeText={onChangeText}
						value={text}
					/>
				</>}
				style={styles.flatList}
				data={DATA}
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
		// flexDirection: 'column',
		backgroundColor: "#F6F6F6",
		// alignItems: 'center',
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
