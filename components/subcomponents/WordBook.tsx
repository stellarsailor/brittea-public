import React, { useCallback, useState, memo } from 'react';
import { View, Text, SafeAreaView, Alert, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/AntDesign';
import { useIntl } from 'react-intl'
import FastImage from 'react-native-fast-image'

import { useSelector, useDispatch } from 'react-redux'
import { wordBookDeleteAction } from '../../redux/setting'

import AdBanner from './AdBanner';

const window = Dimensions.get('window');
const width = window.width;

export default function WordBook(props){
    const setting = useSelector((state: any) => state.setting)

    const dispatch = useDispatch();
    const onRemoveWord = useCallback((id: number) => dispatch(wordBookDeleteAction(id)),[dispatch])

    const { formatMessage: tr } = useIntl();

    const [ deleteMode, setDeleteMode ] = useState(false);

    const handleDeleteMemoAlert = useCallback( (memoId) => {
        Alert.alert(
        '',
        tr({id: 'TAB_4_WORD_BOOK_DELETE'}),
        [
            {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                //style: 'cancel',
            },
            {
                text: 'Delete', 
                onPress: () => onRemoveWord(memoId),
                style: 'destructive',
            },
        ],
        {cancelable: false},
    );
    },[])

    return (
        <SafeAreaView style={{flex: 1}}>
            <View style={{borderBottomColor: 'lightgray', borderBottomWidth: 1 , height: 50, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', width: '100%'}}>
                <TouchableOpacity style={{position: 'absolute', left: 20}} onPress={() => props.navigation.goBack() }>
                    <Icon name="left" size={22} color="gray" />
                </TouchableOpacity>
                <Text style={{ fontSize: 20, alignSelf: 'center', color: 'black'}}>My Word Book</Text> 
                <TouchableOpacity style={{position: 'absolute', right: 20}} onPress={deleteMode ? () => setDeleteMode(false) : () => setDeleteMode(true)}>
                    <Icon name={deleteMode ? "close" : "delete"} size={22} color="gray" />
                </TouchableOpacity>
            </View>
            <ScrollView style={{flex: 1}}>
                <View style={{margin: '3%'}}>
                    {setting.wordBook.length === 0 ?
                        <View style={{justifyContent: 'center', alignItems: 'center', height: width , flex: 1}}>
                            <FastImage source={require('../../images/empty.png')} style={{width: 80, height: 90}} />
                        </View>
                    :
                    setting.wordBook.map((v) => (
                        <View key={v.id} style={styles.liner}>
                            {deleteMode ? 
                            <TouchableOpacity onPress={() => handleDeleteMemoAlert(v.id)} >
                                <Text style={styles.key} selectable>{v.key}</Text> 
                                <Text style={styles.value} selectable>{v.value}</Text> 
                            </TouchableOpacity>
                            :
                            <>
                                <Text style={styles.key} selectable>{v.key}</Text> 
                                <Text style={styles.value} selectable>{v.value}</Text> 
                            </>
                            }
                        </View>
                    ))}
                </View>
            </ScrollView>
            <AdBanner />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    liner: {
        width: '100%',
        borderColor: 'lightgray',
        borderBottomWidth: 1,
    },
    key: {
        fontSize: width*0.053,
        fontWeight: 'bold',
        marginHorizontal: 10,
        marginVertical: 5
    },
    value: {
        fontSize: width*0.045,
        marginHorizontal: 10,
        marginBottom: 10,
        color: 'gray'
    }
})