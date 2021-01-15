import React, { useState, useCallback } from 'react';
import { View, Text, Dimensions, TouchableOpacity } from 'react-native'
import { useIntl } from 'react-intl'
import Icon from 'react-native-vector-icons/AntDesign';

import { useDispatch } from 'react-redux'
import { handleDetailViewTutorialAction } from '../../../redux/setting'

const window = Dimensions.get('window');
const width = window.width;
const height = window.height;

export default function DetailViewTutorial (props: any) {
    const dispatch = useDispatch();
    const onHandleDetailViewTutorial = useCallback(() => dispatch(handleDetailViewTutorialAction()),[dispatch])

    const { formatMessage: tr } = useIntl();

    const { scrollRef, setPlay } = props;

    const [ focusedPage, setFocusedPage ] = useState(0)

    const handleFocusedPage = useCallback(() => {
        if(focusedPage == 2){
            scrollRef.current.scrollTo({x: 0, y: height*0.35, animated: true})
        } else if(focusedPage == 4){
            console.log('tutorial finish')
            setPlay(true)
            onHandleDetailViewTutorial()
            scrollRef.current.scrollTo({x: 0, y: 0, animated: true})
        }
        setFocusedPage(focusedPage + 1)
    },[focusedPage])

    const information = () => {
        if(focusedPage == 0) return tr({id: "DV_TUTORIAL_SCRIPT_1"})
        else if(focusedPage == 1) return tr({id: "DV_TUTORIAL_SCRIPT_2"})
        else if(focusedPage == 2) return tr({id: "DV_TUTORIAL_SCRIPT_3"})
        else if(focusedPage == 3) return tr({id: "DV_TUTORIAL_SCRIPT_4"})
        else if(focusedPage == 4) return tr({id: "DV_TUTORIAL_SCRIPT_5"})
        else return null
    }

    return (
        <TouchableOpacity activeOpacity={.9} style={{position: 'absolute', width: '100%', height: '100%', zIndex: 10, opacity: 1}} onPress={handleFocusedPage}>
            <View style={[{padding: 10}, 0 <= focusedPage && focusedPage <= 2 ? { height: height*0.35 + 20 } : {backgroundColor: 'black', opacity: 0.8, height: height*0.35 + 10} ]}>
                <View style={{flexDirection: 'row', width: '100%', height: '100%'}}>
                    <View style={[{backgroundColor: 'red', width: '25%', height: '100%', borderTopLeftRadius: 10, borderBottomLeftRadius: 10}, focusedPage == 0 ? {opacity: 0.1} : {opacity: 0} ]} />
                    <View style={[{backgroundColor: 'red', width: '50%', height: '100%'}, focusedPage == 1 ? {opacity: 0.1} : {opacity: 0} ]} />
                    <View style={[{backgroundColor: 'red', width: '25%', height: '100%', borderTopRightRadius: 10, borderBottomRightRadius: 10}, focusedPage == 0 ? {opacity: 0.1} : {opacity: 0} ]} />
                </View>
                <View style={[{position: 'absolute', bottom: '5%', margin: 10, backgroundColor: 'red', width: '100%', height: '20%'}, focusedPage == 2 ? {opacity: 0.1} : {opacity: 0} ]} />
            </View>

            <View style={[0 <= focusedPage && focusedPage <= 2 ? {backgroundColor: 'black', opacity: .8, height: '100%'} : {}]}>
                <View style={3 <= focusedPage ? {backgroundColor: 'black', width: '100%', height: '100%', marginTop: height*0.21, opacity: 0.8} : null } />
            </View>

            {focusedPage <= 2 ?
                <View style={{position: 'absolute', width: '100%', top: height * 0.35 + 20, padding: 10, alignItems: 'center'}}>
                    <Icon name="smileo" style={{color: 'white', fontSize: width*0.05}} />
                    <Text style={{ color: 'white', fontSize: width*0.05, textAlign: 'center'}}>
                        {information()}
                    </Text>
                </View>
            :
                <View style={{position: 'absolute', width: '100%', top: height*0.58, padding: 10, alignItems: 'center'}}>
                    <Icon name="smileo" style={{color: 'white', fontSize: width*0.05}} />
                    <Text style={{ color: 'white', fontSize: width*0.05, textAlign: 'center'}}>
                        {information()}
                    </Text>
                </View>
            }

        </TouchableOpacity>
    )
}