import React, {useState} from "react";
import {
	StyleSheet,
	Text,
	View,
	SafeAreaView,
	FlatList,
} from "react-native";
import {BarCodeScanner} from "expo-barcode-scanner";

import {usePantryContext} from "../providers/PantryContext";

import Ingredient from "./../components/Ingredient";
import StyledButton from "./../components/StyledButton";
import BetterButton from "./../components/BetterButton";


export default function Pantry({navigation}) {
	const [scanningMode, setScanningMode] = useState(false);
	const [hasPermission, setHasPermission] = useState(null);
	const {ingredients} = usePantryContext();

	/* This validates camera permissions */
	const validatePermissions = async () => {
		if (!hasPermission) {
			const {status} = await BarCodeScanner.requestPermissionsAsync();
			setHasPermission(status === "granted");
		}
	};

	const barCodeScanned = async ({type, data}) => {
		setScanningMode(false);
		console.log("SENDING NAVIGATION: ", navigation);
		navigation.navigate('Ainesosa', {newEan: data, navigation: navigation});
	}

	return (
		<SafeAreaView style={styles.container}>
			{scanningMode ? (
				<>
					<BarCodeScanner
						onBarCodeScanned={scanningMode && barCodeScanned}
						style={StyleSheet.absoluteFillObject}
					/>
					<View style={{position: "absolute", bottom: 20}}>
						<StyledButton
							cancelButton
							onPress={() => setScanningMode(false)}
							title="Peruuta"
						/>
					</View>
				</>
			) : (
				<>
					<View
						style={{
							marginTop:10,
							paddingTop:15,
							height: "90%",
							width: "100%",
							marginBottom: 10,
						}}>
						{ingredients.length > 0 ? (
							<FlatList
								style={{width: "100%", paddingHorizontal: 10}}
								data={ingredients}
								keyExtractor={item => "ingredient_" + item.ean}
								renderItem={({item, index}) => (
									<Ingredient
										key={index}
										item={item}
										onClick={() => navigation.navigate('Ainesosa', {newEan: item.ean})}
									/>
								)}
							/>
						) : (
							<View
								style={{
									flex: 1,
									justifyContent: "center",
									alignItems: "center",
								}}>
								<Text>
									Sinulla ei ole yhtään tuotetta
									ruokakomerossasi.
								</Text>
								<Text>
									Aloita skannaamalla elintarvikkeiden
									viivakoodeja.
								</Text>
							</View>
						)}
					</View>
					<View style={{marginBottom: 20}}>
						<BetterButton
							title={"Skannaa viivakoodi"}
							onPress={async () => {
								await validatePermissions();
								setScanningMode(true);
							}}
						/>
					</View>
					
				</>
			)}
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#F6F6F6",
		alignItems: "center",
		justifyContent: "center",
	}
});
