import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, KeyboardAvoidingView, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon2 from 'react-native-vector-icons/FontAwesome';
import Modal from 'react-native-modal'

import { useIntl } from 'react-intl'

import { Dimensions } from 'react-native';
const window = Dimensions.get('window');
const width = window.width;

import { useDispatch, useSelector } from 'react-redux'
import { setWordBookAction } from '../../redux/setting'
export default function BuiltInWordBook (props){
    const setting = useSelector((state: any) => state.setting)

    const dispatch = useDispatch();
    const onWordBookAdd = useCallback((key: string, value: string) => dispatch(setWordBookAction(key, value)),[dispatch])

    const { formatMessage: tr } = useIntl();

    let { script, play, setPlayLock, subScript } = props
    const splitedScript = script.split(' ')
    if(subScript==undefined){
        subScript="";
    }

    const [ wordInputModalShown, setWordInputModalShown ] = useState(false)
    
    const [ addWordMode, setAddWordMode ] = useState(false);
    const [ inputTitleValue, setInputTitleValue ] = useState('')
    const [ inputMemoValue, setInputMemoValue ] = useState('')

    return(
        <>
        <View style={styles.container}>
            <TouchableOpacity style={styles.wordBookBox} disabled={play} onPress={() => {setWordInputModalShown(true); setAddWordMode(false); setInputTitleValue(''); setInputMemoValue('')}}>
                <View style={{width: 50, height: 50, borderRadius: 7, backgroundColor: 'purple', justifyContent: 'center', alignItems: 'center'}}>
                    <Icon2 name="book" color="white" size={30} />
                </View>
                <Text style={{textAlign: 'left', fontSize: width*0.05}}>
                    {tr({id: 'DV_ADD_TO_WORD_BOOK'})}
                </Text>
                <Icon name="right" color="purple" size={width*0.055} style={{marginTop: 3}} />
            </TouchableOpacity>
        </View>

        <Modal 
        isVisible={wordInputModalShown} 
        useNativeDriver
        hasBackdrop
        onBackButtonPress={() => setWordInputModalShown(false)}
        onBackdropPress={() => setWordInputModalShown(false)}
        >
            <KeyboardAvoidingView style={{width: '100%', backgroundColor: 'white', padding: '5%'}} behavior="padding" enabled>
                <TouchableOpacity style={styles.modalBackButton} onPress={() => setWordInputModalShown(false)}>
                    <Icon name="left" color="purple" size={width*0.05} />
                    <Text style={{fontSize: width*0.05, color: 'purple', marginLeft: 5, marginBottom: 3}}>Back</Text>
                </TouchableOpacity>

                {
                    !addWordMode ?
                    <Text selectable style={{fontSize: width*0.055, marginBottom: width*0.04, fontWeight: 'bold'}}>
                        {script}
                    </Text>
                    :
                    <View style={{marginBottom: width*0.04}}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {splitedScript.map((v: string, index: number) => (
                                <TouchableOpacity style={styles.splitedPieceOfSentence} key={index} onPress={() => setInputTitleValue(inputTitleValue + v + ' ')}>
                                    <Text style={{fontSize: width*0.05, alignSelf: 'center', marginHorizontal: 10, fontWeight: 'bold'}}>
                                        {v}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                }
                {
                    setting.language == 'en' ? null :
                    <Text selectable style={{fontSize: width*0.045, marginBottom: width*0.04}}>{subScript}</Text>
                }

                <View style={{flexDirection: 'row', marginVertical: 7}}>
                    <TouchableOpacity style={styles.miniButton} onPress={ addWordMode ? () => setInputTitleValue(inputTitleValue + script) : () => setAddWordMode(true)}>
                        <Icon name={addWordMode ? "arrowdown" : "plus"} size={20} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity style={ addWordMode ? styles.miniButton : null} onPress={ addWordMode ? () => setAddWordMode(false) : () => null}>
                        <Icon name="close" size={20} color="white" />
                    </TouchableOpacity>
                </View>
                <Text style={styles.headerText}>
                    {tr({id: 'DV_WORD_BOOK_KEY'})}
                </Text>
                <TextInput
                    style={[styles.memoBox, {height: 70}]}
                    maxLength={100}
                    multiline = {true}
                    numberOfLines = {2}
                    onChangeText={text => setInputTitleValue(text)}
                    value={inputTitleValue}
                    // placeholder={tr({id: 'TAB_2_PLACEHOLDER'})}
                    underlineColorAndroid="transparent"
                    clearButtonMode={'while-editing'}
                    // onSubmitEditing = {() => { onSearch(null, inputValue) }}
                    // onTouchStart={() => { setInputEditing(true); getAsyncSearchHistoryData();}}
                />
                <Text style={styles.headerText}>
                    {tr({id: 'DV_WORD_BOOK_VALUE'})}
                </Text>
                <TextInput
                    style={[styles.memoBox, {height: 100}]}
                    maxLength={200}
                    multiline = {true}
                    numberOfLines = {4}
                    onChangeText={text => setInputMemoValue(text)}
                    value={inputMemoValue}
                    // placeholder={tr({id: 'TAB_2_PLACEHOLDER'})}
                    underlineColorAndroid="transparent"
                    clearButtonMode={'while-editing'}
                    // onTouchStart={() => { setInputEditing(true); getAsyncSearchHistoryData();}}
                />
                <TouchableOpacity style={styles.addButton} onPress={() => { onWordBookAdd(inputTitleValue, inputMemoValue); setWordInputModalShown(false) }}>
                    <Text style={{color: 'white', fontWeight: 'bold'}}>{tr({id: 'DV_WORD_BOOK_ADD'})}</Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </Modal>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 10,
        marginBottom: 10,
        backgroundColor: 'white',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'lightgray',
        paddingVertical : 20, 
    },
    wordBookBox: {
        flexDirection: 'row',
        justifyContent: 'space-evenly', 
        alignItems: 'center'
    },
    modalBackButton: {
        height: 30, width: '30%', 
        flexDirection: 'row', 
        alignItems: 'center', 
        marginBottom: width*0.02
    },
    splitedPieceOfSentence: {
        borderRadius: 10, backgroundColor: '#f5f5f5', 
        height: width*0.09, marginRight: 10, 
        alignItems: 'center', justifyContent: 'center'
    },
    miniButton: {
        backgroundColor: 'purple', 
        width: 110, 
        height: 30, 
        borderRadius: 20,
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    headerText: {
        fontSize: width*0.05,
        fontWeight: 'bold',
        marginBottom: 5
    },
    memoBox: {
        width: '100%',
        backgroundColor: '#f5f5f5',
        borderColor: 'lightgray',
        borderWidth: 0,
        // justifyContent: "flex-start",
        textAlignVertical: "top",
        marginBottom: 10
    },
    addButton: {
        borderRadius: 10,
        backgroundColor: 'purple',
        width: '80%',
        height: 40,
        marginTop: 10,
        marginBottom: 30,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center'
    },
})