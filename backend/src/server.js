const express = require("express");
const bodyParser = require("body-parser");
const AWS = require("aws-sdk");

/** MONGO DB CONFIG */
const MongoClient = require('mongodb').MongoClient;
const MONGO_USER = "lounaskartta";
const MONGO_PASS = 'wuMhSVFYwFYxT6Y4';
const MONGO_DB = 'reseptikirja';
const MONGO_URI = `mongodb+srv://${MONGO_USER}:${MONGO_PASS}@cluster0.zhemz.gcp.mongodb.net/${MONGO_DB}?retryWrites=true&w=majority`;
let mongoClient;
// END OF MONGO


/**
 *	START OF AWS CREDENTIALS
 */
const myCredentials = new AWS.CognitoIdentityCredentials({
	IdentityPoolId: "eu-north-1:e7d063e2-a5bf-46a8-8ae6-ff7e29b1bb0b",
});
const myConfig = new AWS.Config({
	credentials: myCredentials,
	region: "eu-north-1",
});
AWS.config.update(myConfig);
const DYNAMODB = new AWS.DynamoDB.DocumentClient();
const S3_BUCKET_NAME = "softanautti-react-recipe-book";
const S3BUCKET = new AWS.S3({params: {Bucket: S3_BUCKET_NAME}});

// END OF AWS

const app = express();
app.use(bodyParser.json());


/**
 * Endpoint for handling recipes fetch.
 * TODO: Add sort parameter, allow MongoDB to handle sorting since it plays it out nicely.
 * @method POST 
 * @params req.body.search_term {string} User-based text from input field "Mitä reseptiä etsit?"
 * @params req.body.keywords {array<string>} Ingredients-based unique array of keywords.
 * @return {array<object>} Array of Recipe objects.  
 **/
app.post("/recipes", async function (req, res) {
	console.log("Got request to /recipes!");
	let {search_term, keywords} = req.body;
	console.log("Backend:: Search_term: ", search_term, "Keywords:", keywords?.join(','));
	
	// TODO: Remove useless data for search page. We dont need steps or ingredients, only builds up data size here.
	// TODO: Can't continue on this since it would require to implement another API query on recipe page. KISS for now. 

	let aggregations = [
		{$project: {
			"_id": 0,
			// "id": 1,
			// "ingredients": 0,
			// "steps": 0
		}}
	];

	// If user provides search term and its length is greater than 2 characters, perform title search.
	if (search_term && search_term.length > 2) {
		// TODO: search_term sanitation
		let search_term_regex = ".?" + search_term + ".?";
		aggregations.push({ "$match": {'title': {$regex: search_term_regex, $options: 'i' }}});
	}

	if (keywords && Array.isArray(keywords)) {
		// TODO: keywords sanitation
		let keywords_aggregation = {
		"$addFields": {
			"Matches": {
				"$trunc": {
					"$multiply": [
					{ "$divide": [
						{ "$size": {
							"$setIntersection": [ "$all_ingredients", keywords ] 
						}}, 
						{ "$size": "$all_ingredients" }
					]},
					100
					]
				}
			}
		}};
		aggregations.push(keywords_aggregation);
		aggregations.push({ "$sort" : { "Matches" : -1 } }); // TODO if sorting by matches, add this.	
	}

	aggregations.push( { $limit : 10 });
	aggregations.push( { $skip: 0});
	
	// TODO: limit & size & offset handling as well here. We might not have keywords, we might not have search term.
	// TODO: pagination 
	
	let result = {};
	let client = await getClient();
	const db = await client.db(MONGO_DB);
    try {
		let collection = await db.collection("recipes").aggregate(aggregations).toArray((err, results) => {
			// console.log(err,results);
			console.log("ERRORS", err);
			console.log("RESULTS length:", results.length);
			res.json(results);
		});
        
	} catch (err) {
		console.log(err);
		res.json(result);
	}
});


/** 
 * ENDPOINT FOR SEARCHING BY USING EAN CODES.
 *
 */
app.get("/ingredients/:ean", async function (req, res) {
	const EAN = req.params.ean.replace(/\D/g, "").slice(0, 13); // Sanitize to 13 char
	console.log("RAW: ", req.params.ean, "SANITIZED: ", EAN);
	let result = {};
	try {
		let response = await DYNAMODB.get({
			TableName: "ingredients",
			Key: {
				ean: EAN,
			},
		}).promise();
		result = response.hasOwnProperty("Item") ? response.Item : response;
	} catch (err) {
		console.error(
			"Unable to read item. Error JSON:",
			JSON.stringify(err, null, 2)
		);
	}
	res.json(result);
});


/** TODO: ENDPOINT FOR FETCHING S3 STORED IMAGES */
app.get("/image/:ean", function (req, res) {});


/**
 * Creates a solid connection to mongodb pool.
 */
const getClient = async () => {
    if (!mongoClient) {
        mongoClient = await MongoClient.connect(MONGO_URI, { poolSize: 10, useNewUrlParser: true, useUnifiedTopology: true })
            .catch(err => { console.log(err); return getClient(); });
		console.log("MongoDB Connection ready!");
    }
    return mongoClient;
}


/**
 * Asyncronous initialization of the express server.
 * First, mongodb connection is established, and after that, server is enabled.
 */
(async() =>{
	await getClient();
	app.listen(3434);
	console.log("Express is listening on on port 3434");
})();