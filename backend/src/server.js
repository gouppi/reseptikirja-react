// import express from 'express';
const express = require("express");
const bodyParser = require("body-parser");
const AWS = require("aws-sdk");

/** MONGO DB CONFIG */
const MongoClient = require('mongodb').MongoClient;
const MONGO_USER = "lounaskartta";
const MONGO_PASS = 'wuMhSVFYwFYxT6Y4';
const MONGO_DB = 'reseptikirja';
const MONGO_URI = `mongodb+srv://${MONGO_USER}:${MONGO_PASS}@cluster0.zhemz.gcp.mongodb.net/${MONGO_DB}?retryWrites=true&w=majority`;
const PORT = process.env.PORT || 3434;
let mongoClient;
// END OF MONGO


/**
 *	START OF AWS CREDENTIALS
 */
// const myCredentials = new AWS.CognitoIdentityCredentials({
// 	IdentityPoolId: "eu-north-1:e7d063e2-a5bf-46a8-8ae6-ff7e29b1bb0b",
// });
// const myConfig = new AWS.Config({
// 	credentials: myCredentials,
// 	region: "eu-north-1",
// });
// AWS.config.update(myConfig);
// // const DYNAMODB = new AWS.DynamoDB.DocumentClient();
// const S3_BUCKET_NAME = "softanautti-react-recipe-book";
// const S3BUCKET = new AWS.S3({params: {Bucket: S3_BUCKET_NAME}});

// END OF AWS

const app = express();
app.use(bodyParser.json());


/**
 * Endpoint for fetching single recipe data.
 */

app.post("/recipes/:id", async function (req, res) {
	let {keywords} = req.body;
	console.log("Got request to /recipes/:id, :id equals", req.params, ", got keywords -> ", keywords);
	const recipe_id = req.params.id;
	
	if (! keywords) {
		keywords = [];
	}

	let result = {};
	let client = await getClient();
	const db = await client.db(MONGO_DB);
    try {
		let result = await db.collection("recipes").findOne({"id": recipe_id});
		if (result == null) {
			res.json({});
		}

		for (let r of result.ingredients) {
			for (let d of r.data) {
				d.in_pantry = keywords.includes(d.ingredient);
			}		
		}

		res.json(result);
        
	} catch (err) {
		console.log("SINGLE RECIPE FETCH ERROR", err);
		res.json(result);
	}

})


/**
 * Endpoint for handling recipes fetch.
 * TODO: Add sort parameter, allow MongoDB to handle sorting since it plays it out nicely.
 * @method POST 
 * @params req.body.search_term {string} User-based text from input field "Mitä reseptiä etsit?"
 * @params req.body.keywords {array<string>} Ingredients-based unique array of keywords.
 * @return {array<object>} Array of Recipe objects.  
 **/
app.post("/recipes", async function (req, res) {
	let {search_term, keywords} = req.body;
	console.log("Got request to /recipes, search_term: ", search_term, "Keywords:", keywords?.join(','));
	
	let aggregations = [
		{$project: {
			"_id": 0,
			// "id": 1,
			"ingredients": 0,
			"steps": 0
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
		await db.collection("recipes").aggregate(aggregations).toArray((err, results) => {
			// console.log(err,results);
			// console.log("ERRORS", err);
			// console.log("RESULTS length:", results.length);
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
		let client = await getClient();
		const db = await client.db(MONGO_DB);
		result = await db.collection("ingredients").findOne({ean:EAN});
	} catch (err) {
		console.log(err);
	}
	res.json(result);
});

app.get('/', (req, res) => {
	res.send('Hello Server.js!');
});


/** TODO: ENDPOINT FOR FETCHING S3 STORED IMAGES */
// app.get("/image/:ean", function (req, res) {});


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
	app.listen(PORT);
	console.log("Express is listening on on port " + PORT);
})();