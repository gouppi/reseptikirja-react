import AsyncStorage from '@react-native-async-storage/async-storage';


	export const PANTRY_KEY = "@PANTRY_INGREDIENTS";

// export default const AsyncStorageWorker = () => {

	/**
		Tries to fetch data from AsyncStorage with given key.
		Returns data if proper data is found, otherwise null is returned.
		@prop key string
		@return mixed
	 */
	export const getData = async (key) => {
		let data;
		try {
			data = await AsyncStorage.getItem(key);
			if (data !== null) {
				return data;
			}
		} catch (e) {
			console.log(e);
		}
		return null;
	}

	/**
		Tries to set data from AsyncStorage with given key and value.
		@prop key string
		@prop value mixed
	 */
	export const setData = async (key, value) => {
		try {
			await AsyncStorage.setItem(key, value);
			console.log(`SetItem call with key ${key} was successful`)
		} catch (e) {
			console.log(e);

		}
	}
// }



