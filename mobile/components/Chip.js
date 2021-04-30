import React from 'react';
import { StyleSheet, Text,View} from 'react-native';


export default function Chip(props) {
    return (
        <View style={styles.chip}>
            <Text style={styles.chipText}>{props.text}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    chip: {
        backgroundColor:"#3EA923",
        borderRadius:5,
        paddingHorizontal:8,
        paddingVertical:4,
        marginRight:2,
        marginTop:4,
        
    },
    chipText: {
        fontSize:13,
        fontWeight:"bold",
        color: "#FFF"

    }
});