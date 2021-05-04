import React, { useContext, createContext, useState, useEffect } from "react";
import { getData, setData, PANTRY_KEY, PANTRY_KEYWORDS_KEY } from "../workers/AsyncStorageWorker";
import {fetchRecipes as fetchRecipesAPIWorker} from '../workers/APIWorker';


const PantryContext = createContext({});
const usePantryContext = () => useContext(PantryContext);
const PantryContextProvider = ({ children }) => {
	const [ingredients, setIngredients] = useState([]);
	const [keywords, setKeywords] = useState([]);
	const [recipes, setRecipes] = useState([]);

	/**
	 * 
	 */
	const fetchRecipes = async (query) => {
		let response;
		try {
			response = await fetchRecipesAPIWorker(query, keywords);
			console.log("Got response from server.js!");
			setRecipes(response);
		} catch(err) {
			console.log(err);
		}
	}


	/** 
	*	This useEffect fetches the initial dataset from device
	*	storage (through asyncStorageWorker) and sets it to context
	*/
	useEffect(() => {
		const getFromStorage = async () => {
			try {
				console.log("Pantry context async storage worker get data ingredients");
				let ingredients = await getData(PANTRY_KEY);
				if (ingredients !== null) {
					setIngredients(JSON.parse(ingredients));
					// If we have ingredients in asyncStorage, We possibly have keywords as well.
					let keywords = await getData(PANTRY_KEYWORDS_KEY);
					if (keywords !== null) {
						setKeywords(JSON.parse(keywords));
					}
				}

			} catch (err) {
				console.log(err);
			}
		};
		getFromStorage();
	}, []);


	/** 
	* 	This useEffect listens for changes happening to ingredients list
	* 	and updates the change to device storage (through asyncStorageWorker) 
	*/
	useEffect(() => {
		const setToStorage = async () => {
			if (ingredients === null || ingredients === "undefined") ingredients = [];
			try {
				await setData(PANTRY_KEY, JSON.stringify(ingredients));
				await setData(PANTRY_KEYWORDS_KEY, JSON.stringify(uniqueKeywords(ingredients)));
			} catch (err) {
				console.log(err);
			}
		};
		setToStorage();
	}, [ingredients]);


	/**
	*	Whenever ingredients list changes (user scans new product / removes product from the list), keywords is due to change.
	* 	We need to keep track which keywords we currently have for this user, so we can use them when querying recipes from DB.
	*	
	*	This function takes in all ingredients, loops through them, and combines all ingredients to all_keywords - parameter.
	*	Once every keyword is stored, we get rid of possible duplicate keywords. 
 	*/
	const uniqueKeywords = () => {
		let all_keywords = [];
		ingredients.map(ingredient => {
			all_keywords.push(...ingredient.keywords);
		});
		let unique = all_keywords.filter((value, index, self) => {
			return self.indexOf(value) === index;
		});
		return unique;
	}

	return (
		<PantryContext.Provider value={{ ingredients, setIngredients, keywords,fetchRecipes, recipes }}>
			{children}
		</PantryContext.Provider>
	);
};

export { PantryContextProvider, usePantryContext };
