import React from 'react'
import { View,Text,Button } from 'react-native'


export default function NewIngredient({route, navigation}) {
	const ean = route.ean;
	return (
		<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
			<Text style={{ fontSize: 30 }}>This is a New ingredient View!</Text>
			<Text>{ean}</Text>
			<Button onPress={() => navigation.goBack()} title="Dismiss" />
		</View>
	)
}