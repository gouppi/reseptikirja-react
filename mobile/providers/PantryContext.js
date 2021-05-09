import React, { useContext, useCallback, createContext, useState, useEffect, useRef } from "react";
import { getData, setData, PANTRY_KEY } from "../workers/AsyncStorageWorker";
import {fetchRecipes as fetchRecipesAPIWorker,
		fetchSingleRecipe as fetchSingleRecipeAPIWorker} from '../workers/APIWorker';


const PantryContext = createContext({});
const usePantryContext = () => useContext(PantryContext);
const PantryContextProvider = ({ children }) => {
	
	// ingredients contains all scanned ingredients from pantry page. 
	const [ingredients, setIngredients] = useState([]);
	// Keywords contains a distinct list of ingredient keywords. (used for API querying).
	const [keywords, setKeywords] = useState([]);
	const [recipes, setRecipes] = useState([]);
	const [singleRecipe, setSingleRecipe] = useState(null);
	const [hasBeenInit, setHasBeenInit] = useState(false);

	const [initExecuted, setInitExecuted] = useState(false);
	const [keywordsSet, setKeywordsSet] = useState(false);

	const [newIngredientEAN, setNewIngredientEAN] = useState(null); // If we scan an EAN, this state changes.
	const keywordsChanged = useRef(false); // TODO: Check how to properly use this useRef, you need this when user changes ingredients @124
	 

	useEffect(() => {init()}, []);

	const init = async () => {
		console.log("Running initialization");
		try {
			let i = await getData(PANTRY_KEY);
			i = i === null ? [] : JSON.parse(i);
			await setIngredients(i);
			setInitExecuted(true);

		} catch(error) {
			console.log(error);
		}
	}

	useEffect(() => {
		if (! initExecuted) return;
		console.log("Ingredients changed. Check keyword status");
		let all_keywords = [];
		ingredients.map(i => all_keywords.push(...i.keywords));
		let newKeywords = all_keywords.filter((value, index, self) => {
			return self.indexOf(value) === index;
		});
		console.log("New keywords: ", newKeywords.join(","));
		setKeywords(newKeywords);
		setKeywordsSet(true);
	}, [initExecuted, ingredients])


	useEffect(() => {
		if (!initExecuted || !keywordsSet) return;
		(async () => {
			console.log("Triggering fetchRecipes (this should trigger only once!)");
			await fetchRecipes();
			setHasBeenInit(true);
		})();
	}, [keywordsSet]);


	/** */
	const fetchSingleRecipe = async (recipe_id) => {
		let response;
		try {
			response = await fetchSingleRecipeAPIWorker(recipe_id, keywords);
			console.log("Got single recipe " + recipe_id + " response from server.js!");
			setSingleRecipe(response);
		} catch(err) {
			console.log(err);
		}
	}

	const fetchRecipes = async (query) => {
		console.log("I'm now starting to fetch recipes with query '", query ,"' , and with keywords", keywords.join(','));
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
	 * This function was added later when I found out one bug in the flow.
	 * User might open a recipe and the user could have several ingredients (and keywords) stored
	 * in device already. These are used when fetching data as well.
	 * 
	 * If user opens a single recipe, and sees for example, 3 checkmarks (voi, kananmuna, vehnäjauho), 
	 * and then navigates to pantry page and removes those ingredients and then back to the previous recipe,
	 * the checkmarks do not disappear (Since they're checked in the backend side)
	 * 
	 * There is no point in fetching the same data again, we can just do the keyword check in this specific 
	 * case (if user makes ingredient changes ADD/DELETE, keywords-list changes, and user has singleRecipe active.)
	 */

	const updateIngredients = async (ingredient, action) => {
		const refKeyword = keywordsChanged.current;
		let iL = ingredients;
		if (action === 'ADD' && iL.every(i => i.ean !== ingredient.ean)) {
			iL = [...iL, ingredient];
		} else if (action === 'DELETE') {
			iL = iL.filter(i => i.ean !== ingredient.ean);
		}

		// if new ingredients diffs from old, save
		if (iL.length !== ingredients.length) {
			setIngredients(iL);
			await setData(PANTRY_KEY, JSON.stringify(iL));
			console.log("KUTSUN REFKEYWORDIA NYT TRUE ARVOLLA");
			refKeyword.current=true;

			// TODO: Here, we are storing new ingredients to state, which then triggers new keywords validation and state save.
			// How to call CheckRecipeKeywords properly?
		}
	}

	// TODO: You need this once you want to update singleRecipe existing ingredients immediately after updateIngredients function call.
	const checkRecipeKeywords = () => {
		console.log("checkRecipeKeywords triggered as callback");
		if (!keywordsChanged.current) return;
		console.log("... and processing it, since updateIngredients has checked refkeyword to true");
		let recipe = singleRecipe;
			for (let r of recipe.ingredients) {
				for (let d of r.data) {
					d.in_pantry = keywords.includes(d.ingredient);
				}
			}
		setSingleRecipe(recipe);
		keywordsChanged.current = false;
	}


	// useEffect(() => {
	// 	if (! initExecuted || ! newIngredientEAN) return;
	// 	console.log("PantryContext triggered, got EAN CODE: ", newIngredientEAN);
	// }, [newIngredientEAN, initExecuted ])


	
	useEffect(() => {checkRecipeKeywords()}, [keywords])




	



	return (
		<PantryContext.Provider value={{ updateIngredients, ingredients, keywords,fetchRecipes,recipes,fetchSingleRecipe,singleRecipe, hasBeenInit, setNewIngredientEAN }}>
			{children}
		</PantryContext.Provider>
	);
};

export { PantryContextProvider, usePantryContext };
