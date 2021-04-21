import React, { useState } from "react";
import {
	StyleSheet,
	Text,
	TextInput,
	View,
	FlatList,
	TouchableWithoutFeedback,
} from "react-native";
import Card from "../components/Card";

export default function Cards({ navigation }) {
	const [text, onChangeText] = useState("");

	const DATA = [
		{
			id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
			title: "Mokkapalat",
			img:
				"https://cdn.valio.fi/mediafiles/54f7efd9-18cc-4cb4-83f7-e1b3f41cb231/1000x752-recipe-hero/4x3/mokkapalat.jpg",
			time: 45,
			ingredients: [
				{
					section: "Pohja",
					data: [
						"5dl Vehnäjauhoa",
						"4 Kananmunaa",
						"2dl Maitoa",
						"2.5dl sokeria",
						"200g voita",
						"0.5dl kaakaojauhetta",
						"1rkl leivinjauhetta",
						"1rkl vaniljasokeria",
					],
				},
				{
					section: "Kuorrutus",
					data: [
						"75g voita",
						"noin desi vahvaa kahvia",
						"4dl (240g) tomusokeria",
						"0.5dl kaakaojauhetta",
						"2tl vaniljasokeria",
					],
				},
				{
					section: "Pinnalle",
					data: ["nonparelleja"],
				},
			],
			steps: [
				{
					section: "Pohja",
					data: [
					"Vatkaa huoneenlämpöiset munat ja sokeri paksuksi, vaaleaksi vaahdoksi.",
					"Sulata voi kattilassa tai mikrossa. Lisää voisulaan kylmä maito, niin se jäähtyy sopivaksi.",
					"Yhdistä kuivat aineet.",
					"Sekoita muna-sokerivaahtoon voi-maitoseos sekä kuivat aineet sihdin läpi. Sekoita varovasti nuolijalla tasaiseksi.",
					"Kaada leivinpaperille uunipannulle n. 30 - 40 cm.",
					"Kypsennä uunin keskiosassa 200 asteessa n. 15 min. Anna jäähtyä ennen kuorruttamista.",
					],
					time: 15
				},
				{
					section: "Kuorrutus",
					data: [
						"Sulata voi kattilassa.",
						"Lisää kahvi. Sihtaa muut aineet siivilän läpi. Sekoita, kunnes tasaista.",
						"Kaada hieman lämmin kuorrutus pohjan keskelle. (Kuumana kuorrute on liian löysää levitettäväksi ja silloin se imeytyy pohjaan. Kuorrutteen jäähtyessä, se paksuuntuu sopivaksi.) Anna valua reunoja kohti.",
						"Levitä tarvittaessa lastalla reunoille.",
						"Koristele nonparelleilla ennen kuin kuorrutus kovettuu. Leikkaa 24 - 30 palaa.",
					],
				}
			],
		},
		{
			id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
			title: "Mansikkatäytekakku",
			img:
				"https://cdn.valio.fi/mediafiles/e9c3903a-e5c6-4ee4-a2ea-a96e53896745/1000x752-recipe-hero/4x3/mansikkakakku.jpg",
			time: 45,
			ingredients: {
				"": ["Vehnäjauho", "Kananmuna"],
			},
			steps: {
				"": [
					"Vatkaa huoneenlämpöiset munat ja sokeri paksuksi, vaaleaksi vaahdoksi.",
				],
			},
		},
		{
			id: "58694a0f-3da1-471f-bd96-145571e29d72",
			title: "Gluteeniton Unelmatorttu",
			img:
				"https://cdn.valio.fi/mediafiles/045e465f-7dc9-4930-8956-5cc68d83e79e/1000x752-recipe-hero/4x3/unelmatorttu-2.jpg",
			time: 45,
			ingredients: {
				"": ["Vehnäjauho", "Kananmuna"],
			},
			steps: {
				"": [
					"Vatkaa huoneenlämpöiset munat ja sokeri paksuksi, vaaleaksi vaahdoksi.",
				],
			},
		},
	];

	return (
		<View style={styles.cardsContainer}>
			<Text style={styles.greeting}> Moikka Janne!</Text>
			<TextInput
				style={styles.input}
				placeholder="Millaista reseptiä etsit tänään?"
				onChangeText={onChangeText}
				value={text}
			/>

			<FlatList
				style={styles.flatList}
				data={DATA}
				renderItem={(d) => (
					<TouchableWithoutFeedback
						onPress={() =>
							navigation.navigate("Recipe", {
								recipe: d.item,
							})
						}
					>
						<View>
							<Card {...d.item} />
						</View>
					</TouchableWithoutFeedback>
				)}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	cardsContainer: {
		paddingTop: 40,
		paddingLeft: 15,
		paddingRight: 15,
		flex: 1,
		// flexDirection: 'column',
		backgroundColor: "#F6F6F6",
		// alignItems: 'center',
		justifyContent: "center",
	},
	textAndInput: {
		flex: 1,
	},
	input: {
		width: "100%",
		borderColor: "#c8c8c8",
		backgroundColor: "#fff",
		height: 40,
		marginBottom: 20,
		marginTop: 10,
		paddingTop: 4,
		paddingBottom: 4,
		textAlign: "center",
		borderWidth: 1,
		borderRadius: 15,
	},
	greeting: {
		textAlign: "center",
		fontSize: 14,
		fontWeight: "600",
	},
	flatList: {
		// flex:1
	},
});
