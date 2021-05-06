 import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View,Image } from "react-native";


const BetterButton = ({title, onPress}) => {
	return (
		<TouchableOpacity
        style={styles.appButtonContainer}
        onPress={onPress}
      >
	  	<View style={styles.padding}>
		  	{/* <Image style={{width:26, height:19,backgroundColor:"#fff", transform: [{rotate: "-35deg"}]}}  source={require('../assets/barcode.png')} /> */}
	        <Text style={styles.appButtonText} >{title}</Text>
		</View>
      </TouchableOpacity>
	)
}

const styles = StyleSheet.create({
  appButtonContainer: {
    elevation: 8,
    backgroundColor: "#55a630",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 12
  },
  padding: {
	display:"flex",
	flexDirection:"row",
	justifyContent:"space-between"
  },
  appButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
  }
});

export default BetterButton;