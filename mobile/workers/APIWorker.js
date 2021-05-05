
import axios from 'axios';

const RECIPES_ENDPOINT = 'recipes';
const INGREDIENT_ENDPOINT = 'ingredients';

let APIKit = axios.create({
	baseURL: 'http://192.168.0.102:3434/',
	timeout: 5000
});

/**
 * Creates a POST request to backend server, providing possible search_term - parameter and optional keywords.
 * @param search_term {string} user-based text, "Mitä reseptiä haluat etsiä?". Raw-string based.
 * @param keywords {array<string>} ingredient-based keywords, unique array of strings. Provided to DB as well.
 *  
 */
export async function fetchRecipes(search_term?: string, keywords?: Array<string>) {
	try {
		const result = await APIKit.post(RECIPES_ENDPOINT, {
			search_term:search_term,
			keywords: keywords
		});
		return result.data;
	} catch (error) {
		console.log("FETCH RECIPES ERROR:");
		console.log(error);
	}
	return false;
}


/**
 * Creates a POST request to backend server, providing single recipe ID as well as user current keywords.
 * Backend fetches full data for the recipe and marks found keywords directly on the backend side, the task isn't done
 * on the client side.
 * @param recipe_id {string} unique identifier for recipe
 * @param keywords {array<string>}
 */

export async function fetchSingleRecipe(recipe_id: string, keywords?: Array<string>) {
	console.log("Fetch Single Recipe triggered with following data");
	console.log("REcipe id", recipe_id);
	console.log("Keywords: ", keywords?.join(','));
	try {
		const result = await APIKit.post(RECIPES_ENDPOINT + '/' + recipe_id, {
			keywords: keywords
		});
		return result.data;
	} catch (error) {
		console.log("FETCH SINGLE RECIPE ERROR:");
		console.log(error);
	}
	return false;
}


export async function fetchIngredient(ean: string) {
	try {
		const result = await APIKit.get(INGREDIENT_ENDPOINT + '/' + ean);
		return result.data;
	} catch(error) {
		console.log("FETCH INGREDIENT ERROR:");
		console.log(error);
	}
	return false;
}

module.exports.fetchIngredient = fetchIngredient;
module.exports.fetchRecipes = fetchRecipes;
module.exports.fetchSingleRecipe = fetchSingleRecipe;