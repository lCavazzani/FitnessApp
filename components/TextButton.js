import React from 'react'
import { TouchableOpacity, Text, StyleSheet} from 'react-native'
import {purple} from '../utils/colors'

export default function TextButton({children, onPress, style = {}}){

    return(
        <TouchableOpacity onPress={onPress}>
            <Text style={[styles.reset, style]}>{children}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    reset:{
        textAlign: 'center',
        color:purple,
    },
    iosSubmitBtn: {
        backgroundColor: purple,
        padding: 10,
        borderRadius: 7,
        height:45,
        marginLeft: 40, 
        marginRight: 40
    },
    androidSubmitBtn:{
        backgroundColor: purple,
        padding: 10,
        paddingLeft: 30,
        paddingRight: 30,
        borderRadius: 2,
        height:45,
        alignSelf: 'flex-end',
        justifyContent: 'center',
        alignItems: 'center',
    },
})