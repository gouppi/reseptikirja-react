import React from 'react';
import { StyleSheet, Text,View,Image} from 'react-native';

export default function Card({title,img}) {
	return (
		<View style={styles.card}>
			<Image
				style={styles.cardImage}
				source={{uri: img}}
				/>
				<View style={styles.textContainer}>
					<Text style={styles.title}>{title}</Text>
					{/* <Text style={styles.text}>foo foofoo </Text> */}
				</View>
		</View>
	)
}

const styles = StyleSheet.create({
	card: {
		backgroundColor:"#fff",
		flex:1,
		borderTopLeftRadius: 10,
		borderTopRightRadius: 10,
		borderBottomLeftRadius:10,
		borderBottomRightRadius:10,
		width: "98%",
		height: "auto",
		marginLeft: "auto",
		marginRight: "auto",
		marginBottom:20,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 1,
		},
		shadowOpacity: 0.22,
		shadowRadius: 2.22,
		elevation: 3,
	},

	cardImage: {
		flex:1,
		borderTopLeftRadius: 10,
		borderTopRightRadius: 10,
		width: "100%",
		height: 150,
		maxHeight: 150,
	},
	textContainer: {
		paddingLeft: 8,
		paddingTop:8,
		paddingBottom:8
	},

	title: {
		fontSize: 16,
		fontWeight: "400",
	}
});