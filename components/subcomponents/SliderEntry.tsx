import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image'
import PropTypes from 'prop-types';
import { ParallaxImage } from 'react-native-snap-carousel';
import styles from '../../styles/SliderEntry.style';

export default function SliderEntry(props: any){
    const [ loaded, setLoaded ] = useState(false)
    const { navProps, data: { illustration, video_id, title, speaker, youtubeKey }, even } = props;

    const uppercaseTitle = title ? (
        <Text
            style={[styles.title, even ? styles.titleEven : {}]}
            numberOfLines={2}
        >
            { title.toUpperCase() }
        </Text>
    ) : false;

    return (
        <TouchableOpacity
            activeOpacity={1}
            style={styles.slideInnerContainer}
            onPress={() => navProps.navigation.push('Detail' , {
            id : video_id,
            title : title,
            youtubeKey : youtubeKey,
            })} 
            >
            <View style={styles.shadow} />
            <View style={[styles.imageContainer, even ? styles.imageContainerEven : {}]}>
            <FastImage
              source={{ uri: illustration }}
              style={styles.image}
              onLoadEnd={() => setLoaded(true)}
            />
            {/* { loaded ? null : <View style={{backgroundColor: 'lightgray', width: '100%', height: '100%'}}/>} */}
            <View style={[styles.radiusMask, even ? styles.radiusMaskEven : {}]} />
            </View>
            <View style={[styles.textContainer, even ? styles.textContainerEven : {}]}>
                { uppercaseTitle }
                <Text
                    style={[styles.subtitle, even ? styles.subtitleEven : {}]}
                    numberOfLines={2}
                >
                    { speaker }
                </Text>
            </View>
        </TouchableOpacity>
    );
}