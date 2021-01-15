import React, { useState, useEffect, useCallback, useRef } from 'react'
import useInterval from './logics/useInterval'
import { Platform, SafeAreaView, View, Text, ScrollView, StyleSheet, TouchableOpacity, Linking } from 'react-native'
import { useIntl } from 'react-intl'
import Icon from 'react-native-vector-icons/AntDesign';
import Icon2 from 'react-native-vector-icons/Entypo';
import Icon3 from 'react-native-vector-icons/FontAwesome';
import Icon4 from 'react-native-vector-icons/EvilIcons';
import YouTube from 'react-native-youtube';
import Modal from 'react-native-modal'
import BuiltInRecorder from './subcomponents/BuiltInRecorder'
import BuiltInWordBook from './subcomponents/BuiltInWordBook';
import DetailViewTutorial from './subcomponents/smallercomponents/DetailViewTutorial';

import { useSelector, useDispatch } from 'react-redux'
import { handleRepeatModeAction } from '../redux/setting'
import { bookmarkAddAction, bookmarkDeleteAction } from '../redux/userInfo'

import serverUrl from '../constants/serverLocation'

import { Dimensions } from 'react-native';
import DetailViewSettingModal from './subcomponents/DetailViewSettingModal';
import DetailViewBottomTab from './subcomponents/DetailViewBottomTab';
const window = Dimensions.get('window');
const width = window.width;
const height = window.height;

type infoL = {
    index: number;
    script: string;
    subScript: string;
    timing: number;
    duration: number;
}

function DetailView (props: any) {
    const userInfo = useSelector((state: any) => state.userInfo)
    const setting = useSelector((state: any) => state.setting)

    const dispatch = useDispatch();
    const onHandleRepeatMode = useCallback(() => dispatch(handleRepeatModeAction()),[dispatch])

    const onHandleBookmarkAdd = useCallback((videoInfo: {
        videoId: number,
        youtubeKey: string,
        title: string,
        createdAt: string
    }) => dispatch(bookmarkAddAction(videoInfo)),[dispatch])
    const onHandleBookmarkDelete = useCallback((videoId) => dispatch(bookmarkDeleteAction(videoId)),[dispatch])

    const { formatMessage: tr } = useIntl();

    const playerRef: any = useRef(null)
    const scrollRef: any = useRef(null)

    const [ videoInfoList, setVideoInfoList ] = useState<infoL[]>([{
        index: 0,
        script: '',
        subScript: '',
        timing: 0,
        duration: 0,
    }])

    const [ page, setPage ] = useState(0)
    const [ play, setPlay ] = useState(true)
    const [ stateIndicator, setStateIndicator ] = useState('all')
    const [ controllerLock, setControllerLock ] = useState(true);

    const [ playerIsReady, setPlayerIsReady ] = useState(false)
    const [ currentTime, setCurrentTime ] = useState(0)
    const [ language, setLanguage ] = useState(1)

    const [ settingModal, setSettingModal ] = useState(false)

    const [ bookmarked, setBookmarked ] = useState(false)
    const [ bookmarkLock, setBookmarkLock ] = useState(false);
    const [ description, setDescription ] = useState(false)

    const { navigation } = props
    const id = navigation.getParam ('id', 'noid');
    const title = navigation.getParam('title', 'notitle');
    const youtubeKey = navigation.getParam('youtubeKey', 'nokey');

    const lang = setting.language;

    useEffect(() => {
        let url = serverUrl + `/scripts/select/${id}` + `?lang=${lang}`;
        fetch(url)
        .then((res) => res.json())
        .then((res) => { 
            setVideoInfoList(res.data);
            res.data.map((v: any) => {
                if(v.subScript === null){
                    v.subScript = "[We are preparing a translation in this Language.]"
                }
            })
        })
        .catch((err) =>{ console.log(err); })

        if(userInfo.isLogined){
            //console.log('bookmark 여부 조회')
            url = serverUrl + `/user/${userInfo.user.id}/bookmark/select/${id}`
            fetch(url)
            .then((res) => res.json())
            .then((res) => { if(res.data === 1) setBookmarked(true); })
            .catch((err) =>{ console.log(err); })
        }
    },[])

    const changeLanguageShow = useCallback( () => {
        if(setting.language === 'en'){ //만약 기본 세팅이 영어면 해석 스크립트 보여줄필요없이 바로 가리기
            if(language === 1) setLanguage(4)
            else setLanguage(1)
        } else {
            if(language === 4) setLanguage(1)
            else setLanguage(language + 1)
        }
    },[language])
    
    const handlePlay = useCallback( () => {
        if(play) {
            setPlay(false)
            playerRef.current.seekTo(videoInfoList[page].timing);
            controlSemaphore()
        } else {
            setPlay(true);
            setStateIndicator('all')
            controlSemaphore()
        }
    },[play, page, videoInfoList])

    const controlSemaphore = useCallback(() => {
        setControllerLock(true);
        setTimeout(() => {
            setControllerLock(false);
        }, 300);
    },[])

    const handlePlaySync = useCallback( (e) => {
        if(e.state === 'playing') setPlay(true);
        else if (e.state === 'paused') setPlay(false)
    },[])

    const handleProgressBarAndPlay = useCallback(( seconds ) => {
        playerRef.current.seekTo(seconds);
        setPlay(true);
    },[])

    const playBetween = useCallback( ( startSecond: number , duration: number, callbackFunc: Function | null ) => {
        setControllerLock(true)
        playerRef.current.seekTo(startSecond);
        setStateIndicator('one')
        setPlay(true)
        setTimeout(() => {
            setPlay(false);
            playerRef.current.seekTo(startSecond);
            // setControllerLock(true)
            if(callbackFunc) {
                callbackFunc(); //레코딩 파일은 알아서 on ended 가지고 있으니까 명시해줄필요 x
            } else {
                setTimeout(() => {
                    setControllerLock(false);
                    setStateIndicator('')
                }, 300); // 문장 재생이 끝나더라도 조금이라도 더 락을 잡아둬서 다음 문장으로 넘어가는 버그 안나게끔
            }
        }, (duration + 1) * 1000); 
    },[])

    const checkCurrentTime = useCallback( () => {
        if (playerIsReady && play && playerRef.current) {
            playerRef.current
            .getCurrentTime()
            .then( (currentTime: any) => {
                // console.log('currentTime is -> ' + currentTime)
                setCurrentTime( currentTime );
            })
            .catch( (errorMessage: any) => {
                console.log('getCurrentTimeError -> ' + errorMessage);
            });
        }
    },[playerIsReady])
    
    useInterval(() => {
        checkCurrentTime();
    }, 500)

    const goLeft = useCallback( (targetPage: number) => {
        // setPlay(false);
        if(targetPage >= 0){
            setPlay(false);
            setPage(targetPage)
            playerRef.current.seekTo(videoInfoList[targetPage].timing);
        }
    },[videoInfoList])

    const goRight = useCallback( (targetPage: number) => {
        // setPlay(false);
        if(targetPage !== videoInfoList.length){
            setPlay(false);
            setPage(targetPage)
            playerRef.current.seekTo(videoInfoList[targetPage].timing);
        }
    },[videoInfoList])

    const PlayFromDescription = useCallback((targetPage: number) => {
        setPage(targetPage);
        playerRef.current.seekTo(videoInfoList[targetPage].timing);
        setPlay(true);
    },[videoInfoList])

    useEffect( () => {
        if( !controllerLock && currentTime === videoInfoList[page].timing + videoInfoList[page].duration){
            if(setting.repeatMode){
                playerRef.current.seekTo(videoInfoList[page].timing);
            } else if(page+1 < videoInfoList.length){
                setPage(page+1)
            } else {
                setPlay(false); //끝 페이지에 도달
                setPage(0);
                playerRef.current.seekTo(videoInfoList[0].timing);
            }
        }
    },[currentTime])

    const onHandleBookmark = useCallback(() => {
        setBookmarkLock(true)
        if(userInfo.isLogined){ //로그인 되어 있고
            if(bookmarked){ //북마크 되어있으면 삭제 예정
                let url = serverUrl + `/user/${userInfo.user.id}/bookmark/delete/${id}`;
                fetch(url)
                .then((res) => res.json())
                .then((res) => { 
                    if(res.data.affectedRows === 1) {
                        setBookmarked(false)
                        onHandleBookmarkDelete(id)
                        setBookmarkLock(false)
                    }
                })
                .catch((err) =>{ console.log(err); })
            } else { // 북마크 안되어있으니 등록 예정
                let url = serverUrl + `/user/${userInfo.user.id}/bookmark/add/${id}`;
                fetch(url)
                .then((res) => res.json())
                .then((res) => { 
                    if(res.data.affectedRows === 1) {
                        setBookmarked(true)
                        onHandleBookmarkAdd({
                            videoId: id,
                            youtubeKey: youtubeKey,
                            title: title,
                            createdAt: new Date().toISOString().substring(0,10)
                        })
                        setBookmarkLock(false)
                    }
                })
                .catch((err) =>{ console.log(err); })
            }
        } else {
            alert(tr({id: 'DV_NEED_TO_LOGIN'}))
        }
    },[bookmarked])

    return (
        <SafeAreaView style={{flex: 1}}>
        {
            id === "noid" ?
            <Text>Loading...</Text> :
            <>
                <SafeAreaView style={{flex: 1, backgroundColor: '#f5f5f5'}}>
                    <View>
                        <YouTube
                        ref={playerRef}
                        apiKey={Platform.OS == 'ios' ? '' : ''}
                        videoId={youtubeKey} // The YouTube video ID
                        play={play} // control playback of video with true/false
                        showFullscreenButton={false}
                        showinfo={false}
                        modestbranding={false}
                        controls={Platform.OS === 'ios' ? 0 : 2}
                        
                        onReady={() => { 
                            setPlayerIsReady(true);
                            setControllerLock(false)
                            handleProgressBarAndPlay(videoInfoList[0].timing)}
                        }
                        onChangeState={handlePlaySync}
                        onError={ (e: any ) => {
                            console.log(e)
                            if(e.error == 'not_embeddable') {
                                alert(Platform.OS + ' does not support this video')
                            }
                        }}
                        style={{ width : width, height : width * 9/16 }}
                        />
                    </View>
                
                {
                    description ? 
                    <ScrollView style={{flex: 1, backgroundColor: 'white', padding: 20}}>
                        {videoInfoList.map( (v) => (
                            <TouchableOpacity key={v.index} activeOpacity={.8} onPress={() => PlayFromDescription(v.index)} >
                                <Text style={{color: 'gray', fontSize: width*0.04}}>
                                    {Math.floor(v.timing / 60)}:{v.timing % 60}
                                </Text>    
                                <Text style={[{fontSize: width*0.05, marginBottom: 15}, v.index === page ? {color: 'red'} : null ]}>
                                {v.script} 
                                </Text>
                            </TouchableOpacity>))}
                        <View style={{height: 60}} />
                    </ScrollView>
                    :
                    <ScrollView style={{flex: 1}} ref={scrollRef}>
                        <View style={styles.viewPager}>
                            <View style={{width: '100%', height: '100%', position: 'absolute', top: 0, zIndex: 5, flexDirection: 'row'}}>
                                <TouchableOpacity disabled={controllerLock} style={styles.innerBoxLeftRightArrow} onPress={() => goLeft(page-1)} >
                                    { !setting.hideButtonMode ? <Icon name="left" size={30} style={{color: 'lightgray', opacity: 0.3, position: 'absolute', left: -5}}/> : null }
                                </TouchableOpacity>
                                <TouchableOpacity disabled={controllerLock} style={styles.innerBoxCenterButton} onPress={handlePlay} >
                                    { !setting.hideButtonMode ? <Icon2 name={play ? "controller-paus" : "controller-play" } size={width*0.15} style={{color: 'lightgray', opacity: 0.15}}/>  : null }
                                </TouchableOpacity>
                                <TouchableOpacity disabled={controllerLock} style={styles.innerBoxLeftRightArrow} onPress={() => goRight(page+1)} >
                                    { !setting.hideButtonMode ? <Icon name="right" size={30} style={{color: 'lightgray', opacity: 0.3, position: 'absolute', right: -5}}/>  : null }
                                </TouchableOpacity>
                                
                                <TouchableOpacity disabled={controllerLock} onPress={() => changeLanguageShow() } 
                                style={{position: 'absolute', left: 15, bottom: 15, zIndex: 11, padding: 5}}>
                                    <Icon3 name="language" size={width*0.06} color="gray" />
                                </TouchableOpacity>
                                <View style={{zIndex: 10, position: 'absolute', width: '100%', bottom: 15, padding: 5}}>
                                    <Text style={{fontSize: 16, color: 'gray', textAlign: 'center'}}>
                                        {videoInfoList[page].index + 1} / {videoInfoList.length} 
                                    </Text>
                                </View>
                                <View style={{zIndex: 10, position: 'absolute', right: 3, top: 0, padding: 5}}>
                                    <Text style={{fontSize: width * 0.04, color: 'gray', textAlign: 'center'}}>
                                        {(() => {
                                            if(!play) return tr({id: 'DV_STATE_INDICATOR_PAUSE'})
                                            else if(play && stateIndicator == 'one') return tr({id: 'DV_STATE_INDICATOR_PLAY_ONE'})
                                            else if(play && setting.repeatMode) return tr({id: 'DV_STATE_INDICATOR_REPEAT'})
                                            else if(play && stateIndicator == 'all') return tr({id: 'DV_STATE_INDICATOR_PLAY_ALL'})
                                        })()}
                                    </Text>
                                </View>
                                <TouchableOpacity 
                                disabled={controllerLock}
                                activeOpacity={0.9}
                                style={{position: 'absolute', right: 20, bottom: 20, zIndex: 11}}
                                onPress={() => onHandleRepeatMode()}
                                >
                                    <Icon4 name="retweet" size={width*0.08} style={setting.repeatMode ? {color: 'red'} : {color: 'gray'}} />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.innerPage} key={videoInfoList[page].index}>
                                <View style={styles.innerBox}>
                                {(() => {
                                    if(language === 1 ){
                                        return(
                                            <View style={styles.scriptBox}>
                                                <Text style={styles.scriptMain}>{videoInfoList[page].script}</Text>
                                                <Text style={styles.scriptSub}>{videoInfoList[page].subScript}</Text>
                                            </View>
                                        )
                                    } else if(language === 2){
                                        return(
                                            <View style={styles.scriptBox}>
                                                <Text style={styles.scriptMain}>{videoInfoList[page].script}</Text>
                                            </View>
                                        )
                                    } else if(language === 3){
                                        return(
                                            <View style={styles.scriptBox}>
                                                <Text style={styles.scriptMain}>{videoInfoList[page].subScript}</Text>
                                            </View>
                                        )
                                    } else if(language === 4){
                                        return(
                                            <View style={styles.scriptBox}>
                                                <Text style={styles.scriptMain}><Text style={{color: 'gray'}}>[Script is not shown]</Text></Text>
                                            </View>
                                        )
                                    }
                                    return(<></>)
                                })()}
                                </View>
                            </View>
                        </View>

                        <BuiltInRecorder 
                        videoInfoList={videoInfoList}
                        playBetween={playBetween} 
                        page={page} 
                        play={play}
                        setPlay={setPlay}
                        setControllerLock={setControllerLock}
                        youtubeKey={youtubeKey} 
                        />

                        <BuiltInWordBook play={play} script={videoInfoList[page].script} subScript={videoInfoList[page].subScript} />

                        {setting.dvTutorial ? 
                            <DetailViewTutorial scrollRef={scrollRef} setPlay={setPlay} /> : null}
                    </ScrollView>
                }
                </SafeAreaView>

                <DetailViewBottomTab navProps={props} bookmarkLock={bookmarkLock} onHandleBookmark={onHandleBookmark} bookmarked={bookmarked} description={description} setDescription={setDescription} setSettingModal={setSettingModal} />
            </>
        }
            <Modal isVisible={settingModal} 
            coverScreen 
            hasBackdrop 
            //useNativeDriver 
            hideModalContentWhileAnimating 
            style={{margin: 0}} 
            onBackdropPress={() => setSettingModal(false)} 
            onBackButtonPress={() => setSettingModal(false)}
            swipeDirection="down"
            onSwipeComplete={() => setSettingModal(false)}
            >
                <DetailViewSettingModal 
                navProps={props} 
                setSettingModal={setSettingModal} 
                videoId={id} 
                videoIndex={videoInfoList[page].index} 
                videoScript={videoInfoList[page].script} 
                videoSubScript={videoInfoList[page].subScript} 
                youtubeKey={youtubeKey}
                />
            </Modal>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    viewPager: {
        margin: 10,
        height: height * 0.35,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    innerPage: {
        width: '100%',
        height: '100%',
        backgroundColor: 'white',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'lightgray',
        paddingTop: 10,
        paddingHorizontal: 5
    },
    innerBox: {
        width: '100%',
        height: '100%',
        paddingHorizontal: 10,
        paddingVertical: 5
    },
    innerBoxLeftRightArrow: {
        width: '25%', height: '100%', zIndex: 0, justifyContent: 'center'
    },
    innerBoxCenterButton: { 
        width: '50%', height: '100%', zIndex: 10, justifyContent: 'center', alignItems: 'center'
    },
    playButton: {
        color: 'dodgerblue',
        marginTop: 4,
    },
    playButtonDisabled: {
        color: 'gray',
        marginTop: 4
    },
    scriptBox: {
        flex: 1,
    },
    scriptMain: {
       fontSize: width * 0.06,
       color: 'black', 
       marginBottom: 5
    },
    scriptSub: {
        fontSize: width * 0.04,
        color: 'gray'
    },

});

DetailView.navigationOptions = ( { } ) => ({
    headerShown: false,
});

export default DetailView