import React, { useState, useCallback } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Linking, Dimensions } from 'react-native';
import { useIntl } from 'react-intl'
import Icon from 'react-native-vector-icons/AntDesign';
import ToggleSwitch from './smallercomponents/ToggleSwitch'
import Modal from 'react-native-modal'

const window = Dimensions.get('window');
const width = window.width;

import { useSelector, useDispatch } from 'react-redux'
import { handleRepeatModeAction, handleHideButtonModeAction, handleInstantRecordModeAction, handleDetailViewTutorialAction } from '../../redux/setting'

export default function DetailViewSettingModal(props: any) {
    const userInfo = useSelector((state: any) => state.userInfo)
    const setting = useSelector((state: any) => state.setting)
    const { formatMessage: tr } = useIntl();

    const { navProps, setSettingModal, videoId, videoIndex, videoScript, videoSubScript, youtubeKey } = props

    const dispatch = useDispatch();
    const onHandleRepeatMode = useCallback(() => dispatch(handleRepeatModeAction()),[dispatch])
    const onHandleHideButtonMode = useCallback(() => dispatch(handleHideButtonModeAction()),[dispatch])
    const onHandleInstantRecordMode = useCallback(() => dispatch(handleInstantRecordModeAction()), [dispatch])
    const onHandleDetailViewTutorial = useCallback(() => dispatch(handleDetailViewTutorialAction()),[dispatch])

    return(
        <View style={{ backgroundColor: 'white', position: 'absolute', flex: 1, width: '100%', bottom: 0, borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 20}}>
            <View style={{justifyContent: 'center', alignItems: 'center', marginBottom: 20}}>
                <View style={{width: 60, borderBottomColor: 'lightgray', borderBottomWidth: 7, borderRadius: 20}} />
            </View>
            <View style={styles.settingModalLiner}>
                <Text style={styles.linerText}>{tr({id: 'DV_MODAL_REPEAT_MODE'})}</Text>
                <ToggleSwitch onPress={onHandleRepeatMode} standardSwitch={setting.repeatMode} />
            </View>
            <View style={styles.settingModalLiner}>
                <Text style={styles.linerText}>{tr({id: 'DV_MODAL_HIDE_BUTTON_MODE'})}</Text>
                <ToggleSwitch onPress={onHandleHideButtonMode} standardSwitch={setting.hideButtonMode} />
            </View>
            <View style={styles.settingModalLiner}>
                <Text style={styles.linerText}>{tr({id: 'DV_MODAL_INSTANT_RECORD_MODE'})}</Text>
                <ToggleSwitch onPress={onHandleInstantRecordMode} standardSwitch={setting.instantRecord} />
            </View>
            <TouchableOpacity 
            onPress={ userInfo.isLogined ? () => {navProps.navigation.push('ScriptReport',{
                videoId: videoId,
                videoIndex: videoIndex,
                videoScript: videoScript,
                videoSubScript: videoSubScript,
            }); setSettingModal(false)} : () => alert(tr({id: 'DV_MODAL_SCRIPT_REPORT_ALERT'}))}
            style={styles.settingModalLiner}>
                <Text style={styles.linerText}>{tr({id: 'DV_MODAL_SCRIPT_REPORT'})}</Text>
                <Icon name="rightcircleo" size={width*0.04} color="gray" />
            </TouchableOpacity>
            <TouchableOpacity 
            onPress={() => {onHandleDetailViewTutorial(); setSettingModal(false)}}
            style={styles.settingModalLiner}>
                <Text style={styles.linerText}>{tr({id: 'DV_MODAL_TUTORIAL'})}</Text>
                <Icon name="rightcircleo" size={width*0.04} color="gray" />
            </TouchableOpacity>
            <TouchableOpacity 
            onPress={()=>{ Linking.openURL(`https://www.youtube.com/watch?v=${youtubeKey}`)}} 
            style={styles.settingModalLiner}>
                <Text style={styles.linerText}>{tr({id: 'DV_MODAL_ORIGIN_LINK'})}</Text>
                <Icon name="rightcircleo" size={width*0.04} color="gray" />
            </TouchableOpacity>
        </View>
    )
}


const styles = StyleSheet.create({
    settingModalLiner: {
        justifyContent: 'space-between', 
        flexDirection: 'row', 
        marginBottom: 15, 
        alignItems: 'center' 
    },
    linerText: {
        fontSize: width * 0.05,
        marginBottom: 5
    }
});