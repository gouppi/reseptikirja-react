import React, {useState, useEffect, useContext} from "react";
import {
	StyleSheet,
	Text,
	View,
	SafeAreaView,
	Button,
	FlatList,
	Image,
	ScrollView,
} from "react-native";
import {BarCodeScanner} from "expo-barcode-scanner";
import {fetchIngredient} from "../workers/APIWorker";
import Modal from "react-native-modal";
import {PANTRY_KEY, getData, setData} from "../workers/AsyncStorageWorker";

import {usePantryContext} from "../providers/PantryContext";

import Ingredient from "./../components/Ingredient";
import StyledButton from "./../components/StyledButton";
import Chip from "../components/Chip";

export default function Pantry({navigation}) {
	const [scanningMode, setScanningMode] = useState(false);
	const [hasPermission, setHasPermission] = useState(null);
	const [scannedEANData, setScannedEANData] = useState(null);
	const [isModalVisible, setModalVisible] = useState(false);
	const {ingredients, setIngredients} = usePantryContext();

	React.useLayoutEffect(() => {
		navigation.setOptions({
			headerTitle: "Ruokakomero"
			});
	}, [navigation]);

	/**
	* Switches the modal visibility state.
	* @return {void}
	*/
	const toggleModal = () => {
		setModalVisible(!isModalVisible);
	};

	/**
	* Checks if the current state ingredients list contains the given ingredient or not
	* @param {object} new_ingredient - new ingredient which the user recently scanned
	* @return {boolean} true if new_ingredient is already in ingredients list, else false.
	*/
	const hasListThisIngredient = new_ingredient => ingredients.some(i => i.ean === new_ingredient?.ean);

	/**
	 * Opens modal, and sets the passed data to state variable.
	 * @param {any} data data set to be shown in modal.
	 * @return {void}
	 */
	const showModalInfoForData = data => {
		setScannedEANData(data);
		setModalVisible(true);
	};

	/* This validates camera permissions */
	const validatePermissions = () => {
		(async () => {
			const {status} = await BarCodeScanner.requestPermissionsAsync();
			setHasPermission(status === "granted");
		})();
	};

	/**
	 * Adds the scanned item to device storage and closes the modal.
	 * @param {object} ingredient incoming ingredient, data coming in from DynamoDB.
	 **/
	const addItemToDeviceStorage = ingredient => {
		let iL = ingredients;
		iL.push(ingredient); // proper way to leave state variables immutable this way i guess.
		setIngredients(iL);
		setData(PANTRY_KEY, JSON.stringify(iL));
		toggleModal();
	};

	/**
	 * Removes an existing ingredient from device storage and closes the modal.
	 * @param {object} ingredient existing ingredient.
	 */
	const removeItemFromDeviceStorage = ingredient => {
		let iL = ingredients;
		iL = iL.filter(i => i.ean !== ingredient.ean);
		setIngredients(iL);
		setData(PANTRY_KEY, JSON.stringify(iL));
		toggleModal();
	};

	// TODO: Either use async here, or wrap APIWorker calls inside Promises so these are non-blocking.
	// Why? - you ask. Because if the execution is asyncronous and we're waiting an external API to repond
	// For our call, but it takes forever, the user only sees the ingredients list and nothing happens.
	// TODO: This could be fixed also by setting some kind of spinner state "isLoading, setIsLoading",
	// Which is reset once the fetchIngredient request is finished.
	const handleBarCodeScanned = async ({type, data}) => {
		setScanningMode(false);
		let EANResult = await fetchIngredient(data);
		setScannedEANData(EANResult);
		setModalVisible(true);
	};

	return (
		<SafeAreaView style={styles.container}>
			{scanningMode ? (
				<>
					<BarCodeScanner
						onBarCodeScanned={scanningMode && handleBarCodeScanned}
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
						<Text style={styles.pantryText}>Ruokakomerosi</Text>
						{ingredients.length > 0 ? (
							<FlatList
								style={{width: "100%", paddingHorizontal: 10}}
								data={ingredients}
								keyExtractor={item => "ingredient_" + item.ean}
								renderItem={({item, index}) => (
									<Ingredient
										key={index}
										item={item}
										onClick={showModalInfoForData}
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
						<StyledButton
							title={"Skannaa viivakoodi"}
							onPress={async () => {
								await validatePermissions();
								setScanningMode(true);
							}}
						/>
					</View>
					<ModalContainer
						heading={
							scannedEANData?.hasOwnProperty("name")
								? "Viivakoodia vastaava tuote"
								: "En löytänyt tuotetta viivakoodilla."
						}
						eanData={scannedEANData}
						hasListThisIngredient={hasListThisIngredient}
						toggleModal={toggleModal}
						addItemToDeviceStorage={addItemToDeviceStorage}
						removeItemFromDeviceStorage={
							removeItemFromDeviceStorage
						}
						isModalVisible={isModalVisible}
					/>
				</>
			)}
		</SafeAreaView>
	);
}

function ModalContainer(props) {
	let {heading,eanData,hasListThisIngredient,addItemToDeviceStorage,removeItemFromDeviceStorage,isModalVisible,toggleModal} = props;

	return (
		<Modal animationType="fade" isVisible={isModalVisible}>
			<SafeAreaView style={{backgroundColor: "#fff"}}>
				<View style={{paddingVertical: 20}}>
					<Text
						style={{
							textAlign: "center",
							fontSize: 20,
							marginBottom: 10,
						}}>
						{heading}
					</Text>
				</View>
				{eanData?.hasOwnProperty("name") ? (
					<>
						<Image
							style={styles.modalDataImage}
							source={{uri: eanData?.image_url}}
						/>
						<View style={{display: "flex", alignItems: "center"}}>
							<Text style={styles.modalDataBrand}>
								{eanData?.brand}
							</Text>
							<Text style={styles.modalDataName}>
								{eanData?.name}
							</Text>
							<Text style={styles.modalDataEan}>
								{eanData?.ean}
							</Text>
						</View>

						<Text
							style={{
								textAlign: "center",
								fontSize: 20,
								marginBottom: 8,
							}}>
							Avainsanat:
						</Text>
						<View
							style={{
								flexDirection: "row",
								flexWrap: "wrap",
								marginHorizontal: 20,
								marginTop: 4,
								marginBottom: 20,
							}}>
							{eanData?.keywords?.map((keyword, i) => (
								<Chip key={i} text={keyword} />
							))}
						</View>
					</>
				) : (
					<>
						<View style={{display: "flex", alignItems: "center"}}>
							<Text>
								Uuden tuotteen lisäämistoiminto lisätään
								myöhemmin.
							</Text>
						</View>
					</>
				)}

				<View
					style={{
						paddingBottom: 20,
						flexWrap: "wrap",
						display: "flex",
						flexDirection: "row",
						justifyContent: "space-evenly",
						alignItems: "center",
					}}>
					<StyledButton
						title="Takaisin"
						cancelButton
						onPress={toggleModal}
					/>
					{eanData && hasListThisIngredient(eanData) ? (
						<StyledButton
							deleteButton
							title="Poista ruokakomerosta"
							onPress={() => removeItemFromDeviceStorage(eanData)}
						/>
					) : (
						eanData?.hasOwnProperty("ean") && (
							<StyledButton
								title="Lisää ruokakomeroon"
								onPress={() => addItemToDeviceStorage(eanData)}
							/>
						)
					)}
				</View>
			</SafeAreaView>
		</Modal>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#F6F6F6",
		alignItems: "center",
		justifyContent: "center",
	},
	pantryText: {
		fontSize: 24,
		fontWeight: "600",
		marginBottom: 30,
		textAlign: "center",
	},
	modalDataContainer: {
		display: "flex",
		flexDirection: "column",
	},
	modalDataImage: {
		borderRadius: 10,
		height: 128,
		resizeMode: "contain",
		marginBottom: 8,
	},
	modalDataBrand: {
		fontSize: 15,
		fontStyle: "italic",
	},
	modalDataName: {
		fontSize: 16,
		marginBottom: 4,
	},
	modalDataEan: {
		fontSize: 10,
		marginBottom: 20,
	},
});
