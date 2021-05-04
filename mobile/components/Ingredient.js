import React from "react";
import {
	StyleSheet,
	Text,
	View,
	Image,
	TouchableNativeFeedback,
} from "react-native";
import Chip from "./Chip";

export default function Ingredient({item, onClick}) {
	return (
		<TouchableNativeFeedback id={item.ean} onPress={() => onClick(item)}>
			<View style={styles.ingredient}>
				<Image style={styles.image} source={{uri: item.image_url}} />
				<View style={styles.data}>
					<Text style={styles.name}>{item.name}</Text>
					<Text style={styles.brand}>{item.brand}</Text>
					<Text style={styles.ean}>{item.ean}</Text>
					<View style={styles.keywordsContainer}>
						{item.keywords?.map((keyword, i) => (
							<Chip key={i} text={keyword} />
						))}
					</View>
				</View>
			</View>
		</TouchableNativeFeedback>
	);
}

const styles = StyleSheet.create({
	ingredient: {
		// flex:1,
		marginBottom: 8,
		width: "100%",
		paddingVertical: 20,
		display: "flex",
		flexDirection: "row",
		backgroundColor: "#fff",
		borderRadius: 16,
		elevation: 10,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.23,
		shadowRadius: 2.62,
	},
	image: {
		height: 48,
		maxWidth: "20%",
		width: "10%",
		resizeMode: "contain",
		marginHorizontal: 10,
	},
	data: {
		display: "flex",
		flexDirection: "column",
	},
	name: {
		fontSize: 16,
	},
	keywordsContainer: {
		paddingTop: 8,
		display: "flex",
		flexDirection: "row",
		justifyContent: "flex-start",
	},
});
