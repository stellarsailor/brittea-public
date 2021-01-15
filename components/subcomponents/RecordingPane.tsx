import React, { useCallback, useState, useEffect } from 'react'
import { View, Text, Dimensions, Alert, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView } from 'react-native'
import FastImage from 'react-native-fast-image'
import { useIntl } from 'react-intl'
import { Player, Recorder, MediaStates } from '@react-native-community/audio-toolkit';
import Modal from 'react-native-modal'
import Icon from 'react-native-vector-icons/AntDesign';
import Icon2 from 'react-native-vector-icons/Entypo';
import serverUrl from '../../constants/serverLocation';
import AdBanner from './AdBanner';

var RNFS = require('react-native-fs');
const window = Dimensions.get('window');
const width = window.width;
const height = window.height;

export default function RecordingPane(props: any) {
    const { formatMessage: tr } = useIntl();

    const [ player, setPlayer ] = useState<Player | null>(null);
    const [ recordingArr, setRecordingArr ] = useState([]);
    const [ spread, setSpread ] = useState(false);
    const [ isPlaying, setIsPlaying ] = useState(false);

    const [ detailModalShown, setDetailModalShown ] = useState(false)
    const [ videoId, setVideoId ] = useState(0)
    const [ youtubeKey, setYoutubeKey ] = useState('')
    const [ title, setTitle ] = useState('')
    const [ speaker, setSpeaker ] = useState('')
    const [ scripts, setScripts ] = useState([])

    const handleSpread = useCallback(() => {
        setSpread(!spread)
    },[spread])

    const { navProps, videoKey, sequence, handleRefresh, blockingOthers, setBlockingOthers } = props;

    const playRecording = useCallback( (filename) => {
        if (player) {
            player.stop();
            player.destroy();
        }
        
        let p = new Player('Recordings/' + filename + '.aac');
        setPlayer(p);

        p.play((err) => {
            if(err){
                console.log('while playing, there is error')
                console.log(err)
            }
        })
    },[player])

    const playAllRecordings = useCallback( () => {
        setIsPlaying(true)
        setBlockingOthers(true);

        if (player) {
            player.stop();
            player.destroy();
        }

        let arr: any = [];
        for(let i = 0; i < sequence.length; i++ ){
            // console.log(sequence[i])
            let p = new Player('Recordings/' + videoKey + sequence[i] + '.aac');
            arr.push(p);
        }
        setRecordingArr(arr);
        for(let i = 0; i < arr.length - 1; i++ ){
            arr[i].on('ended', () => arr[i+1].play() );
        }
        arr[arr.length - 1].on('ended', () => { 
            setIsPlaying(false);  
            setBlockingOthers(false);
        })

        arr[0].play((err: any) => {
            if(err){
                console.log('while playing, there is error')
                console.log(err)
            }
        })
    },[sequence]) //sequence 의존성 안써줘서 갱신이 안됐었음

    const stopPlayingRecordings = useCallback(() => {
        recordingArr.map((v: any) => {
            if(v) {
                v.stop();
                v.destroy();
            }
        })
        setIsPlaying(false);
        setBlockingOthers(false);
    },[recordingArr])

    const fetchInfoModal = useCallback( () => {
        let url = serverUrl + `/scripts/getInfoBy/${videoKey}`
        fetch(url)
        .then((res) => res.json())
        .then((res) => {
            setVideoId(res.data[0].id)
            setTitle(res.data[0].title)
            setSpeaker(res.data[0].speaker)
            setYoutubeKey(videoKey)
            setScripts(res.data.map((v) => v.script))
            setDetailModalShown(true)
        })
        .catch((err) => console.log(err));
    },[])

    const handleDeleteAlert = useCallback( (filename) => {
        Alert.alert(
        '',
        tr({id: 'TAB_1_RECORDING_DELETE'}),
        [
            {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                //style: 'cancel',
            },
            {
                text: 'Delete', 
                onPress: () => deleteOneRecording(filename),
                style: 'destructive',
            },
        ],
        {cancelable: false},
    );
    },[])

    const deleteOneRecording = useCallback( (filename) => {
        var path = RNFS.DocumentDirectoryPath + `/Recordings/${filename}.aac`;

        RNFS.unlink(path)
        .then(() => handleRefresh())
        .catch((err: any) => {
            console.log(err.message);
        });
    },[])

    const renderSentenceLines = (v) => (
        <View key={v} style={styles.oneSentenceLiner}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <TouchableOpacity onPress={() => playRecording(videoKey + v)}>
                    <Text>
                        {tr({id: 'TAB_1_WORD_SENTENCE'})} {parseInt(v) + 1}. 
                    </Text>
                </TouchableOpacity>
                <Icon name="close" size={15} color="lightgray" onPress={() => handleDeleteAlert(videoKey + v)} />
            </View>
        </View>
    )

    return(
        <View style={{flexDirection: 'row', marginBottom: 10}}>
            <View style={{flexDirection: 'column'}}>
                <View>
                    <FastImage 
                    source={{uri: `https://img.youtube.com/vi/${videoKey}/hqdefault.jpg`}} 
                    style={styles.touchableRectangleNotAbsolute} 
                    />
                    <View style={[styles.touchableRectangle, {backgroundColor: 'black', opacity: 0.25}]} />
                    <TouchableOpacity disabled={ blockingOthers && !isPlaying } activeOpacity={.7} onPress={ isPlaying ? stopPlayingRecordings : playAllRecordings} style={[styles.touchableRectangle, { justifyContent: 'space-evenly', alignItems: 'center'}]}>
                        <Icon2 name={ isPlaying ? "controller-stop" : "controller-play"} size={40} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity disabled={ blockingOthers || isPlaying } activeOpacity={.8} style={styles.blackCircleBackground} onPress={() => fetchInfoModal()}>
                        <View style={styles.blackCircle} />
                        <Icon name="search1" size={18} color="white" />
                    </TouchableOpacity>
                </View>
            </View>
            
            <View style={{flexDirection: 'column', marginLeft: 20}}>
                {
                    spread ?
                    sequence.map((v: string) => renderSentenceLines(v))
                    :
                    sequence.slice(0, 2).map((v: string) => renderSentenceLines(v))
                }
                {
                    sequence.length > 2 ?
                    <TouchableOpacity style={{justifyContent: 'center', alignItems: 'center', marginTop: 5}} onPress={handleSpread}>
                        <Icon name={spread ? "left" : "ellipsis1"} size={20} color={spread ? "lightgray" : "gray" } style={{transform: [{ rotate: '90deg'}]}} />
                    </TouchableOpacity>
                    :
                    null
                }
            </View>
            <Modal
            isVisible={detailModalShown}
            backdropColor="black"
            backdropOpacity={0.0}
            onBackButtonPress={() => { stopPlayingRecordings(); setDetailModalShown(false) }}
            style={{margin: 0}}
            >
                <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
                    <View style={{flex: 1}}>
                        <FastImage 
                        source={{uri: `https://img.youtube.com/vi/${videoKey}/hqdefault.jpg`}} 
                        style={{width: width, height: width*1/2 }} 
                        />
                        <View style={[styles.modalThumbnailSize,{backgroundColor: 'black', opacity: 0.5}]} />
                        <TouchableOpacity 
                        activeOpacity={.7} 
                        disabled={ blockingOthers && !isPlaying } 
                        onPress={ isPlaying ? stopPlayingRecordings : playAllRecordings} 
                        style={[styles.modalThumbnailSize, { justifyContent: 'space-evenly', alignItems: 'center'}]}>
                            <Icon2 name={ isPlaying ? "controller-stop" : "controller-play"} size={width*0.15} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity 
                        style={styles.modalCloseButton} 
                        onPress={() => {stopPlayingRecordings(); setDetailModalShown(false) }}>
                            <Icon name="close" size={width*0.06} style={{color: 'white'}} />
                        </TouchableOpacity>
                        <ScrollView>
                            <View style={{padding: '5%'}}>
                                <TouchableOpacity style={{flexDirection: 'row'}} onPress={() => { 
                                    setDetailModalShown(false);
                                    navProps.navigation.push('Detail' , {
                                        id : videoId,
                                        title : title,
                                        youtubeKey : youtubeKey,
                                    })}}>
                                    <View style={{width: '90%'}}>
                                        <Text style={styles.modalTitleText}>{title}</Text>
                                        <Text style={styles.modalSpeakerText}>{speaker}</Text>
                                    </View>
                                    <View style={{justifyContent: 'center'}}>
                                        <Icon size={width * 0.055} name="arrowright" />
                                    </View>
                                </TouchableOpacity>
                                <View style={styles.modalDivideLine} />
                                {scripts.map((v, index) => (<Text key={index} style={styles.modalScript}>{v}</Text>))}
                            </View>
                        </ScrollView>
                        <AdBanner />
                    </View>
                </SafeAreaView>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    touchableRectangle: {
        position: 'absolute', 
        width: width * 0.43, 
        height: width * 0.22, 
        borderRadius: 7 ,
    },
    touchableRectangleNotAbsolute: {
        width: width * 0.43, 
        height: width * 0.22, 
        borderRadius: 7
    },
    blackCircleBackground: {
        position: 'absolute',
        width: width*0.1, height: width*0.1, right: 5, bottom: 5, 
        justifyContent: 'center', alignItems: 'center'
    },
    blackCircle: {
        position: 'absolute',
        width: '90%',
        height: '90%',
        backgroundColor: 'black', 
        borderRadius: 35, 
    },
    oneSentenceLiner: {
        width: width * 0.4, 
        height: 27, 
        borderBottomColor: 'lightgray', 
        borderBottomWidth: 1, 
        justifyContent: 'center'
    },
    modalThumbnailSize: {
        position: 'absolute', 
        width: width, 
        height: width*1/2
    },
    modalCloseButton: {
        position: 'absolute', 
        width: width*0.1, height: width*0.1, 
        right: 10, top: 10, 
        justifyContent: 'center', 
        alignItems: 'center'
    },
    modalTitleText: {
        fontWeight: 'bold', 
        fontSize: width * 0.047
    },
    modalSpeakerText: {
        fontSize: width * 0.04, 
        fontStyle: 'italic', 
        color: 'gray', 
        marginBottom: 10
    },
    modalDivideLine: {
        borderBottomColor: 'lightgray', 
        borderBottomWidth: 1, 
        marginBottom: 10
    },
    modalScript: {
        marginBottom: 10, 
        fontSize: width * 0.04
    }
})