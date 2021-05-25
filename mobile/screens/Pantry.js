import React, {useState, useEffect} from "react";
import {
	StyleSheet,
	Text,
	View,
	SafeAreaView,
	FlatList,
} from "react-native";

import {BarCodeScanner} from "expo-barcode-scanner";
import {usePantryContext} from "../providers/PantryContext";
import { ListItem, Avatar, Button } from 'react-native-elements'
import { useTheme } from 'react-native-elements';
import {BASE_URL} from '../workers/APIWorker';

export default function Pantry({navigation}) {
	const [scanningMode, setScanningMode] = useState(false);
	const [hasPermission, setHasPermission] = useState(null);
	const {ingredients} = usePantryContext();
	const {theme} = useTheme();

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

	// User is leaving from Pantry, if camera is enabled, hide it.
	useEffect(() => {
		const unsubscribe = navigation.addListener('blur', () => {
			setScanningMode(false);
		});
		return unsubscribe;
	  }, [navigation]);


	return (
		<SafeAreaView style={styles.container}>
			{scanningMode ? (
				<>
					<BarCodeScanner
						onBarCodeScanned={scanningMode && barCodeScanned}
						style={StyleSheet.absoluteFillObject}
					/>
					<View style={{position: "absolute", bottom: 20}}>
						<Button
							type="outline"
							titleStyle={{color:theme.colors.black}}
							style={{backgroundColor:theme.colors.grey2}}
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
								style={{width: "100%"}}
								data={ingredients}
								keyExtractor={item => "ingredient_" + item.ean}
								renderItem={({item, index}) => (
									<ListItem onPress={() => navigation.navigate('Ainesosa', {newEan: item.ean})} key={index} bottomDivider>
										<Avatar source={{uri: BASE_URL + item.image_url}} />
											<ListItem.Content>
												<ListItem.Title>{item.name}</ListItem.Title>
												<ListItem.Subtitle style={{color: theme.colors.grey1}}>{item.brand}</ListItem.Subtitle>
											</ListItem.Content>
											<ListItem.Chevron />
									</ListItem>
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
						<Button
							icon={{
								name: "search",
								size:20,
								color:"white"
							}}
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
