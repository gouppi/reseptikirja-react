import React, {useState, useEffect, useRef} from 'react'
import { ProgressSteps, ProgressStep } from 'react-native-progress-steps';
import * as ImagePicker from 'expo-image-picker';
import {fetchAllKeywords} from '../workers/APIWorker';

import { View,TouchableOpacity,Image,TextInput,StyleSheet, Platform } from 'react-native';
import {AntDesign} from '@expo/vector-icons';
import {MaterialIcons} from '@expo/vector-icons';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';

import {createIngredient} from '../workers/APIWorker';
import {usePantryContext} from '../providers/PantryContext';

import {Text,Chip, Button, Overlay, useTheme } from 'react-native-elements';

export default function AddNewIngredient({EAN, navigation}) {
	const [focus, setFocus] = useState(false);
	const [showStepper, setShowStepper] = useState(false);
	const [modalVisible, setModalVisible] = useState(false);
	const [userSelectedImage, setUserSelectedImage] = useState(null);
	const [keywords, setKeywords] = useState([]);
	const [selectedKeywords, setSelectedKeywords] = useState([]);
	
	// SectionedMultiSelect stores selected values as index-array. Store the actual object here.
	const [keywordObjects, setKeywordObjects] = useState([]);
	const [newIngredientName, setNewIngredientName] = useState("");
	const [newIngredientBrand, setNewIngredientBrand] = useState("");

	// Disable duplicate sends when user clicks submit button.
	const [submitButtonEnabled, setSubmitButtonEnabled] = useState(true);
	const {updateIngredients} = usePantryContext();
	const {theme} = useTheme();

	useEffect(() => {
		console.log("Haen kaikki avainsanat");
		const workerCall = async () => {
			const result = await fetchAllKeywords();
			if (result) {
				console.log("Nämä avainsanat tuli", result.keywords);
				setKeywords(result.keywords);
			}
		}
		if (keywords.length < 1) {
			workerCall();
		}
	}, [])

	const sendNewIngredientForm = async () => {
		
		if (! submitButtonEnabled) {
			return;
		}
		const data = new FormData();
		data.append('EAN', EAN);
		data.append('name', newIngredientName);
		data.append('brand', newIngredientBrand);
		keywordObjects.forEach(item => {
			data.append('keywords', item.keyword);
		});
		data.append('ingredient_image', {
			name: userSelectedImage.uri.split('/').pop(),
			type: userSelectedImage.type,
			uri: Platform.OS === 'ios' ? userSelectedImage.uri.replace('file://', '') : userSelectedImage.uri,
		});
		// TODO: disable submit button
		setSubmitButtonEnabled(false);
		let result = await createIngredient(data);
		setSubmitButtonEnabled(true);
		
		if (result) {
			await updateIngredients(result, "ADD");
			navigation.goBack();
		} else {
			// TODO: ingredient send was not successful. Show some kind of toast message to user indicating, that 
			// The save wasn't successful, and that they should try the save again in few seconds.
		}
	}

	const NewKeywordPrompt = () => {
		multiselect.current.
		return (
			<View style={{display:"flex", justifyContent:"center",alignItems:"center", height:"100%"}}>
				<Text>Ei sopivaa avainsanaa.</Text>
				<Text>Käytä toista avainsanaa tuotteelle.</Text>
			</View>
		);
	}


	let openImagePickerAsync = async (SOURCE) => {
		// const {theme} = useTheme();
		console.log("OPEN image picker async");
		let pickerResult;
		// camera
		if (SOURCE === 1) {
			console.log("Opening camera");
			let permissionResult = await ImagePicker.requestCameraPermissionsAsync();
			if (permissionResult.granted === false) {
				alert("Permission to use camera is required!");
				return;
			}
			pickerResult = await ImagePicker.launchCameraAsync({
				allowsEditing:true,

			});
		} else if (SOURCE === 2) {
			console.log("Opening camera roll");
			let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
			if (permissionResult.granted === false) {
			  alert("Permission to access camera roll is required!");
			  return;
			}
			pickerResult = await ImagePicker.launchImageLibraryAsync({
				allowsEditing:true
			});
		}
		
		if (!pickerResult.cancelled) {
			setUserSelectedImage(pickerResult);
			setModalVisible(false);
		}
		console.log(pickerResult);
	}

	return (
		<>
		{! showStepper ? (
		<View style={{flex:1,display:"flex",justifyContent:"center",alignItems:"center"}}>
			<Text style={{textAlign:"center", fontSize: 18}}>Skannasit uuden tuotteen.</Text>
			<Text style={{textAlign:"center",fontSize:16,marginTop:10}}>Haluatko luoda sen?</Text>
			<View style={{display:"flex", flexDirection:"row", marginTop:20}}>
				<Button
					buttonStyle={{backgroundColor:theme.colors.grey1}}
					title="Takaisin"
					onPress={() => {navigation.goBack()}}
				/>
				<View style={{paddingHorizontal:10}}></View>
				<Button
				title="Luo uusi tuote"
				onPress={() => {setShowStepper(true)}}
			/>
			</View>
		</View>
		) : (
			<>
			<View style={{flex: 1}}>
			<Overlay
				isVisible={modalVisible}
				onBackdropPress={() => {
					setModalVisible(false);
				}}
				>
				<View>
					<Text style={{marginTop:10,fontSize:22,textAlign:"center"}}>Valitse kuvan lähde:</Text>
					<View style={{display:"flex", flexDirection:"row", width:"100%", justifyContent:"space-evenly", marginVertical:20}}>
						<Button icon={{name:"camera-alt", color:"white", size: 20}} title="Kamera" onPress={async () => { await openImagePickerAsync(1)}}/>
						<Button icon={{name:"image", color:"white", size: 20}} title="Galleria" onPress={async () => { await openImagePickerAsync(2)}}/>
					</View>
				</View>
			</Overlay>
				<ProgressSteps>
					<ProgressStep nextBtnTextStyle={{color: theme.colors.primary}} nextBtnText="Seuraava >" label="Kuva tuotteesta">
						<View style={{ alignItems: "center", justifyContent:"space-around", flexDirection:"column" }}>
							<TouchableOpacity onPress={() => setModalVisible(true)} >
								<View style={{display:"flex",justifyContent:"center",alignItems:"center",marginHorizontal:20}}>
									{userSelectedImage ? (<Image source={userSelectedImage} style={{resizeMode:"contain"}} width={300} height={300} />) : <View style={{display:"flex",flexDirection:"column",textAlign:"center",justifyContent:"center",alignItems:"center",padding:20,borderWidth:5, backgroundColor:theme.colors.grey0}}><AntDesign name="camerao" size={120} color="black" /><Text style={{fontFamily:"Quicksand-Bold", fontSize:18}}>Ota kuva</Text></View>}
								</View>
							</TouchableOpacity>
							{userSelectedImage && (<Text>(Vaihda valitsemasi kuva klikkaamalla sitä)</Text>)}
						</View>
					</ProgressStep>
					<ProgressStep previousBtnTextStyle={{color: theme.colors.grey1}} nextBtnTextStyle={{color: theme.colors.primary}} previousBtnText="Kuva tuotteesta"  nextBtnText="Yhteenveto" label="Perustiedot">
						<View style={{ justifyContent: "center",alignItems: 'center', flex:1,marginHorizontal:20, display:"flex" }}>
							<Text style={{fontSize:16, fontFamily:"Quicksand-Medium",marginBottom:10}}>Syötä kenttiin tuotteen perustiedot</Text>
							<TextInput defaultValue={newIngredientName} onChangeText={(value) => setNewIngredientName(value)  } returnKeyType={"next"} onSubmitEditing={() => setFocus(true)} style={{width:"100%",padding:20,marginVertical:5,borderRadius:5,borderWidth:1,borderColor:"#ccc",backgroundColor:"#fff"}} placeholder="Tuotteen nimi" />
							<TextInput defaultValue={newIngredientBrand} onChangeText={(value) => setNewIngredientBrand(value)} focus={focus} onSubmitEditing={() => setFocus(false)} returnKeyType={"next"} style={{width:"100%",padding:20,marginVertical:5,borderRadius:5,borderWidth:1,borderColor:"#ccc",backgroundColor:"#fff"}} placeholder="Tuotteen valmistaja" />
							<Text style={{fontSize:16,fontFamily:"Quicksand-Medium",marginVertical:10}}>Anna tuotteelle 1-3 avainsanaa</Text>
							<Text style={{fontSize:12,marginBottom:10}}>Mitä avainsanat ovat?</Text>
							<View style={{flex:1, width:"100%", fontSize:16,fontWeight:"600",paddingHorizontal:20,borderRadius:5,borderWidth:1,borderColor:"#ccc",paddingVertical:10,marginVertical:10,backgroundColor:"#fff"}}>
								<SectionedMultiSelect
									items={keywords}
									IconRenderer={MaterialIcons}
									uniqueKey="id"
									displayKey="keyword"
									modalWithSafeAreaView
									selectText="Valitse avainsanat"
									showChips={true}
									styles={{
										selectToggleText: {
											fontFamily: "Quicksand-Bold",
										},
										searchBar:{
											backgroundColor:theme.colors.grey5,
											borderBottomWidth:1,
											borderBottomColor:theme.colors.grey1
										},
										searchTextInput:{
											fontFamily:"Quicksand",
											paddingVertical:12,
										},
										itemText:{
											fontFamily:"Quicksand",
											paddingVertical:6,
										},
										confirmText:{
											fontFamily:"Quicksand-Bold",
											paddingVertical:12,
										},
										button: {
											backgroundColor:theme.colors.primary,
											fontFamily:"Quicksand"
										},
										selectedItemText: {
											color:theme.colors.primary,
											fontFamily:"Quicksand-Bold"
										},
										modalWrapper: {
											maxHeight:"100%"
										},
										selectToggle:{
											flex:1
										}, selectToggleText:{
											color:"#000"
										}
									}}
									showDropDowns={true}
									selectedText="valittu"
									confirmText="Vahvista"
									searchPlaceholderText="Etsi avainsanoja..."
									removeAllText="Poista kaikki"
									noResultsComponent={<NewKeywordPrompt/>}
									// readOnlyHeadings={true}
									onSelectedItemsChange={(selectedItemObjects) =>  {if (selectedItemObjects.length > 3) return;  setSelectedKeywords(selectedItemObjects); setKeywordObjects(keywords.filter((kw) => selectedItemObjects.includes(kw.id))) }}
									selectedItems={selectedKeywords}
									/>
							</View>
						</View>
					</ProgressStep>
					<ProgressStep error={submitButtonEnabled} previousBtnText="Perustiedot" finishBtnText="Hyväksy" onSubmit={sendNewIngredientForm}  label="Yhteenveto">
						<View style={{marginVertical: 20, marginHorizontal: 8,alignItems: 'center' }}>
							<View style={styles.ingredient}>
								<Text style={{fontFamily:"Quicksand-Semibold", fontSize:18,marginBottom:10}}>Näyttääkö tämä hyvältä?</Text>
								<Image
									style={styles.image}
									source={userSelectedImage}
								/>
									<Text style={{fontFamily:"Quicksand-Medium", marginVertical:4}}>
										{newIngredientName}
									</Text>
									<Text style={{fontFamily:"Quicksand-Medium", marginBottom:4}}>
										{newIngredientBrand}
									</Text>
								<View
									style={{
										flex:1,
										flexDirection: "row",
										flexWrap: "wrap",
										marginTop: 4,
									}}>
									{keywordObjects?.map((keyword, i) => (
										<Chip buttonStyle={{marginRight:4}} key={i} title={keyword.keyword} />
									))}
								</View>

							</View>
						</View>
					</ProgressStep>
				</ProgressSteps>
			</View>
			
		</>
		)}
		</>
	);
}

const styles = StyleSheet.create({
	ingredient: {
		flex:1,
		marginTop:20,
		marginBottom: 8,
		minWidth: "100%",
		paddingVertical: 10,
		display: "flex",
		justifyContent:"center",
		alignItems:"center",
		flexDirection: "column",
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
		maxHeight: 200,
		// minWidth: "20%",
		// marginHorizontal: 'auto',
		resizeMode: "contain"
	},
	data: {
		display: "flex",
		flexDirection: "column",
	},
	name: {
		fontSize: 16,
	},
	keywordsContainer: {
		paddingTop: 4,
		display: "flex",
		flexDirection: "row",
		justifyContent: "flex-start",
	},
	keywordBadge: {
		marginVertical:4,
		marginHorizontal:2,
		padding:3,
		borderRadius:5,
		backgroundColor: "#e8e8e8",
	}
});