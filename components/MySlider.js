import React from 'react'
import {View, Slider, Text, StyleSheet} from 'react-native'

export default function MySlider ({max, unit, step, value, onChange}){
    return(
        <View style = {styles.row}>
            <Slider 
            style={{flex:1}}
            step={step}
            value={value}
            maximumValue={max}
            minimumValue={0}
            onValueChange={onChange} />
            <View style={styles.metricCounter}>
                <Text style={{fontSize: 24, textAlign:'center'}}>{value}</Text>
                <Text style={{fontSize: 18, color:'grey'}}>{unit}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    row:{
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
    },
    metricCounter:{
        width: 85,
        alignItems: 'center',
        justifyContent: 'center',
    }
})