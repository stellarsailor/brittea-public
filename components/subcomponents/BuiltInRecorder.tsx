import React, { useState, useCallback, useEffect } from 'react';
import { PermissionsAndroid, Platform, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon2 from 'react-native-vector-icons/Feather';
import Icon3 from 'react-native-vector-icons/Entypo';
import { useSelector } from 'react-redux'

import { useIntl } from 'react-intl'
import { Player, Recorder, MediaStates } from '@react-native-community/audio-toolkit';

var RNFS = require('react-native-fs');

import { Dimensions } from 'react-native';
const window = Dimensions.get('window');
const width = window.width;
const height = window.height;

// type State = {
//     playPauseButton: string,
//     recordButton: string,
  
//     stopButtonDisabled: boolean,
//     playButtonDisabled: boolean,
//     recordButtonDisabled: boolean,
  
//     loopButtonStatus: boolean,
//     progress: number,
  
//     error: string | null
// };

function BuiltInRecorder(props: any){
    const setting = useSelector((state: any) => state.setting)

    const { formatMessage: tr } = useIntl();

    const { page, playBetween, setControllerLock, play, setPlay, youtubeKey, videoInfoList } = props;
    let convertedPage;
    if(page.toString().length === 1){
        convertedPage = '0' + page;
    }
    const recordingsDirectory = RNFS.DocumentDirectoryPath + '/Recordings'
    const filename = `${youtubeKey}${convertedPage}.aac`;

    const [ player, setPlayer ] = useState<Player | null>(null);
    const [ recordingPlayingState, setRecordingPlayingState ] = useState(false)
    const [ recorder, setRecorder ] = useState<Recorder | null>(null);

    const [ hasMicPemission, setHasMicPermission ] = useState(false);

    const [ recordingExists, setRecordingExists ] = useState(false)
    const [ createdTime, setCreatedTime ] = useState('');

    // const [ playPauseButton, setPlayPauseButton] = useState('Preparing');
    const [ recordButton, setRecordButton ] = useState('preparing')

    // const [ stopButtonDisabled, setStopButtonDisabled ] = useState(true)
    // const [ playButtonDisabled, setPlayButtonDisabled ] = useState(true)
    // const [ recordButtonDisabled, setRecordButtonDisabled ] = useState(true)

    // const [ loopButtonStatus, setLoopButtonStatus ] = useState(false);
    // const [ progress, setProgress ] = useState(0);

    // const [ error , setError ] = useState(null);


    useEffect(() => {
        if (player) {
            player.destroy();
        }
        if (recorder){
            recorder.destroy();
        }

        let recordAudioRequest;
        if (Platform.OS == 'android') {
            recordAudioRequest = requestRecordAudioPermission();
        } else {
            recordAudioRequest = new Promise(function (resolve, reject) { resolve(true); });
        }

        recordAudioRequest.then((hasPermission) => {
            if (!hasPermission) {
                console.log('dont have permission')
                setHasMicPermission(false)
            } else {
                setHasMicPermission(true);
                RNFS.readDir(recordingsDirectory) 
                .then((result: any) => {
                    for(let i = 0 ; i < result.length ; i ++ ){
                        // console.log(result[i].name);
                        if(filename === result[i].name){
                            console.log(`매치하는 파일 ${filename} 발견, 플레이어를 세팅합니다`)
                            setCreatedTime(result[i].mtime.toString().substr(0,10))
                            setRecordingExists(true);
                            let p = new Player('Recordings/' + filename);
                            p.on('ended', () => {
                                //녹음 재생 끝났을때 행동 선지정
                                console.log('녹음 재생 끝')
                                setRecordingPlayingState(false)
                                setControllerLock(false)
                            })
                            setPlayer(p);
                            break;
                        } else {
                            setRecordingExists(false);
                        }
                    }
                })
                .catch((err: any) => {
                    console.log(err.message, err.code);
                    if(err.code === 'ENSCOCOAERRORDOMAIN260' || err.code === 'EUNSPECIFIED'){
                        RNFS.mkdir(recordingsDirectory);
                        console.log('Recordings directory has been made')
                    }
                });
        
                setRecorder(new Recorder('Recordings/' + filename))
            }
        })
    },[page])

    const tryRecording = useCallback( () => {
        console.log('녹음 시작')
        if(setting.instantRecord){
            setControllerLock(true);
            recorder?.record( (err) => {
                if(err){
                    console.log('녹음 중 에러 발생')
                    console.log(err)
                }
            });
            setRecordButton('recording');
            setPlay(false)
        } else {
            setRecordButton('playingBeforeRecording')
            playBetween(videoInfoList[page].timing, videoInfoList[page].duration, () => {
                setControllerLock(true);
                recorder?.record( (err) => {
                    if(err){
                        console.log('녹음 중 에러 발생')
                        console.log(err)
                    }
                });
                setRecordButton('recording');
                setPlay(false)
            })
        }
    },[recorder, setting.instantRecord, videoInfoList])

    const requestRecordAudioPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
                // {
                // title: '',
                // message: 'Needs Mic Permission',
                // buttonNeutral: 'Ask Me Later',
                // buttonNegative: 'Cancel',
                // buttonPositive: 'OK',
                // },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                return true;
            } else {
                return false;
            }
        } catch (err) {
            console.error(err);
            return false;
        }
    }

    const stopRecording = useCallback( () => {
        if (player) {
            player.destroy();
        }
        console.log('녹음 종료');
        setControllerLock(false)

        recorder?.stop((err) => {
            if(err){
                console.log('레코딩 종료시 에러 발생 -> ')
                console.log(err);
            }
        });
        setRecordButton('stop');
        setRecordingExists(true);
        let p = new Player('Recordings/' + filename);
        p.on('ended', () => {
            //녹음 재생 끝났을때 행동 선지정
            console.log('녹음 재생 끝')
            setRecordingPlayingState(false)
            setControllerLock(false)
        })
        setPlayer(p);
        setRecorder(new Recorder('Recordings/' + filename))
    },[recorder])

    const playRecording = useCallback( () => {
        if (player) {
            player.destroy();
        }
        setRecordingPlayingState(true)
        player?.play((err) => {
            if(err){
                console.log('while playing, there is error')
                console.log(err)
            }
        })
    },[player])

    const stopPlayingRecording = useCallback( () => {
        if (player) {
            player.stop((err) => {
                if(err){
                    console.log(err);
                } else {
                    setRecordingPlayingState(false)
                    setControllerLock(false);
                }
            })
        } 
    },[player])

    const playBoth = useCallback(() => {
        playBetween(videoInfoList[page].timing, videoInfoList[page].duration, () => playRecording())
    },[player, videoInfoList]) //부모에게서 상속받은 것도 의존성 주입을 해줘야되는구나
    
    return (
        <View style={styles.recordBox}>
            { recordButton === 'recording' ? 
            <Icon2 name="mic" size={width*0.06} color="red" />
            :
            <Icon2 name="headphones" size={width*0.06} color="black" style={play || recordingPlayingState ? styles.playButtonPlaying : styles.playButton} onPress={recordingPlayingState ? () => stopPlayingRecording() : () => null } />
            }

            <View style={{flexDirection: 'row'}}>
                <TouchableOpacity activeOpacity={.7} 
                disabled={play} 
                onPress={() => playBetween(videoInfoList[page].timing, videoInfoList[page].duration) }>
                    <Text style={[styles.listenSentencesText, play ? {color: 'red'} : {color: 'black'}]}>
                        {tr({id: 'DV_LISTEN_ORIGINAL_SENTENCE'})}
                    </Text>
                </TouchableOpacity>
                <Text style={{color: 'black', fontSize: width*0.05, marginHorizontal: 5}}>|</Text>
                <TouchableOpacity 
                disabled={play || !recordingExists} 
                onPress={recordingPlayingState ? () => stopPlayingRecording() : () => {setControllerLock(true); playRecording()}} >
                    <Text style={[styles.listenSentencesText, recordingExists ? 
                            recordingPlayingState || recordButton === 'recording' ? 
                            {color: 'red'} 
                            : 
                            {color: 'black'} 
                        : {color: 'lightgray'}]}>
                        {tr({id: 'DV_LISTEN_MY_SENTENCE'})}
                    </Text>
                </TouchableOpacity>
                <Text style={{color: 'black', fontSize: width*0.05, marginHorizontal: 5}}>|</Text>
                <TouchableOpacity 
                disabled={play || recordingPlayingState || !recordingExists} 
                onPress={() => playBoth()}>
                    <Text style={[styles.listenSentencesText, recordingExists ? {color: 'black'} : {color: 'lightgray'}]}>
                        {tr({id: 'DV_LISTEN_BOTH_SENTENCE'})}
                    </Text>
                </TouchableOpacity>
            </View>

            {
                recordButton === 'recording' ?
                <TouchableOpacity activeOpacity={.7} 
                disabled={play || recordingPlayingState || !hasMicPemission}
                onPress={() => stopRecording()} 
                style={play || recordingPlayingState || !hasMicPemission ? styles.recordingButtonDisabled : styles.recordingButtonWhenRecorded} >
                    <Text style={{color: 'red', fontSize: width*0.05}}>
                        Recording...
                    </Text>
                </TouchableOpacity>
                :
                <TouchableOpacity activeOpacity={.7} 
                disabled={play || recordingPlayingState || !hasMicPemission} 
                onPress={() => tryRecording()} 
                style={play || recordingPlayingState || !hasMicPemission ? styles.recordingButtonDisabled : styles.recordingButton} >
                    <Text style={{color: 'white', fontSize: width*0.05}}>
                    <Icon3 name="mic" size={20} color="white" />
                    &nbsp;{ hasMicPemission ? tr({id: 'DV_RECORD_SENTENCE'}) : "No Mic Permission"}
                    </Text>
                </TouchableOpacity>
            }
            {
                recordingExists || recordButton === 'playingBeforeRecording' ? null :
                <Text style={{fontSize: width*0.048, marginBottom: 5, color: 'gray'}}>
                    {tr({id: 'DV_NO_RECORD_HISTORY'})}
                </Text>
            }
            {
                recordButton === 'playingBeforeRecording' ? 
                <Text style={{fontSize: width*0.048, marginBottom: 5, color: 'red'}}>
                    {tr({id: "DV_RECORD_MESSAGE"})}
                </Text> : null
            }
        </View>
    )
}
const styles = StyleSheet.create({
    recordBox: {
        marginHorizontal: 10,
        marginBottom: 10,
        backgroundColor: 'white',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'lightgray',
        padding : 10, 
        flex: 1,
        alignItems: 'center'
    },
    buttonBox: {
        backgroundColor: 'white',
        borderColor: 'lightgray',
        borderTopWidth: 1,
        padding : 10, 
        paddingLeft: 30,
        paddingRight: 30,
        height: 50,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
    listenSentencesText:{
        fontSize: width*0.05
    },
    playButton: {
        color: 'dodgerblue',
    },
    playButtonDisabled: {
        color: 'gray',
    },
    playButtonPlaying: {
        color: 'red',
    },
    recordingButton: {
        marginTop: 10,
        marginBottom: 10,
        width: '80%',
        height: width*0.1,
        backgroundColor: 'dodgerblue',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    recordingButtonWhenRecorded: {
        marginTop: 10,
        marginBottom: 10,
        width: '80%',
        height: width*0.1,
        backgroundColor: 'white',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'red',
        justifyContent: 'center',
        alignItems: 'center'
    },
    recordingButtonDisabled: {
        marginTop: 10,
        marginBottom: 10,
        width: '80%',
        height: width*0.1,
        backgroundColor: 'lightgray',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default BuiltInRecorder;