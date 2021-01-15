import React, { useState, useCallback } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native'
import { useIntl } from 'react-intl'
import FastImage from 'react-native-fast-image'
import Icon from 'react-native-vector-icons/AntDesign';
import Modal from 'react-native-modal';

import { setRoleModelAction } from '../../redux/setting';
import { useDispatch, useSelector } from 'react-redux'

const window = Dimensions.get('window');
const width = window.width;
const height = window.height;

type resultType = {
    id: number;
    title: string;
    youtubeKey: string;
    speaker: string;
    keywords: string | Array<string>;
}

function YoutubePane(props: resultType | any) {
    const setting = useSelector((state: any) => state.setting)

    const dispatch = useDispatch();
    const onSetRoleModel = useCallback((payload) => dispatch(setRoleModelAction(payload)),[dispatch])

    const { navProps, id, title, youtubeKey, speaker } = props;
    const splitedSpeakers =  speaker.split(', ')

    const { formatMessage: tr } = useIntl();
    const [ modalShown, setModalShown ] = useState(false);

    return (
        <View style={{minHeight: 200}}>
            <TouchableOpacity 
            activeOpacity={1} 
            onPress={() => navProps.navigation.push('Detail' , {
                id : id,
                title : title,
                youtubeKey : youtubeKey,
            })} 
            style={{backgroundColor: 'white'}}
            >
                <FastImage 
                source={{uri: `https://img.youtube.com/vi/${youtubeKey}/hqdefault.jpg`,priority: FastImage.priority.high}} 
                style={{width : '100%', height : 200 }} 
                key ={id}/>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <View style={{flexDirection: 'column', width: '85%'}}>
                        <Text style={styles.videoTitle}>{title}</Text>
                        <Text style={styles.videoSpeaker}>{speaker}</Text>
                    </View>
                    <TouchableOpacity style={{marginTop: 15, marginLeft: 5, marginRight: 15, height: 30}} onPress={() => setModalShown(true)} >
                        <Icon name="star" size={22} style={setting.roleModel == speaker ? {color: 'gold'} : {color: 'lightgray'} } />
                    </TouchableOpacity>
                    <Modal 
                    isVisible={modalShown}
                    onBackButtonPress={() => setModalShown(false)}
                    onBackdropPress={() => setModalShown(false)}
                    useNativeDriver
                    >
                        <View style={{ backgroundColor: 'white', flexDirection: 'column', width: '95%', alignSelf: 'center', padding: 10, justifyContent: 'center'}}>
                            {
                                splitedSpeakers.map((v: string) => (
                                <TouchableOpacity key={v} style={{margin: 10}} 
                                onPress={() => { onSetRoleModel(v); setModalShown(false) }}>
                                    <Text style={{fontSize: width*0.043}}>
                                        {tr({id: 'TAB_2_SET'})} 
                                        <Text style={{fontWeight: 'bold'}}> {v} </Text> 
                                        {tr({id: 'TAB_2_AS_A_ROLE_MODEL'})}
                                    </Text>
                                </TouchableOpacity>
                                ))
                            }
                            <TouchableOpacity style={{margin: 10}} onPress={() => setModalShown(false)}>
                            <Text style={{fontSize: width*0.043}}>{tr({id: 'CANCEL'})}</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>
                </View>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    videoTitle: {
        width : '100%',
        fontWeight: 'bold',
        fontSize: width*0.05,
        marginTop: 10,
        marginLeft : 10,
        marginBottom: 5,
    },
    videoSpeaker: {
        color: 'gray',
        fontSize: width*0.035,
        fontStyle: 'italic',
        marginLeft: 10,
        marginBottom: 15
    },
})

export default YoutubePane;