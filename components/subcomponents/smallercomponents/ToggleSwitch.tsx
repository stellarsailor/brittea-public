import React, { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

export default (props) => {

    const { onPress, standardSwitch } = props

    return(
        <TouchableOpacity 
        activeOpacity={1}
        onPress={onPress}
        style={{borderColor: 'lightgray', borderWidth: 1, width: 100, height: 30, flexDirection: 'row'}}>
            <View style={standardSwitch ? styles.settingToggleBackgroundSelected : styles.settingToggleBackgroundUnselected}>
                <Text style={standardSwitch ? styles.settingToggleButtonSelected : styles.settingToggleButtonUnselected}>ON</Text>
            </View>
            <View style={{ borderRightWidth: 1, borderColor: 'lightgray'}} />
            <View style={!standardSwitch ? styles.settingToggleBackgroundSelected : styles.settingToggleBackgroundUnselected}>
                <Text style={!standardSwitch ? styles.settingToggleButtonSelected : styles.settingToggleButtonUnselected}>OFF</Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    settingToggleButtonSelected: {
        textAlign: 'center', 
        color: 'red'
    },
    settingToggleButtonUnselected: {
        textAlign: 'center', 
        color: 'gray'
    },
    settingToggleBackgroundSelected: {
        justifyContent: 'center', 
        width: '50%', 
    },
    settingToggleBackgroundUnselected: {
        justifyContent: 'center', 
        width: '50%', 
        backgroundColor:'lightgray',
    },
})