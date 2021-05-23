import React, {useState, useEffect} from 'react'
import {View,Image, StyleSheet } from 'react-native';
import {usePantryContext} from "../providers/PantryContext";
import {fetchIngredient} from '../workers/APIWorker';

// import Chip from '../components/Chip';
import BetterButton from "./../components/BetterButton";
import AddNewIngredient from './AddNewIngredient';

import {BASE_URL} from '../workers/APIWorker';
import { Chip } from 'react-native-elements';

import {Button } from 'react-native-elements'
import { Text,useTheme,Divider } from 'react-native-elements';



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
	const {theme} = useTheme();
		
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
		if (!result) {
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
	
	return exists === STATE_LOADING ? <ContentForStateLoading/> :
			exists === STATE_ERROR ? <ContentForStateError/> : 
			exists === STATE_NOT_IN_PANTRY_NOT_IN_DB ? <AddNewIngredient EAN={EAN} navigation={navigation}/> : 
			(
			<View style={{display:"flex",flex:1,justifyContent:"center",alignItems:"center"}}>
				<IngredientDataComponent ingredientData={ingredientData} />
				<ButtonsComponent navigation={navigation} ingredientData={ingredientData} showRemove={exists == STATE_IN_PANTRY} showAdd={exists == STATE_NOT_IN_PANTRY_EXISTS_IN_DB} />
			</View>
	)
}

const IngredientDataComponent = ({ingredientData}) => {
	const {theme} = useTheme();
	return ingredientData && Object.keys(ingredientData).length > 0 && (
		<>
		<Image
			style={styles.modalDataImage}
			source={{uri: BASE_URL +  ingredientData.image_url}}
		/>
		<View style={{display: "flex", alignItems: "center"}}>
			<Text style={styles.modalDataEan}>
				{ingredientData.brand}
			</Text>
			<Text style={styles.modalDataEan}>
				{ingredientData.name}
			</Text>
			<Text style={styles.modalDataEan}>
				EAN: {ingredientData.ean}
			</Text>
		</View>
		<Divider style={{ backgroundColor: theme.colors.grey0, height:1,width:"50%" }} />

		<Text style={styles.modalDataEan}>
			Avainsanat:
		</Text>
		<View
			style={{
				flex:1,
				flexDirection: "row",
				flexWrap: "wrap",
				marginTop: 4,
			}}>
			{ingredientData?.keywords?.map((keyword, i) => (
				<Chip key={i} title={keyword} />
			))}
		</View>
	</>
	)
}

const ButtonsComponent = ({ingredientData,navigation,showRemove, showAdd}) => {
	const {updateIngredients} = usePantryContext();
	const {theme} = useTheme();
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

			 <Button
			 	buttonStyle={{backgroundColor: theme.colors.grey1}}
				title="Takaisin"
				onPress={() => {navigation.goBack()}}
			/>

			<View style={{paddingHorizontal:10}}></View>
			
			{showRemove && ( 
				<Button
					buttonStyle={{backgroundColor: theme.colors.error}}
					title="Poista ruokakomerosta"
					onPress={() => {updateIngredients(ingredientData, "DELETE"); navigation.goBack();}}
				/>
			)}
			{showAdd && (
				<Button
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
		width:"100%",
		height:"100%",
		maxHeight:200,	
		marginBottom: 8,
	},
	modalDataBrand: {
		fontSize: 18,
		fontWeight:"500"
		
	},
	modalDataName: {
		fontSize: 18,
		fontWeight:"500",
		marginBottom: 4,
	},
	modalDataEan: {
		fontSize:16,
		marginVertical:5
	},
});