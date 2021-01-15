import React, { useEffect, useState, useCallback } from 'react';
import { SafeAreaView, View, Text, StyleSheet, Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import { MaterialIndicator } from 'react-native-indicators';
import serverUrl from '../constants/serverLocation';
import YoutubePane from './subcomponents/YoutubePane';
import InfiniteFlatList from './subcomponents/InfiniteFlatList';
import AdBanner from './subcomponents/AdBanner';

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

function Tab2Sub ( props: any ){

    const keywords = props.navigation.getParam ('keywords', null)
    const search = props.navigation.getParam ('search', null)
    const searchWithoutSpace = props.navigation.getParam ('searchWithoutSpace', null) // if with space, it divides and search two keywords.
    
    let fetchUrl = serverUrl + `/search`

    if(search){
        fetchUrl += '/input?is='
        search.split(' ').map((v: string) => fetchUrl += `,${v}`);
    } else if(searchWithoutSpace){
        fetchUrl += `/input?is=,${searchWithoutSpace}`
    } else if(keywords){
        fetchUrl += '?keyword='
        keywords.map((v: string) => fetchUrl += ',' + v)
    }
    const renderItem = (item: any, index: number) => {
        return(
            <>
            <YoutubePane navProps={props} id={item.id} title={item.title} youtubeKey={item.youtubeKey} speaker={item.speaker} />
            {/* {index % 4 === 0 ? <AdBanner key={index} /> : null} */}
            </>
        )
    }

    return (
        <SafeAreaView style={{flex: 1}}>
            <View style={styles.topBar} >
                <Icon name="left" size={24} color="black" style={{marginLeft: 10, marginRight: 15}} onPress={() => props.navigation.goBack()} />
                {keywords ? 
                    keywords.map((v, index) => (<Text key={index} style={{color: 'gray', fontSize: 16, marginBottom: 3}}>#{v} </Text>)) 
                    : 
                    (<Text style={{color: 'gray', fontSize: 16, marginBottom: 3}}>{search}{searchWithoutSpace}</Text>)
                }
            </View>
            <View style={{flex: 1}}>
                <InfiniteFlatList
                fetchUrl={fetchUrl}
                renderItem={renderItem}
                />
            </View>
            <AdBanner />
        </SafeAreaView>
    )
}

Tab2Sub.navigationOptions = ( { } ) => ({
    headerShown: false,
});

const styles = StyleSheet.create({
    topBar: {
        backgroundColor: 'white', 
        borderColor: 'lightgray',
        borderBottomWidth: 1, 
        flexDirection: 'row', 
        alignItems: 'center', 
        padding: 5, 
        height: 55
    }
});

export default Tab2Sub;