import React, { useState, useEffect, useRef } from "react";
import {
	StyleSheet,
	TextInput,
	View,
	SafeAreaView,
	FlatList,
	TouchableWithoutFeedback,
	RefreshControl,
} from "react-native";
// import Card from "../components/Card";
import {usePantryContext} from '../providers/PantryContext';
import { colors, useTheme } from 'react-native-elements';
import { Text, Card,SearchBar,CheckBox } from 'react-native-elements';
import { Avatar } from "react-native-elements/dist/avatar/Avatar";
import {MaterialIcons} from '@expo/vector-icons/';

let x;
export default function Cards({ navigation }) {
	const {ingredients,recipes, fetchRecipes} = usePantryContext();
	const [searchParam, updateSearchParam] = useState("");
	const [isQuerying, setIsQuerying] = useState(false);

	const [showLoader, setShowLoader] = useState(false);
	const {theme} = useTheme();

	// If querying lasts longer than 500ms, enable loader-mode, which shows FlatList default spinner.
	const timeout = useRef(null);
	useEffect(() => {
		if (isQuerying) {
			timeout.current = setTimeout(() => {
				setShowLoader(true);
			}, 500)
		} else {
			clearTimeout(timeout.current);
			setShowLoader(false);
		}
	}, [isQuerying])

	const changeSearchText = (text) => {
		updateSearchParam(text);
		clearTimeout(x);
		x = setTimeout( async () => {
			if (isQuerying) return; // don't allow DoS, wait for first query to return. TODO: CANCEL INITIAL REQUESTS.
			setIsQuerying(true);
			let data = await fetchRecipes(text);
			setIsQuerying(false);
		}, 500);
	}


	return (
		<SafeAreaView style={styles.cardsContainer}>
			<FlatList
				refreshControl={
				<RefreshControl
					
					refreshing={isQuerying && showLoader}
					onRefresh={() => {fetchRecipes()}}
					/>
				}

				showsVerticalScrollIndicator={false}
				stickyHeaderIndices={[0]}
				ListEmptyComponent={() =>  {
					return searchParam.length ? (
						<View style={styles.center}>
							<Text>En löytänyt reseptejä hakusanallasi.</Text><Text>Kokeile toista hakusanaa!</Text>
						</View>
						) :
					(
						<View style={styles.center}>
							<Text>Virhe noudettaessa reseptejä.</Text><Text>Päivitä listaa vetämällä alaspäin.</Text>
						</View>
					)	
				}}
				ListHeaderComponent={
				<View style={styles.inputContainer}>
					<SearchBar
						
						containerStyle={{marginVertical:0,backgroundColor:theme.colors.white, borderBottomWidth:1,borderBottomColor:theme.colors.grey0}}
						inputStyle={{fontFamily:"Quicksand-Medium"}}
						
						platform="android"
						placeholder="Millaista reseptiä etsit tänään?"
						placeholderTextColor={"#888"}
						onChangeText={changeSearchText}
						value={searchParam}
					/>
					

					

				</View>}
				// style={{...styles.flatList}}
				data={recipes}
				keyExtractor={d => "recipe_" + d.id}
				renderItem={(d) => {
					return (
					<TouchableWithoutFeedback
						onPress={() =>
							navigation.navigate("Recipe", {
								recipe_id: d.item.id,
							})
						}
					>
							<Card containerStyle={{margin:0, padding:0, borderLeftWidth:0, borderRightWidth:0, borderTopColor: theme.colors.grey2,borderBottomColor: theme.colors.grey2}}>
								{/* <Card.Title style={{color: theme.colors.black, textAlign:'left', marginLeft: 8}}>{d.item.title}</Card.Title> */}
								{/* <View>
									<Avatar 
										rounded
										source={{
										uri:
										'https://i.pravatar.cc/128',
									}} />

								</View> */}
								<Card.Image wrapperStyle={{paddingVertical:0}} source={{uri: (d.index % 2 == 0 ? 'https://www.myllynparas.fi/sites/default/files/styles/mp_recipe_big_portrait/public/thumbnails/image/1436250483_pannukakku.jpg?itok=36hTXceu' : d.item.img)}}>
								
								</Card.Image>
								<View style={{paddingTop:10, paddingBottom:10}}>
									<Card.FeaturedTitle style={{fontFamily:"Quicksand-Medium",color: theme.colors.black, textAlign:'left', marginLeft: 8}}>{d.item.title} {d.item.title}</Card.FeaturedTitle>
									<Card.FeaturedSubtitle style={{marginVertical:0,paddingVertical:0,color: theme.colors.black, textAlign:'left', marginLeft: 8}}>{d.item.title} {d.item.title}</Card.FeaturedSubtitle>
								</View>
								
						</Card>

						{/* <View>
							<Card {...d.item} />
						</View> */}
					</TouchableWithoutFeedback>
				)}}
			/>
		</SafeAreaView>
	 );
}
const styles = StyleSheet.create({
	cardsContainer: {
		flex: 1,
		backgroundColor: "#f6f6f6",
		justifyContent: "center",
	},
	textAndInput: {
		flex: 1,
	},
	inputContainer: {
		backgroundColor: "#fff",
		width:"100%",
		// paddingVertical:10,
		// marginBottom:5,
	},
	input: {
		borderColor: "#c8c8c8",
		backgroundColor: "#fff",
		height: 40,
		paddingTop: 4,
		paddingBottom: 4,
		textAlign: "center",
		borderBottomWidth: 1,
		borderBottomColor:"#d8d8d8",
	},
	greeting: {
		textAlign: "center",
		fontSize: 24,
		fontWeight: "500"
	},
	flatList: {
		flex:1
	},
	center: {
		flex: 1,
		justifyContent:"center",
		alignItems:"center",
	}
});
