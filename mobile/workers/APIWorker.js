
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