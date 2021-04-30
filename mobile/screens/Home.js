import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import {getData, setData} from '../workers/AsyncStorageWorker';

export default function Home() {
	const [clicks, setClicks] = useState(0);
	const CLICK_KEY = 'num_of_clicks';

	useEffect(() => {
		const getCurrentClicks = async () => {
			let clicks = await getData(CLICK_KEY);
			clicks = JSON.parse(clicks);
			setClicks(clicks);
		}
		getCurrentClicks();
	},[]);

	const incrementClicks = async () => {
		let clicks = await getData(CLICK_KEY);
		clicks++;
		setClicks(clicks);
		setData(CLICK_KEY, JSON.stringify(clicks));
	}

  return (
    <View style={styles.container}>
      <Text>Home Screen is functional!</Text>
      <Button onPress={() => {incrementClicks()}} title="Nappi"></Button>
      <Text>{clicks}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
