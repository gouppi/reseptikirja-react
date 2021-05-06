import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const StyledButton = ({title, onPress, deleteButton=false, cancelButton = false, isVisible=true}) => {
	return isVisible && (
		<TouchableOpacity
        style={cancelButton ? styles.cancelButton : deleteButton ? styles.deleteButton : styles.button}
        onPress={onPress}
      >
        <Text style={cancelButton ? styles.cancelButtonText : deleteButton ? styles.deleteButtonText : styles.buttonText} >{title}</Text>
      </TouchableOpacity>
	) ;
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: "#8BCF89",
    borderColor:"transparent",
    borderRadius:4,
    borderWidth:2,    
    paddingVertical:16,
    paddingHorizontal: 10,
  },
  cancelButton: {
	  alignItems: "center",
    backgroundColor: "#FFF",
    borderColor: "#000",
    borderRadius:4,
    borderWidth:2,
    paddingVertical:16,
    paddingHorizontal: 10,
  },
  deleteButton: {
    alignItems: "center",
    backgroundColor: "#CC5A71",
    borderColor: "#CC5A71",
    borderRadius:4,
    borderWidth:2,
    paddingVertical:16,
    paddingHorizontal: 10,
  },
  buttonText: {
    fontSize:16,
	  fontWeight:'bold',
	  color:"#000"
  },
  cancelButtonText: {
    fontSize:16,
    fontWeight:'bold',
	  color: "#000",
	  backgroundColor:"#fff"
  },
  deleteButtonText: {
    fontSize:16,
    fontWeight:'bold',
	  color: "#FFF",
	  //backgroundColor:"#fff"
  }
});

export default StyledButton;