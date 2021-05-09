import React, {useState, useEffect} from 'react'
import {View,Text,Image, StyleSheet } from 'react-native';
import {usePantryContext} from "../providers/PantryContext";
import {fetchIngredient} from '../workers/APIWorker';

import Chip from '../components/Chip';
import StyledButton from '../components/StyledButton';
import BetterButton from "./../components/BetterButton";

export default function IngredientModal({route,navigation}) {

	const STATE_ERROR = -1; // "Virhe, kokeile uudelleen! :("
	const STATE_LOADING = 0; // "Ladataan"
	const STATE_IN_PANTRY = 1; // "Olet skannannut tämän tuotteen"
	const STATE_NOT_IN_PANTRY_EXISTS_IN_DB = 2; // "Tämä tuote löytyi tietokannasta"
	const STATE_NOT_IN_PANTRY_NOT_IN_DB = 3; // "En löytänyt tuotetta, haluatko lisätä sen?"
	
	const {ingredients} = usePantryContext();
	const [EAN,setEAN] = useState(null);
	const [exists, setExists] = useState(STATE_LOADING);
	const [ingredientData, setIngredientData] = useState({});
		
	useEffect(() => {
		if (route && route.hasOwnProperty('params')) {
			setEAN(route.params.newEan);
			if (ingredients.some(i => i.ean === route.params.newEan)) {
				// console.log("WE HAVE THIS INGREDIENT IN INGREDIENTS!");
				const scannedIngredient = ingredients.filter(i => i.ean  === route.params.newEan).shift();
				// console.log(scannedIngredient);
				setIngredientData(scannedIngredient);
				setExists(STATE_IN_PANTRY);
			} else {
				checkIngredientFromDB(route.params.newEan);
			}
		} return () => {console.log("Setting Ingredient modal back to loading state!"); setExists(STATE_LOADING);}
	}, [])


	const checkIngredientFromDB = async (ean) => {
		let result = await fetchIngredient(ean);
		let state = STATE_ERROR;
		if (result && Object.keys(result).length === 0 && result.constructor === Object) {
			state = STATE_NOT_IN_PANTRY_NOT_IN_DB;
		} else if (result && Object.keys(result).length > 0) {
			setIngredientData(result);
			state = STATE_NOT_IN_PANTRY_EXISTS_IN_DB;
		}
		setExists(state);
 	}

	const ContentForStateError = () => {
		return (
		<View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
			<Text>Lataan ainesosaa...</Text>
		</View>);
	}

	const ContentForStateLoading = () => {
		return (
		<View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
			<Text>Lataan ainesosaa...</Text>
		</View>)
	}
	
	const ContentForStateNotInPantryNotInDB = () => {
		return (<View style={{flex:1,justifyContent:"center",alignItems:"center"}}><Text style={{textAlign:"center"}}>Uuden tuotteen {EAN} lisäämistoiminto lisätään myöhemmin.</Text></View>);
	}

	return exists === STATE_LOADING ? <ContentForStateLoading/> :
			exists === STATE_ERROR ? <ContentForStateError/> : 
			exists === STATE_NOT_IN_PANTRY_NOT_IN_DB ? <ContentForStateNotInPantryNotInDB/> : 
			(
			<View style={{display:"flex",flex:1,justifyContent:"center",alignItems:"center",margin:20}}>
				<IngredientDataComponent ingredientData={ingredientData} />
				<ButtonsComponent ingredientData={ingredientData} navigation={navigation} showRemove={exists == STATE_IN_PANTRY} showAdd={exists == STATE_NOT_IN_PANTRY_EXISTS_IN_DB} />
			</View>
			)
}

const IngredientDataComponent = ({ingredientData}) => {
	return ingredientData && Object.keys(ingredientData).length > 0 && (
		<>
		<Image
			style={styles.modalDataImage}
			source={{uri: ingredientData.image_url}}
		/>
		<View style={{display: "flex", alignItems: "center"}}>
			<Text style={styles.modalDataBrand}>
				{ingredientData.brand}
			</Text>
			<Text style={styles.modalDataName}>
				{ingredientData.name}
			</Text>
			<Text style={styles.modalDataEan}>
				{ingredientData.ean}
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
			{ingredientData.keywords?.map((keyword, i) => (
				<Chip key={i} text={keyword} />
			))}
		</View>
	</>
	)
}

const ButtonsComponent = ({ingredientData,navigation,showRemove, showAdd}) => {
	const {updateIngredients} = usePantryContext();
	return (
		<View
			style={{
				
				paddingBottom: 20,
				flexWrap: "wrap",
				display: "flex",
				flexDirection: "row",
				justifyContent: "space-between",
				alignItems: "",
			}}>

			 <BetterButton
				title="Takaisin"
				cancelButton
				onPress={() => {navigation.goBack()}}
			/>

			<View style={{paddingHorizontal:10}}></View>
			
			{showRemove && ( 
				<BetterButton
					bgColor={"#dc3545"}
					title="Poista ruokakomerosta"
					onPress={() => {updateIngredients(ingredientData, "DELETE"); navigation.goBack();}}
				/>
			)}
			{showAdd && (
				<BetterButton
					title="Lisää ruokakomeroon"
					onPress={() => {updateIngredients(ingredientData, "ADD"); navigation.goBack();}}
				/>
			)}
		</View>
	)
}


const styles = StyleSheet.create({
	
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
		minWidth:"25%",
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