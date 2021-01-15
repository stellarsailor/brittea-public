import React, { useEffect, useState, useCallback } from 'react';
import { SafeAreaView , View, Text, StyleSheet, TouchableOpacity, Dimensions, Platform} from 'react-native';
import FastImage from 'react-native-fast-image'
import { useIntl } from 'react-intl'
import ViewPager from '@react-native-community/viewpager';
import { MaterialIndicator } from 'react-native-indicators';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon2 from 'react-native-vector-icons/Feather';
import SplashScreen from 'react-native-splash-screen'
import AsyncStorage from '@react-native-community/async-storage';
import Tts from 'react-native-tts';

import defaultLang from './logics/getDefaultLanguage'

import { useSelector } from 'react-redux'

const window = Dimensions.get('window');
const width = window.width;

import AdBanner from './subcomponents/AdBanner';
import serverUrl from '../constants/serverLocation';
import Tab1GroupRender from './subcomponents/Tab1GroupRender';
import InfiniteFlatList from './subcomponents/InfiniteFlatList';
import BookmarksList from './subcomponents/BookmarksList'

const viewPager: any = React.createRef();

function Tab1Main ( props: any ){
    const setting = useSelector((state) => state.setting)
    const userInfo = useSelector((state) => state.userInfo)
    
    const { formatMessage: tr } = useIntl();

    const [ page, setPage ] = useState(0);
    const [ pageSub, setPageSub ] = useState(0)
    const [ cuppa, setCuppa ] = useState('');
    const [ backImage, setBackImage ] = useState('')
    const [ comment, setComment ] = useState('');
    const [ hideFlatlistHeader, setHideFlatlistHeader ] = useState(false)

    useEffect(() => {
        getAsyncLangData()
        Tts.setDefaultLanguage('en-GB');

        setTimeout(() => {
            SplashScreen.hide()
        }, 2200);
    },[])

    const getAsyncLangData = async () =>{
        try {
            let value = await AsyncStorage.getItem('setting')
            if(value === null) fetchMainText(defaultLang)
            else fetchMainText(JSON.parse(value).language)
        } catch(e) {
            console.log(e)
        }
    }
    
    const fetchMainText = (param: string) => {
        fetch(serverUrl + `/maintext?lang=${param}`)
        .then((res) => res.json())
        .then((res) => { 
            setCuppa(res.text[0].cuppa)
            setComment(res.text[0].comment)
            let one = res.image[Math.floor(Math.random() * res.image.length)]
            setBackImage(one.backImage)
        }) 
        .catch((err) => console.log(err));
    }

    const handleTTS = useCallback(() => {
        Tts.speak(cuppa)
    },[cuppa])

    const onSearchRoleModel = useCallback((param) => {
        props.navigation.push('Tab2Sub' , {
            searchWithoutSpace: param
        })
    },[])

    let initialUrl = serverUrl + "/group/select?"

    const renderFlatListHeader = ( // () => 쓸시 탭 옮겨질때 매번 렌더링되는게 보임
    <>
        {
            hideFlatlistHeader ? 
            null
            :
            <View style={{width: '100%', height: width * 1/2, justifyContent: 'center', alignItems: 'center'}}> 
                <TouchableOpacity activeOpacity={.9} style={{position: 'absolute', zIndex: 10, alignItems: 'center'}} onPress={handleTTS}>
                    <Text style={{fontSize: width*0.05, color: 'white', fontWeight: 'bold', textAlign: 'center', marginTop: -5, marginBottom: 5}}> 
                        {tr({id: 'TAB_1_CUPPA_TITLE'})} <Icon2 name="coffee" size={16} color="pink" /> 
                    </Text>
                    <View style={{backgroundColor: 'white', width: 30, height: 2, marginVertical: 7}} />
                    <Text style={styles.mainTopCuppa}>{cuppa} <Icon2 name="headphones" size={width*0.05} color="pink" /></Text>
                    <Text style={styles.mainTopComment}>{comment}</Text>
                </TouchableOpacity>
                <FastImage source={{uri: backImage}} style={{width: '100%', height: width * 1/2}} />
                <View style={styles.mainTopImageBlackBackground} />
                <TouchableOpacity style={styles.mainTopImageClose} onPress={() => setHideFlatlistHeader(true)} >
                    <Icon name="close" size={20} color="white" style={{opacity: 0.7}} />
                </TouchableOpacity>
            </View>
        }
        <TouchableOpacity style={styles.roleModelBox} 
        onPress={setting.roleModel == '' ? () => props.navigation.navigate('Tab2Main') : () => onSearchRoleModel(setting.roleModel)}>
            <Icon name="star" size={width*0.04} style={{alignSelf: 'center', color: 'gold', marginLeft: 5}} />
            {setting.roleModel == '' ? 
                <Text style={{color: 'gray', marginVertical: 5}}>
                    {tr({id: 'TAB_1_NO_ROLE_MODEL'})}
                </Text>
            : 
                <>
                <Text style={{fontSize: width*0.04}}>
                    {tr({id: 'TAB_1_MY_ROLE_MODEL'})}
                </Text>
                <Text style={{fontSize: width*0.05, fontWeight: 'bold'}}>
                    {setting.roleModel}
                </Text>
                </>
            }
            <Icon name="arrowright" size={20} style={{position: 'absolute' , right: 15, color: 'gray'}}/>
        </TouchableOpacity>
    </>
    )

    const renderItem = (item: any, index: number) => (<Tab1GroupRender navProps={props} keyProps={item.id} phrase={item.phrase} adIndex={index} />)
    
    const handleTopMenuBar = useCallback((page: number) => {
        setPageSub(page);
        viewPager.current.setPage(page);
    },[]);
    
    return(
        <SafeAreaView style={{flex: 1}}>
            <View style={styles.headerView}>
                <View style={{flexDirection: 'row', alignItems: 'center', width: '100%'}}>
                    <FastImage source={require('../images/britteaicon.png')} style={ Platform.OS === 'android' ? {width: 25, height: 25, marginTop: 3} : {width: 25, height: 25}} />
                    <Text style={styles.headerText} >
                        BritTea<Text style={{color: 'red'}}>.</Text>
                    </Text>
                    {
                        userInfo.isLogined ?
                        <TouchableOpacity activeOpacity={.7} onPress={() => props.navigation.navigate('MyPage')} style={{position: 'absolute', right: 0}}>
                            {userInfo.user.photo === 'null' ?
                                <FastImage source={require('../images/unknown.jpg')} style={{width: 30, height: 30, borderRadius: 30, borderWidth: 1, borderColor: 'lightgray'}} /> 
                            :
                                <FastImage source={{uri: userInfo.user.photo}} style={{width: 30, height: 30, borderRadius: 30, borderWidth: 1, borderColor: 'lightgray'}} />
                            }
                        </TouchableOpacity>
                        :
                        null
                    }
                </View>
            </View>
            <View style={styles.mainSeperator}>
                <TouchableOpacity activeOpacity={.9} style={styles.mainSeperatorContainer} onPress={() => handleTopMenuBar(0)}>
                    <Text style={[styles.mainSeperatorText, pageSub === 0 ? {color: 'black'}:{color: 'lightgray'}]}>
                        {tr({id: 'TAB_1_BUTTON_1'})}
                    </Text>
                    <View style={pageSub === 0 ? styles.mainSeperatorDot : {marginRight: 10}} />
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={.9} style={styles.mainSeperatorContainer} onPress={() => handleTopMenuBar(1)}>
                    <Text style={[styles.mainSeperatorText, pageSub === 1 ? {color: 'black'}:{color: 'lightgray'}]}>                                    
                        {tr({id: 'TAB_1_BUTTON_2'})}
                    </Text>
                    <View style={pageSub === 1 ? styles.mainSeperatorDot : {marginRight: 10}} />
                </TouchableOpacity>
            </View>
            <ViewPager 
            style={styles.viewPager} 
            initialPage={0} 
            onPageSelected={(e) => { setPage(e.nativeEvent.position); setPageSub(e.nativeEvent.position) } } 
            ref={viewPager}>
                <View key="1" style={{width: '100%', height: '100%'}}>
                    <InfiniteFlatList 
                    fetchUrl={initialUrl}
                    renderItem={renderItem}
                    renderFlatListHeader={renderFlatListHeader}
                    />
                </View>
                <View key="2">
                    <View style={{flex: 1}}>
                        <BookmarksList navProps={props}/>
                    </View>
                </View>
            </ViewPager>
            <AdBanner />
        </SafeAreaView>
    )
}

Tab1Main.navigationOptions = () => ({
    headerShown: false,
});

const styles = StyleSheet.create({
    headerView: {
        flexDirection: 'row', 
        justifyContent:'space-between', 
        paddingTop: 10, paddingLeft: 20, paddingRight: 20
    },
    headerText: {
        marginLeft: 5, 
        fontSize: width * 0.06, 
        fontWeight: '700',
    },
    mainSeperator: {
        marginTop: 5,
        marginLeft: 10,
        flexDirection: 'row',
    },
    mainSeperatorContainer: {
        alignItems: 'center',
        marginLeft: 10,
        padding: 5
    },
    mainSeperatorText: {
        fontSize: width * 0.05,
        fontWeight: 'bold',
    },
    mainSeperatorDot: {
        backgroundColor: 'red', 
        width: 4, height: 4, 
        borderRadius: 20,
        marginTop: 3
    },
    viewPager: {
      flex: 1,
    },
    mainTopImageBlackBackground: {
        backgroundColor: 'black', 
        width: '100%', 
        height: '100%', 
        position: 'absolute', 
        opacity: 0.65
    },
    mainTopImageClose: {
        position: 'absolute', 
        right: 15, top: 15
    },
    mainTopCuppa: {
        fontSize: width*0.065, 
        color: 'white', 
        fontWeight: 'bold', 
        textAlign: 'center',
        marginBottom: 5,
    },
    mainTopComment: {
        fontSize: width*0.043, 
        color: 'white', 
        fontWeight: 'bold', 
        textAlign: 'center'
    },
    roleModelBox: {
        paddingVertical: 10, 
        backgroundColor: 'white', 
        marginTop: 20, 
        marginHorizontal: 30, 
        borderRadius: 10, 
        borderWidth: 1, borderColor: 'lightgray',
        alignItems: 'center', 
        justifyContent: 'center', 
    }
});


export default Tab1Main;