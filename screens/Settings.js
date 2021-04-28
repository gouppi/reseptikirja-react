import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Button, FlatList } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";

export default function Settings() {
	const [scanningMode, setScanningMode] = useState(false);
	const [hasPermission, setHasPermission] = useState(null);

	const [data, setData] = useState([]);


	useEffect(() => {
		(async () => {
		const { status } = await BarCodeScanner.requestPermissionsAsync();
		setHasPermission(status === 'granted');
		})();
	}, []);

	const handleBarCodeScanned = ({ type, data }) => {
		setScanningMode(false);
		alert(`Bar code with type ${type} and data ${data} has been scanned!`);
	};

	return (
		<View style={styles.container}>
		{scanningMode ? (
			<BarCodeScanner
				onBarCodeScanned={scanningMode && handleBarCodeScanned}
				style={StyleSheet.absoluteFillObject}
			/>
		) : (
			<>
			<FlatList
				data={data}
				renderItem={(d) => {
					return (
						<Text>{d.ean}</Text>
					)
				}}

				/>
			<Button
				title={"Lue viivakoodi"}
				onPress={() => setScanningMode(true)}
			/>
			</>
		)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#c8c8c8",
		alignItems: "center",
		justifyContent: "center",
	},
});
