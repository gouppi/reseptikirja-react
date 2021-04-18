import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

export default function Recipe({route,navigation}) {
	const { recipe } = route.params;
	return (
		<View style={styles.recipe}>
			<Text>Recipe page working correctly</Text>
			<Text>{recipe.title}</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	recipe:{
		flex:1,
		justifyContent:'center',
		alignItems: 'center',
	}
})