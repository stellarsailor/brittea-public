import React, { useState, useCallback } from 'react'
import { Text, View, TouchableOpacity , StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/AntDesign';
import Icon2 from 'react-native-vector-icons/Ionicons';

function Tag(props: any){

    const { type, age, gender, selected } = props;

    return(
        <>
        {
            age ? 
            <View style={selected ? styles.tagButtonAgeSelected : styles.tagButtonAge} >
                <Text style={{ color: selected ? "white" : 'black'}}>
                    {age}
                </Text>
            </View>
            :
            <View 
            style={selected ? styles.tagButtonSelected : styles.tagButton} >
                <Text style={{}}>
                    {type ? type==='Monologue' ? <Icon name="user" size={20} /> : <Icon name="addusergroup" size={20} /> : null}
                    {gender ? gender==='Female' ? <Icon2 name="ios-female" size={20} /> : <Icon2 name="ios-male" size={20} /> : null}
                </Text>
                {
                    selected ?
                    <View style={styles.checked} >
                        <Icon name="check" size={15} color="white" />
                    </View>
                    :
                    <></>
                }
            </View>
        }
        </>
    )
}

const styles = StyleSheet.create({
    tagButtonSelected: {
        marginRight: 10,
        marginVertical: 5,
        borderRadius: 40,
        borderWidth: 1,
        height: 50,
        width: 50,
        paddingLeft: 10,
        paddingRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: 'dodgerblue',
    },
    tagButton:{
        marginRight: 10,
        marginVertical: 5,
        backgroundColor: 'white',
        borderRadius: 40,
        borderWidth: 1,
        height: 50,
        width: 50,
        paddingLeft: 10,
        paddingRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: 'lightgray',
    },
    tagButtonAgeSelected: {
        marginRight: 15,
        marginVertical: 5,
        width: 70, 
        height: 25,
        borderWidth: 1, 
        borderColor: 'lightgray', 
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'dodgerblue',
    },
    tagButtonAge: {
        marginRight: 15,
        marginVertical: 5,
        width: 70, 
        height: 25,
        borderWidth: 1, 
        borderColor: 'lightgray', 
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textSelected: {
        color: 'white'
    },
    text: {
        color: 'black'
    },
    checked: {
        position: 'absolute', 
        width: 16, 
        height: 16,  
        top: -3, 
        right: -3, 
        backgroundColor: 'dodgerblue', 
        borderRadius: 15, 
        alignItems: 'center', 
        justifyContent: 'center'
    }
})

export default Tag