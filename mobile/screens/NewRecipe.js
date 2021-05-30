import React, {useState, useEffect, useRef} from 'react'
import {SafeAreaView, Text, View,StyleSheet,Pressable,Keyboard,TouchableWithoutFeedback,Spacer} from 'react-native';

import { ProgressSteps, ProgressStep } from 'react-native-progress-steps';
import * as ImagePicker from 'expo-image-picker';
import { ListItem,Avatar,useTheme,Card,Input, Button,Overlay, Slider,ButtonGroup,Icon, Tooltip } from 'react-native-elements';
import {fetchAllKeywords} from '../workers/APIWorker';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import {MaterialIcons} from '@expo/vector-icons';

import Toast, {BaseToast} from 'react-native-toast-message';


export default function NewRecipe() {
	const {theme} = useTheme();
	const [keywords, setKeywords] = useState([]);
	const [newRecipe, setNewRecipe] = useState({});

	const toggleNewRecipe = (incoming) => {
		console.log("TNR:", newRecipe);
		setNewRecipe({...newRecipe, incoming});
	}



	useEffect(() => {
		console.log("New Recipe hakee avainsanoja");
		const workerCall = async () => {
			const result = await fetchAllKeywords();
			if (result) {
				console.log("Kuinka monta avainsanaa", result.keywords.length);
				setKeywords(result.keywords);
			}
		}
		if (keywords.length < 1) {
			workerCall();
		}
	}, [])



	return (
		<SafeAreaView style={{display:"flex",flex:1}}>
			<ProgressSteps style={{stepIcons: {display:"none"}}}>
				<ProgressStep label="Ainesosat"  >
					<NewRecipeStep1 toggleNewRecipe={toggleNewRecipe} newRecipe={newRecipe} keywords={keywords} />
				 </ProgressStep>
				<ProgressStep label="Valmistusohjeet">
					<View>
						<Text>Testiä</Text>
					</View>
				</ProgressStep>
			</ProgressSteps>
		</SafeAreaView>
	)
}


/**
 * 
 * @param {*} param0 
 * @returns 
 */
const NewRecipeStep1 = ({toggleNewRecipe, newRecipe, keywords}) => {
	const [list, setList] = useState([]);
	const {theme} = useTheme();
	const addNewSection = () => {
		let newList = [...list];
		newList.push({
			section: "",
			data: []
		});
		setList(newList);
	}

	const updateList = (index, newSection) => {
		let newList = [...list];
		newList.splice(index, 1, newSection);
		setList(newList);
	}

	useEffect(() => {
		console.log("LISTA PÄIVITTYI: ", list);
	}, [list]);

	return (
		<TouchableWithoutFeedback>
			<View style={{display:"flex", height:"100%"}}>
			{list.map((s, i) => 
				<NewRecipeStep1Ingredient 
					keywords={keywords} 
					index={i} 
					key={i} 
					updateList={updateList} 
					section={s} />)}
			
			<Pressable onPress={addNewSection}>
				<View style={{marginTop:40,display:"flex", flexDirection:"row",alignItems:"center",justifyContent:"center"}}>
					<Icon style={{marginRight:5}} name="add-circle" size={30} color={theme.colors.primary} />
					<Text style={{fontFamily:"Quicksand-Bold",fontSize:16,textAlign:"center"}}>Lisää uusi valmistusvaihe</Text>
				</View>
			</Pressable>
			</View>
		</TouchableWithoutFeedback>
	)
}

/**
 * 
 * @param {number} index - section index
 * @param {object} section - contains whole section data {section: "", data: []}
 * @param {array} keywords - all ingredient keywords
 * @param {function} updateList - mutates a state containing all sections.
 * @returns 
 */
const NewRecipeStep1Ingredient = ({index, section, keywords, updateList}) => {
	const {theme} = useTheme();
	const [sectionData, setSectionData] = useState(section);
	const [overlay, setOverlay] = useState(false);
	const [ingredientIndex, setIngredientIndex] = useState(null);
	const [activeIngredient, setActiveIngredient] = useState({
		unit_index: null,
		multiselector_index: [],	
		amount: 0,
		ingredient: "",
		unit: "",
		ingredient_index: null, // this defines if we are modifying existing item at specific index or new item (push or splice)
	});

	const toggleOverlay = () => {
		setOverlay(!overlay);
	}

	const removeIngredient = (index) => {
		console.log("INGREDIENT REMOVE INGREDIENT: ", index);
		let D = {...sectionData};
		console.log(D.data);
		D.data.splice(index, 1);
		console.log(D.data);
		setSectionData(D);
		updateList(D);
		

		
	}

	/**
	 * Handle new / existing recipe ingredient insert / update to section.
	 * @param {object} ingredient 
	 * @returns {void}
	 */
	const handleIngredientSubmit = (ingredient, ingredient_index) => {
		console.log("HANDLE INGREDIENT SUBMIT HAS BEEN CALLED WITH THE FOLLOWING INGREDIENT:", ingredient);
		console.log("HANDLE INGREDIENT INDEX HAS BEEN SET TO FOLLOWING: ", ingredient_index);

		let D = {...sectionData};
		if (ingredient_index === null) {
			D.data.push(ingredient);
		} else {
			D.data.splice(ingredient_index, 1, ingredient);
		}
		setSectionData(D);
		updateList(D);
	}

	return (
		
		<Card containerStyle={{margin:0, marginTop:10}}>
			<View style={{display:"flex", flexDirection:"row"}}>
				<View style={{flex:1}}>
					<Input
						rightIcon={
							
							<Icon
								onPress={() => Toast.show({
									text1: 'Reseptin osion nimi',
									text2: 'Kirjoita tähän lyhyt nimi joka selittää mihin ainesosia ollaan käyttämässä.',
									visibilityTime: 5000,
									type:"info",
									topOffset: 50,
								  })	}
								color={theme.colors.grey1}
								name="info"/>
 						}
						placeholder="Reseptin osion nimi"
						inputContainerStyle={{textAlign:"center",display:"flex",width:"100%"}}
						value={sectionData.section}
						onChangeText={v => setSectionData({...sectionData, section: v})}
						onBlur={() => updateList(index, sectionData)}
					/>
				</View>
			</View>
			{sectionData.data.map((ingredient, i) => (
				<React.Fragment key={i}>
						<ListItem containerStyle={{paddingLeft:0, paddingRight:0, paddingTop:5, paddingBottom:5, margin:0}} key={i}>
							<ListItem.Content >
								<ListItem.Title style={{fontFamily:"Quicksand-Semibold"}}>{ingredient.ingredient}</ListItem.Title>
								<ListItem.Subtitle>{ingredient.amount} {ingredient.unit}</ListItem.Subtitle>
							</ListItem.Content>
							<ListItem.Chevron onPress={() => removeIngredient(i)} color={theme.colors.error} size={24} name="trash" />
							<ListItem.Chevron onPress={() => {
								console.log("PAINOIN OLEMASSAOLEVAA AINESOSAA, ASETAN SILLE INDEKSIKSI : ", i);
								setActiveIngredient({...ingredient, ingredient_index: i});
								setIngredientIndex(i);
								toggleOverlay();
							}} style={{marginLeft:5, marginRight:0, padding:0}} color={theme.colors.grey1} size={24} name="build"/>
						</ListItem>
				</React.Fragment>
				
			))}
			

			<Button type="clear" title="Lisää ainesosa..." onPress={() => {setIngredientIndex(null); setActiveIngredient({amount: 0, ingredient: "", unit: ""}); toggleOverlay()}} />
			<AddNewRowOverLay onSubmit={(ingredient) => handleIngredientSubmit(ingredient, ingredientIndex)} activeIngredient={activeIngredient} keywords={keywords} isVisible={overlay} onBackdropPress={toggleOverlay} />
		</Card>
	)
}

/**
 * 
 * @param {*} param0 
 * @returns 
 */

const AddNewRowOverLay = ({onSubmit, activeIngredient, keywords, isVisible, onBackdropPress}) => {
	const [unitIndex, setUnitIndex] = useState();
	const [amount, setAmount] = useState(0);
	const buttons = ['ml', 'dl', 'l','tl','rkl', 'g','kpl']
	const [newIngredient, setNewIngredient] = useState(activeIngredient);
	const {theme} = useTheme();
	const modalToastRef = React.useRef();
	const [toastVisible, setToastVisible] = useState(false);

	const [keywordIndex, setKeywordIndex] = useState([]);
	const [errorMessages, setErrorMessages] = useState({});

	const [isKeyboardVisible, setKeyboardVisible] = useState(false);
	useEffect(() => {
		const keyboardDidShowListener = Keyboard.addListener(
		  'keyboardDidShow',
		  () => {
			setKeyboardVisible(true); // or some other action
		  }
		);
		const keyboardDidHideListener = Keyboard.addListener(
		  'keyboardDidHide',
		  () => {
			setKeyboardVisible(false); // or some other action
		  }
		);
	
		return () => {
		  keyboardDidHideListener.remove();
		  keyboardDidShowListener.remove();
		};
	}, []);

	useEffect(() => {
		console.log("USE EFFECT TRIGGERED WHEN PRESSED ACTIVE INGREDIENT", activeIngredient, newIngredient);
		setErrorMessages({
			keyword: "",
			amount: "",
			unit: false
		});
		setKeywordIndex(activeIngredient.multiselector_index);
		setUnitIndex(activeIngredient.unit_index);
		setAmount(activeIngredient.amount ? activeIngredient.amount : 0);
	}, [activeIngredient]);

	return (
		<Overlay isVisible={isVisible} onBackdropPress={() => isKeyboardVisible ? Keyboard.dismiss() : onBackdropPress()}>
			<View style={{display:"flex", justifyContent:"center",alignItems:"center",paddingVertical: 20, marginHorizontal:20}}>
				<Text style={{fontSize:20, marginBottom:40}}>{activeIngredient.multiselector_index ? "Muokkaa ainesosaa" : "Lisää uusi ainesosa"}</Text>
				<SectionedMultiSelect
					single={true}
					styles={styles(theme)}
					items={keywords}
					IconRenderer={MaterialIcons}
					uniqueKey="id"
					displayKey="keyword"
					modalWithSafeAreaView
					selectText="Valitse ainesosa..."
					showChips={false}
					selectedText="valittu"
					confirmText="Vahvista"
					searchPlaceholderText="Valitse ainesosa..."
					onSelectedItemsChange={(key) => {
						setErrorMessages({...errorMessages, keyword:false});
						setKeywordIndex(key);
						setNewIngredient({...newIngredient, ingredient: keywords[key-1].keyword, multiselector_index: key});  // TODO: Miksi indeksiä pitää pienentää tässä yhdellä, jotta eri näkymissä pysyy sama itemin teksti kuoseissa???
					}}
					// selectedItems={newIngredient.multiselector_index}
					selectedItems={keywordIndex}
					/>
						
					<View style={{display:"flex", marginTop:20,marginHorizontal:0,paddingHorizontal:0, width:"100%"}}>
						<Input 
						       errorMessage={errorMessages.amount}
							   containerStyle={{marginHorizontal:0,paddingHorizontal:0}} 
							   placeholder="Määrä numeroina" 
							   keyboardType="default" 
							   returnKeyType="send"
							   onFocus={() =>setErrorMessages({...errorMessages, amount: ""})}
							   value={amount ? amount.toString() : ""} onChangeText={value => {
							value = value.replaceAll(/,/g, '.');
							value = value.replaceAll(/[^\d.]/g, '');
							setAmount(value);
							// setErrorMessages({...errorMessages, amount: ""});
							setNewIngredient({...newIngredient, amount: (value ? value : 0)});
							
						}}/>
					</View>
				</View>
				<ButtonGroup
					
      				onPress={(idx) => {
						  setErrorMessages({...errorMessages, unit:false});
						  setUnitIndex(idx);
						  setNewIngredient({...newIngredient, unit: buttons.length >= idx ? buttons[idx] : "" , unit_index: idx});
					  }}
					selectedIndex={unitIndex}
					buttons={buttons}
					textStyle={{color:"black", fontSize:16}}
					containerStyle={errorMessages.unit ? {height: 50, borderColor:'red'} : {height:50}}
					
					
			    />
				<View style={{display:"flex", flexDirection:"row", justifyContent:"space-evenly",paddingTop:40,marginBottom:20}}>
					<Button type="clear" onPress={() => onBackdropPress()} title="Takaisin"/>
					<Button type="solid" onPress={() => {
						let isError = false;
						let ErrorMessages = {...errorMessages};

						if (!amount) {
							setToastVisible(true);
							ErrorMessages = {...ErrorMessages, amount: "Syötä Määrä"};
							// setErrorMessages({...errorMessages, amount: "Syötä määrä"})
							modalToastRef.current.show({
								text1: 'Määrä puuttuu!',
								text2: 'Syötä määrä kenttään puuttuva arvo.',
								visibilityTime: 3000,
								type:"error",
								position:"top",
								topOffset:20,
								onHide: () => setToastVisible(false)
							  });
							  isError=true;
						} 
						if (! unitIndex) {
							setToastVisible(true);
							// setErrorMessages({...errorMessages, unit: true})
							ErrorMessages = {...ErrorMessages, unit: true};
							modalToastRef.current.show({
								text1: 'Yksikkö puuttuu!',
								text2: 'Valitse joku yksiköistä.',
								visibilityTime: 3000,
								type:"error",
								position:"top",
								topOffset:20,
								onHide: () => setToastVisible(false)
							  });
							  isError=true;
						} 
						if (! keywordIndex) {
							// TODO: ERROR VÄRI PUUTTUU INPUTISTA VIELÄ
							setToastVisible(true);
							ErrorMessages = {...ErrorMessages, keyword: true};
							// setErrorMessages({...errorMessages, keyword: true});
							modalToastRef.current.show({
								text1: 'Ainesosa puuttuu!',
								text2: 'Valitse ainesosa.',
								visibilityTime: 3000,
								type:"error",
								position:"top",
								topOffset:20,
								onHide: () => setToastVisible(false)
							  });
							  isError=true;
						}

						if (isError) {
							setErrorMessages(ErrorMessages);
							return;
						}


						onBackdropPress(); 
						onSubmit(newIngredient);
					}} title="Lisää"/>
				</View>
				<Toast style={{display: toastVisible ? "inherit" : "none"}} ref={modalToastRef} />
		</Overlay>
	)
}



const styles = theme => {
	return {
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
			minWidth:"100%",
			color:theme.colors.primary,
			fontFamily:"Quicksand-Bold"
		},
		modalWrapper: {
			maxHeight:"100%"
		},
		select: {
			flex:1
		},
		
		selectToggle:{
			minWidth:"100%",
			borderRadius:10,
			backgroundColor: theme.colors.grey2, // TODO: Tässä error border color pitää saada näkyviin 
			
			paddingVertical:10,
			
		}, selectToggleText:{
			marginHorizontal:10,
			color:"#000"
		}
	}
}