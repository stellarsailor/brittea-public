import React from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';

export default function DetailViewBottomTab(props: any){

    const { navProps, bookmarkLock, onHandleBookmark, bookmarked, description, setDescription, setSettingModal } = props

    return(
        <View style={{ width: '100%', height: 50}}>
            <View style={styles.buttonBox}>
                <TouchableOpacity activeOpacity={.7} onPress={() => navProps.navigation.goBack()}>
                    <Icon name="arrowleft" size={25} color="black" style={{marginLeft: 5, marginRight: 15}} />
                </TouchableOpacity>
                <TouchableOpacity disabled={bookmarkLock} activeOpacity={.7} onPress={() => onHandleBookmark() }>
                    {
                        bookmarked ? 
                        <Icon name="heart" size={25} color="red" style={{marginLeft: 5, marginRight: 15}} />
                        :
                        <Icon name="hearto" size={25} color="black" style={{marginLeft: 5, marginRight: 15}} />
                    }
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={.7} onPress={() => {if(description){setDescription(false)}else {setDescription(true);}}}>
                    {
                        description ?
                        <Icon name="profile" size={25} color="red" style={{marginLeft: 5, marginRight: 15}} />
                        :
                        <Icon name="profile" size={25} color="black" style={{marginLeft: 5, marginRight: 15}} />
                    }
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={.7} onPress={() => setSettingModal(true)}>
                    <Icon name="ellipsis1" size={25} color="black" style={{marginLeft: 5, marginRight: 15,}} />
                </TouchableOpacity>
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    buttonBox: {
        backgroundColor: 'white',
        borderColor: 'lightgray',
        borderTopWidth: 1,
        padding : 10, 
        paddingLeft: 30,
        paddingRight: 30,
        height: 50,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
})