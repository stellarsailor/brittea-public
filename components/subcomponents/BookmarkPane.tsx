import React, { useCallback } from 'react'
import { View, Text, TouchableOpacity} from 'react-native'
import FastImage from 'react-native-fast-image'
import Icon from 'react-native-vector-icons/AntDesign';

import { Dimensions } from 'react-native';
const window = Dimensions.get('window');
const width = window.width;


function BookmarkPane(props: any) {

    const { id, videoKey, title, speaker, createdAt, navProps } = props;

    const videoThumbnail = 'https://img.youtube.com/vi/' + videoKey + '/default.jpg';

    const moveToVideo = useCallback( () => {
        navProps.navigation.push ('Detail' , {
            id : id,
            title: title,
            youtubeKey : videoKey,
        })
    },[])

    return(
        <View style={{ flexDirection: 'row', marginBottom: 10}}>
            <TouchableOpacity onPress={moveToVideo} activeOpacity={0.8} >
                <FastImage source={{uri : videoThumbnail}} style={{width: width*1/3, height: width*3/16}} />
            </TouchableOpacity>
            <TouchableOpacity style={{width: width * 0.55, marginLeft: 10}} activeOpacity={0.8} onPress={moveToVideo} >
                <Text style={{fontSize: width*0.04}}>{title}</Text>
                <Text style={{fontSize: width*0.035, fontStyle: 'italic', color: 'gray'}}>{speaker}</Text>
                <Text style={{fontSize: width*0.025, color: 'lightgray'}}>{createdAt.substring(0,10)}</Text>
            </TouchableOpacity>
        </View>
    )
}

export default BookmarkPane;