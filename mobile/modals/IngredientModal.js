import React from 'react'

export default function IngredientModal({navigation}) {
	<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
		<Text style={{ fontSize: 30 }}>This is a modal!</Text>
		<Button onPress={() => navigation.goBack()} title="Dismiss" />
	</View>
}