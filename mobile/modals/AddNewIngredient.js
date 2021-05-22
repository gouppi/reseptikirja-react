import React, {useState, useEffect} from 'react'
import { ProgressSteps, ProgressStep } from 'react-native-progress-steps';
import * as ImagePicker from 'expo-image-picker';
import {fetchAllKeywords} from '../workers/APIWorker';

import { View,Text,TouchableOpacity,Image,TextInput,Modal,StyleSheet, Platform } from 'react-native';
import BetterButton from "./../components/BetterButton";
import {AntDesign} from '@expo/vector-icons';

import {MaterialIcons} from '@expo/vector-icons';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import Chip from '../components/Chip';
import {createIngredient} from '../workers/APIWorker';



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
		const data = new FormData();

		data.append('EAN', EAN);
		data.append('name', newIngredientName);
		data.append('brand', newIngredientBrand);
		keywordObjects.forEach(item => {
			data.append('keywords', item.keyword);
		});

		console.log(userSelectedImage);
		// data.append('keywords',keywordObjects.map(kw => kw.keyword));
		data.append('ingredient_image', {
			name: userSelectedImage.uri.split('/').pop(),
			type: userSelectedImage.type,
			uri: Platform.OS === 'ios' ? userSelectedImage.uri.replace('file://', '') : userSelectedImage.uri,
		});
		
		let result = await createIngredient(data);
		console.log(result);

	}

	let openImagePickerAsync = async (SOURCE) => {
		console.log("OPEN image picker async");
		let pickerResult;
		// camera
		if (SOURCE === 1) {
			console.log("Opening camera");
			let permissionResult = await ImagePicker.requestCameraPermissionsAsync();
			if (permissionResult.granted === false) {
				alert("Permission to use camer is required!");
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
				<BetterButton
					bgColor="#333"
					title="Takaisin"
					onPress={() => {navigation.goBack();}}
				/>
				<View style={{paddingHorizontal:10}}></View>
				<BetterButton
				title="Luo uusi tuote"
				onPress={() => {setShowStepper(true)}}
			/>
			</View>
		</View>
		) : (
			<>
			<View style={{flex: 1}}>
				<ProgressSteps>
					<ProgressStep nextBtnText="Perustiedot" label="Kuva tuotteesta">
						<View style={{ alignItems: 'center',flex:1,display:"flex" }}>
							
							<TouchableOpacity onPress={() => setModalVisible(true)} >
								<View style={{marginVertical:20}}>
									{userSelectedImage ? (<Image source={userSelectedImage} style={{resizeMode:"contain"}} width={300} height={300} />) : <View style={{display:"flex",flexDirection:"column",textAlign:"center",justifyContent:"center",alignItems:"center",padding:20,borderWidth:5, borderRadius:12}}><AntDesign name="camerao" size={120} color="black" /><Text>Ota kuva</Text></View>}
								</View>
							</TouchableOpacity>
						</View>
					</ProgressStep>
					<ProgressStep previousBtnText="Kuva tuotteesta"  nextBtnText="Yhteenveto" label="Perustiedot">
						<View style={{ justifyContent: "center",alignItems: 'center', flex:1,marginHorizontal:20, display:"flex" }}>
							<Text style={{fontSize:16,fontWeight:"600",marginBottom:10}}>Syötä kenttiin tuotteen perustiedot</Text>
							<TextInput defaultValue={newIngredientName} onChangeText={(value) => setNewIngredientName(value)  } returnKeyType={"next"} onSubmitEditing={() => setFocus(true)} style={{width:"100%",padding:20,marginVertical:5,borderRadius:5,borderWidth:1,borderColor:"#ccc",backgroundColor:"#fff"}} placeholder="Tuotteen nimi" />
							<TextInput defaultValue={newIngredientBrand} onChangeText={(value) => setNewIngredientBrand(value)} focus={focus} onSubmitEditing={() => setFocus(false)} returnKeyType={"next"} style={{width:"100%",padding:20,marginVertical:5,borderRadius:5,borderWidth:1,borderColor:"#ccc",backgroundColor:"#fff"}} placeholder="Tuotteen valmistaja" />
							{/* <TextInput style={{width:"100%",padding:20,marginVertical:5,borderRadius:5,opacity:1,borderWidth:1,borderColor:"#ccc",backgroundColor:"#fff"}} placeholder="Tuotteen EAN" value={EAN} editable={false} /> */}
							<Text style={{fontSize:16,fontWeight:"600",marginBottom:10}}>Anna tuotteelle 1-3 avainsanaa</Text>
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
									styles={{button: {backgroundColor:"#4caf50"},selectedItemText: {color:"#4caf50"},modalWrapper: {maxHeight:"100%"},selectToggle:{flex:1}, selectToggleText:{color:"#000"}}}
									showDropDowns={true}
									selectedText="valittu"
									confirmText="Vahvista"
									searchPlaceholderText="Etsi avainsanoja..."
									removeAllText="Poista kaikki"
									noResultsComponent={<View style={{display:"flex", justifyContent:"center",alignItems:"center", height:"100%"}}><Text>Ei sopivaa avainsanaa.</Text><Text>Käytä toista avainsanaa tuotteelle.</Text></View>}
									// readOnlyHeadings={true}
									onSelectedItemsChange={(selectedItemObjects) =>  {if (selectedItemObjects.length > 3) return;  setSelectedKeywords(selectedItemObjects); setKeywordObjects(keywords.filter((kw) => selectedItemObjects.includes(kw.id))) }}
									selectedItems={selectedKeywords}
									/>
							</View>
						</View>
					</ProgressStep>
					<ProgressStep previousBtnText="Perustiedot" finishBtnText="Lähetä" onSubmit={sendNewIngredientForm}  label="Yhteenveto">
						<View style={{marginVertical: 20, marginHorizontal: 8,alignItems: 'center' }}>
							<Text>Näyttääkö tämä hyvältä?</Text>
							<View style={styles.ingredient}>
								<Image
									style={styles.image}
									source={userSelectedImage}
								/>
								<View style={{display: "flex", alignItems: "center"}}>
									<Text style={styles.modalDataBrand}>
										{newIngredientBrand}
									</Text>
									<Text style={styles.modalDataName}>
										{newIngredientName}
									</Text>
									<Text style={styles.modalDataEan}>
										{EAN}
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
										flex:1,
										flexDirection: "row",
										flexWrap: "wrap",
										marginTop: 4,
									}}>
									{keywordObjects?.map((keyword, i) => (
										<Chip key={i} text={keyword.keyowrd} />
									))}
								</View>

							</View>
							{/** TODO: Tähän kohti submit nappi joka triggeröi datan lähetyksen backendille. sinne pitää lentää
							 *  Kuva
							 *  Tuotteen nimi
							 *  Tuotteen merkki
							 *  EAN
							 *  Avainsana-Array
							 *  @see https://stackoverflow.com/questions/52830312/how-to-upload-image-to-server-using-axios-in-react-native
							 */}
						</View>
					</ProgressStep>
				</ProgressSteps>
			</View>
			<Modal
				animationType="fade"
				transparent={true}
				visible={modalVisible}
				onRequestClose={() => {
					setModalVisible(!modalVisible);
				}}>
					<View style={{padding:20,flex:1, justifyContent:"center",alignItems:"center"}}>
						<View style={{borderRadius:10, backgroundColor:"#fff", borderWidth:1, borderColor:"#ccc"}}>
							<Text style={{marginTop:10,fontSize:22,textAlign:"center"}}>Valitse kuvan lähde:</Text>
							<View style={{display:"flex", flexDirection:"row", width:"100%", justifyContent:"space-evenly", marginVertical:20}}>
								<BetterButton title="Kamera" onPress={async () => {await openImagePickerAsync(1)}}/>
								<BetterButton title="Galleria" onPress={async () => {await openImagePickerAsync(2)}}/>
							</View>
						</View>
					</View>
			</Modal>
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
		height: "100%",
		minWidth: "20%",
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