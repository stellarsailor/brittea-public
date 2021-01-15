import React, { useEffect, useState, useCallback, } from 'react';
import { View, Text, StyleSheet , ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import FastImage from 'react-native-fast-image'
import { useSelector } from 'react-redux'
import { useIntl } from 'react-intl'
import Icon from 'react-native-vector-icons/Feather';

import BookmarkPane from './BookmarkPane'
import serverUrl from '../../constants/serverLocation';

function BookmarksList(props: any) {
    const userInfo = useSelector((state: any) => state.userInfo)

    const { formatMessage: tr } = useIntl();

    const [ orderBy, setOrderBy ] = useState('newest')

    const dynamicSort = (property: string) => {
        let sortOrder = 1;
    
        if(property[0] === "-") {
            sortOrder = -1;
            property = property.substr(1);
        }
    
        return function (a, b) {
            if(sortOrder == -1){
                return b[property].localeCompare(a[property]);
            }else{
                return a[property].localeCompare(b[property]);
            }        
        }
    }

    const orderedResult = () =>  {
        if(orderBy == 'newest') { 
            return (
            userInfo.bookmarks.map((v) => (
                <BookmarkPane key={v.videoId} id={v.videoId} videoKey={v.youtubeKey} title={v.title} speaker={v.speaker} createdAt={v.createdAt} navProps={props.navProps}/>
            )) 
            )
        } else if (orderBy == 'oldest'){
            return (
                userInfo.bookmarks.slice(0).reverse().map((v) => (
                    <BookmarkPane key={v.videoId} id={v.videoId} videoKey={v.youtubeKey} title={v.title} speaker={v.speaker} createdAt={v.createdAt} navProps={props.navProps}/>
                )) 
            )
        } else if (orderBy == 'title'){
            return (
                userInfo.bookmarks.slice(0).sort(dynamicSort("title")).map((v) => (
                    <BookmarkPane key={v.videoId} id={v.videoId} videoKey={v.youtubeKey} title={v.title} speaker={v.speaker} createdAt={v.createdAt} navProps={props.navProps}/>
                ))
            )
        } else if (orderBy == '-title'){
            return (
                userInfo.bookmarks.slice(0).sort(dynamicSort("-title")).map((v) => (
                    <BookmarkPane key={v.videoId} id={v.videoId} videoKey={v.youtubeKey} title={v.title} speaker={v.speaker} createdAt={v.createdAt} navProps={props.navProps}/>
                ))
            )
        } else if (orderBy == 'speaker'){
            return (
                userInfo.bookmarks.slice(0).sort(dynamicSort("speaker")).map((v) => (
                    <BookmarkPane key={v.videoId} id={v.videoId} videoKey={v.youtubeKey} title={v.title} speaker={v.speaker} createdAt={v.createdAt} navProps={props.navProps}/>
                ))
            )
        } else if (orderBy == '-speaker'){
            return (
                userInfo.bookmarks.slice(0).sort(dynamicSort("-speaker")).map((v) => (
                    <BookmarkPane key={v.videoId} id={v.videoId} videoKey={v.youtubeKey} title={v.title} speaker={v.speaker} createdAt={v.createdAt} navProps={props.navProps}/>
                ))
            )
        }
    }

    return(
        <View 
        style={{flex: 1}} 
        >
            {userInfo.isLogined ?
                userInfo.bookmarks.length === 0 ?
                    <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
                        <FastImage source={require('../../images/empty.png')} style={{width: 80, height: 90}} />
                    </View>
                :
                    <ScrollView showsVerticalScrollIndicator
                    contentContainerStyle={{paddingHorizontal: '5%'}}>
                        <View style={{flexDirection: 'row', marginBottom: 10}}>
                            <Text style={[{marginLeft: 10}, orderBy == 'newest' ? {color: 'black'} : {color: 'lightgray'}]} onPress={() => setOrderBy('newest')}>
                                {tr({id: 'TAB_1_ORDER_BY_NEWEST'})}
                            </Text>
                            <Text style={[{marginLeft: 15}, orderBy == 'oldest' ? {color: 'black'} : {color: 'lightgray'}]} onPress={() => setOrderBy('oldest')}>
                                {tr({id: 'TAB_1_ORDER_BY_OLDEST'})}
                            </Text>
                            <Text style={[{marginLeft: 15}, orderBy == 'title' || orderBy == '-title' ? {color: 'black'} : {color: 'lightgray'}]} onPress={orderBy == 'title' ? () => setOrderBy('-title') : () => setOrderBy('title')}>
                                {tr({id: 'TAB_1_ORDER_BY_TITLE'})}
                            </Text>
                            <Text style={[{marginLeft: 15}, orderBy == 'speaker' || orderBy == '-speaker' ? {color: 'black'} : {color: 'lightgray'}]} onPress={orderBy == 'speaker' ? () => setOrderBy('-speaker') : () => setOrderBy('speaker')}>
                                {tr({id: 'TAB_1_ORDER_BY_SPEAKER'})}
                            </Text>
                        </View>
                        {orderedResult()}
                    </ScrollView>
            :
                <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
                    <Icon name="alert-octagon" size={30} color="lightgray" />
                    <Text style={{margin: 5, color: 'gray'}}>
                        {tr({id: 'TAB_1_LOGIN_ASK'})}
                    </Text>
                </View>
            }
        </View>

    )
}

export default BookmarksList;