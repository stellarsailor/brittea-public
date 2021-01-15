import React, { useState, useCallback } from 'react'
import { Text, View, SafeAreaView, TextInput, TouchableOpacity, Dimensions, ScrollView } from 'react-native'
import Icon from 'react-native-vector-icons/AntDesign';
import { useSelector } from 'react-redux'
import serverUrl from '../../constants/serverLocation'

const window = Dimensions.get('window');
const width = window.width;

export default function ScriptReport(props: any){
    const userInfo = useSelector((state: any) => state.userInfo)
    const setting = useSelector((state: any) => state.setting)

    const { navigation } = props
    const videoId = navigation.getParam ('videoId', null);
    const videoIndex = navigation.getParam('videoIndex', null);
    const videoScript = navigation.getParam('videoScript', null);
    const videoSubScript = navigation.getParam('videoSubScript', null);

    const [ script, setScript ] = useState(videoScript)
    const [ subScript, setSubScript ] = useState(videoSubScript)

    const submit = useCallback( async () => {
        let url = serverUrl + '/scripts/report'
        const rawResponse = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                videoId: videoId,
                videoIndex: videoIndex,
                videoScript: script,
                videoSubScript: subScript,
                videoLang: setting.language,
                reporterId: userInfo.user.id
            })
        })
        const result = await rawResponse.json();
        console.log(result.data.affectedRows);
        props.navigation.goBack();
    },[script, subScript])

    return (
        <SafeAreaView>
            <View style={{borderBottomColor: 'lightgray', borderBottomWidth: 1 , height: 50, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', width: '100%'}}>
                <TouchableOpacity style={{position: 'absolute', left: 20}} onPress={() => props.navigation.goBack() }>
                    <Icon name="left" size={22} color="gray" />
                </TouchableOpacity>
                <Text style={{ fontSize: 20, alignSelf: 'center', color: 'black'}}>Script Correction Report</Text> 
            </View>
            <View style={{padding: '5%'}}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Icon name="mail" style={{fontSize: width*0.045}} />
                    <Text style={{fontSize: width*0.045, marginLeft: width*0.03}}>
                        {userInfo.user.email}
                    </Text>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Icon name="user" style={{fontSize: width*0.045}} />
                    <Text style={{fontSize: width*0.045, marginLeft: width*0.03}}>
                        {userInfo.user.name}
                    </Text>
                </View>
                <Text style={{marginTop: 10, fontSize: width*0.045}}>
                    Script
                </Text>
                <TextInput
                    style={{height: 70, backgroundColor: '#f5f5f5'}}
                    maxLength={200}
                    multiline = {true}
                    numberOfLines = {2}
                    onChangeText={text => setScript(text)}
                    value={script}
                    // placeholder={tr({id: 'TAB_2_PLACEHOLDER'})}
                    underlineColorAndroid="transparent"
                    clearButtonMode={'while-editing'}
                    // onSubmitEditing = {() => { onSearch(null, inputValue) }}
                    // onTouchStart={() => { setInputEditing(true); getAsyncSearchHistoryData();}}
                />
                {
                    setting.language == 'en' ?
                    null
                    :
                    <>
                        <Text style={{marginTop: 10, fontSize: width*0.045}}>
                            subScript
                        </Text>
                        <TextInput
                            style={{height: 70, backgroundColor: '#f5f5f5'}}
                            maxLength={200}
                            multiline = {true}
                            numberOfLines = {2}
                            onChangeText={text => setSubScript(text)}
                            value={subScript}
                            // placeholder={tr({id: 'TAB_2_PLACEHOLDER'})}
                            underlineColorAndroid="transparent"
                            clearButtonMode={'while-editing'}
                            // onSubmitEditing = {() => { onSearch(null, inputValue) }}
                            // onTouchStart={() => { setInputEditing(true); getAsyncSearchHistoryData();}}
                        />
                    </>
                }
                <View style={{alignItems: 'center'}}>
                    <TouchableOpacity
                    style={{
                        marginTop: 10,
                        marginBottom: 10,
                        width: '80%',
                        height: width*0.1,
                        backgroundColor: 'dodgerblue',
                        borderRadius: 10,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                    onPress={() => submit()}>
                        <Text style={{color: 'white', fontWeight: 'bold', fontSize: width*0.045}}>Submit</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}
