import React, { useEffect, useState } from 'react';
import { Text, View, Dimensions } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { sliderWidth, itemWidth } from '../../styles/SliderEntry.style';
//import styles, { colors } from '../styles/index.style';
import SliderEntry from './SliderEntry';
import serverUrl from '../../constants/serverLocation';
import shuffleArray from '../logics/shuffleArray'

const window = Dimensions.get('window');
const width = window.width;

type youtubeType = {
    id: number;
    speaker: string;
    title: string;
    video_id: number;
    youtubeKey: string;
}

type propsType = {
    navProps: any;
    keyProps: number;
    phrase: string;
    adIndex: number;
}

export default function Tab1GroupRender(props: propsType){

    const { navProps, keyProps, phrase, adIndex } = props

    const [ youtubeList, setYoutubeList ] = useState<youtubeType []>([]);

    useEffect(() => {
        fetch(serverUrl + `/group/select/detail/${props.keyProps}`)
        .then((res) => res.json())
        .then((res) => setYoutubeList(shuffleArray(res.data)))
        .catch((err) => console.log(err));
    },[])

    const renderItem = ({ item, index }: any) => {
        return <SliderEntry navProps={navProps} data={item} even={(index + 1) % 2 === 0} />;
    }

    var ENTRIES = youtubeList.map( obj => {
        let thumbnail = 'https://img.youtube.com/vi/' + obj.youtubeKey + '/hqdefault.jpg';
        return { ... obj , illustration: thumbnail }
    });

    return (
        <View key={keyProps} style={{minHeight: 200}}>
            <Text style={{ paddingLeft: 30, paddingTop: 15, paddingBottom: 10,  fontSize: width * 0.053,  fontWeight: 'bold'}}>
                {phrase}
            </Text>
            <Carousel
            data={ENTRIES}
            renderItem={renderItem}
            sliderWidth={sliderWidth}
            itemWidth={itemWidth}
            />
            {/* { adIndex % 4 === 0 ? <AdBanner /> : <></>} */}
        </View>
    )
}
