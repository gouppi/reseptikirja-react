
import axios from 'axios';

const RECIPES_ENDPOINT = 'recipes';
const INGREDIENT_ENDPOINT = 'ingredients';

let APIKit = axios.create({
	baseURL: 'http://192.168.0.102:3434/',
	timeout: 1000
});

export async function fetchRecipes(search_term: string, ingredients?: Array<string>) {
	try {
		const result = await APIKit.post(RECIPES_ENDPOINT, {
			search_term: search_term,
			ingredients: ingredients
		});
		console.log("RESULT", result);
		return result;
	} catch (error) {
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