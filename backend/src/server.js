const express = require("express");
const bodyParser = require("body-parser");
const AWS = require("aws-sdk");

let myCredentials = new AWS.CognitoIdentityCredentials({
	IdentityPoolId: "eu-north-1:e7d063e2-a5bf-46a8-8ae6-ff7e29b1bb0b",
});
let myConfig = new AWS.Config({
	credentials: myCredentials,
	region: "eu-north-1",
});

// AWS CONFIGURATIONS HERE //
AWS.config.update(myConfig);
const DYNAMODB = new AWS.DynamoDB.DocumentClient();
const S3_BUCKET_NAME = "softanautti-react-recipe-book";
const S3BUCKET = new AWS.S3({
	params: { Bucket: S3_BUCKET_NAME },
	apiVersion: "2006-03-01",
});

// END OF AWS CONFIGURATIONS //

const app = express();
app.use(bodyParser.json());

/** ENDPOINT FOR SEARCHING RECIPES */
app.post("/recipes", function (req, res) {
	console.log(req.body);
	res.send(RECIPES);
});

/** ENDPOINT FOR SEARCHING BY USING EAN CODES. */
app.get("/ingredients/:ean", async function (req, res) {
	const EAN = req.params.ean.replace(/\D/g, '').slice(0,13); // Sanitize to 13 char
	console.log("RAW: ", req.params.ean, "SANITIZED: ", EAN);
	let result = {};
	try {
		let response = await DYNAMODB.get({
			TableName: 'ingredients',
			Key: {
				ean: EAN
			}
		}).promise();
		result = response.hasOwnProperty('Item') ? response.Item : response;

	} catch (err) {
		console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
	}
	res.json(result);
});


/** TODO: ENDPOINT FOR FETCHING S3 STORED IMAGES */
app.get("/image/:ean", function (req, res) {});

app.listen(3434);
console.log("Express is listening on on port 3434");

// const RECIPES = [
// 	{
// 		id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
// 		title: "Mokkapalat",
// 		img:
// 			"https://cdn.valio.fi/mediafiles/54f7efd9-18cc-4cb4-83f7-e1b3f41cb231/1000x752-recipe-hero/4x3/mokkapalat.jpg",
// 		time: 45,
// 		ingredients: [
// 			{
// 				section: "Pohja",
// 				data: [
// 					{
// 						ingredient: "Vehnäjauho",
// 						amount: "5",
// 						unit: "dl",
// 					},
// 					{
// 						ingredient: "Kananmuna",
// 						amount: "4",
// 						unit: "kpl",
// 					},
// 					{
// 						ingredient: "Maito",
// 						amount: "2",
// 						unit: "dl",
// 					},
// 					{
// 						ingredient: "Sokeri",
// 						amount: "2.5",
// 						unit: "dl",
// 					},
// 					{
// 						ingredient: "Voi",
// 						amount: "200",
// 						unit: "g",
// 					},
// 					{
// 						ingredient: "Kaakaojauhe",
// 						amount: "0.5",
// 						unit: "dl",
// 					},
// 					{
// 						ingredient: "Leivinjauhe",
// 						amount: "1",
// 						unit: "rkl",
// 					},
// 					{
// 						ingredient: "Vaniljasokeri",
// 						amount: "1",
// 						unit: "rkl",
// 					},
// 				],
// 			},
// 			{
// 				section: "Kuorrutus",
// 				data: [
// 					{
// 						ingredient: "Voi",
// 						amount: "75",
// 						unit: "g",
// 					},
// 					{
// 						ingredient: "Kahvi",
// 						amount: "1",
// 						unit: "dl",
// 					},
// 					{
// 						ingredient: "Tomusokeri",
// 						amount: "4",
// 						unit: "dl",
// 					},
// 					{
// 						ingredient: "Kaakaojauhe",
// 						amount: "0.5",
// 						unit: "dl",
// 					},
// 					{
// 						ingredient: "Vaniljasokeri",
// 						amount: "2",
// 						unit: "tl",
// 					},
// 				],
// 			},
// 			{
// 				section: "Pinnalle",
// 				data: [
// 					{
// 						ingredient: "Nonparelli",
// 						amount: "",
// 						unit: "",
// 					},
// 				],
// 			},
// 		],
// 		steps: [
// 			{
// 				section: "Pohja",
// 				data: [
// 					"Vatkaa huoneenlämpöiset munat ja sokeri paksuksi, vaaleaksi vaahdoksi.",
// 					"Sulata voi kattilassa tai mikrossa. Lisää voisulaan kylmä maito, niin se jäähtyy sopivaksi.",
// 					"Yhdistä kuivat aineet.",
// 					"Sekoita muna-sokerivaahtoon voi-maitoseos sekä kuivat aineet sihdin läpi. Sekoita varovasti nuolijalla tasaiseksi.",
// 					"Kaada leivinpaperille uunipannulle n. 30 - 40 cm.",
// 					"Kypsennä uunin keskiosassa 200 asteessa n. 15 min. Anna jäähtyä ennen kuorruttamista.",
// 				],
// 				time: 15,
// 			},
// 			{
// 				section: "Kuorrutus",
// 				data: [
// 					"Sulata voi kattilassa.",
// 					"Lisää kahvi. Sihtaa muut aineet siivilän läpi. Sekoita, kunnes tasaista.",
// 					"Kaada hieman lämmin kuorrutus pohjan keskelle. (Kuumana kuorrute on liian löysää levitettäväksi ja silloin se imeytyy pohjaan. Kuorrutteen jäähtyessä, se paksuuntuu sopivaksi.) Anna valua reunoja kohti.",
// 					"Levitä tarvittaessa lastalla reunoille.",
// 					"Koristele nonparelleilla ennen kuin kuorrutus kovettuu. Leikkaa 24 - 30 palaa.",
// 				],
// 			},
// 		],
// 	},
// ];
