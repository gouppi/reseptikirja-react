import React from 'react';
import { StyleSheet, Text,View,Image} from 'react-native';

export default function Card({title,img}) {
	return (
		<View style={styles.card}>
			<Image
				style={styles.cardImage}
				source={{
					uri: img,
				}}
				/>
				<Text style={styles.text}>{title}</Text>
		</View>
	)
}

const styles = StyleSheet.create({
	card: {
		flex:1,
		borderTopLeftRadius: 15,
		borderTopRightRadius: 15,
		width: "100%",
		height: "auto",
		marginBottom:20,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.23,
		shadowRadius: 2.62,
		elevation: 4,
	},

	cardImage: {
		flex:1,
		borderTopLeftRadius: 15,
		borderTopRightRadius: 15,
		width: "100%",
		height: 150,
		maxHeight: 150,


	},
	text: {
		backgroundColor: "#fff",
		height: 36,
		paddingLeft: 8,
		paddingTop: 8,
		fontSize: 14
	}

});