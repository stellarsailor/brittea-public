import React, { useEffect, useState, useCallback, } from 'react';
import { View, Text, StyleSheet , ScrollView, TouchableOpacity, Dimensions, Alert, ImageBackground, Platform, Linking } from 'react-native';
import FastImage from 'react-native-fast-image'
import { useIntl } from 'react-intl'
import Modal from 'react-native-modal'
import AsyncStorage from '@react-native-community/async-storage';
import AdBanner from './subcomponents/AdBanner'
import AppleLogin from './AppleLogin'
import serverUrl from '../constants/serverLocation';
import VersionNumber from 'react-native-version-number';

import { useSelector, useDispatch } from 'react-redux'

import { GoogleSignin, GoogleSigninButton, statusCodes } from '@react-native-community/google-signin';
import { signInAction, logoutAction } from '../redux/userInfo';
import { setLangSettingAction } from '../redux/setting';

var RNFS = require('react-native-fs');

const window = Dimensions.get('window');
const width = window.width;

function MyPage ( props: any ){
    const userInfo = useSelector((state: any) => state.userInfo)
    const setting = useSelector((state: any) => state.setting)
    
    const dispatch = useDispatch();
    const onSignIn = useCallback((userInfo, bookmarks) => dispatch(signInAction(userInfo, bookmarks)),[dispatch])
    const onLogout = useCallback(() => dispatch(logoutAction()),[dispatch])
    const onLangSetting = useCallback((langCode) => dispatch(setLangSettingAction(langCode)),[dispatch])
    
    const { formatMessage: tr } = useIntl();
    
    const [ languageModal, setLanguageModal ] = useState(false)
    const [ cacheSize, setCacheSize ] = useState('0')

    const [ isSigninInProgress, setIsSigninInProgress ] = useState(false);
    
    GoogleSignin.configure({
        webClientId: ''
    });

    const signIn = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();

            console.log("Login Success")
            let url = serverUrl + '/user/signin'
            const rawResponse = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token: userInfo.idToken,
                    email: userInfo.user.email,
                    companyId: userInfo.user.id,
                    familyName: userInfo.user.familyName,
                    givenName: userInfo.user.givenName,
                    name: userInfo.user.name,
                    photo: userInfo.user.photo
                })
            })
            const signInDataSaveResult = await rawResponse.json();

            url = serverUrl + `/user/${userInfo.user.id}/bookmark/select/all`
            const rawResponse2 = await fetch(url)
            const bookmarks = await rawResponse2.json()

            //console.log(content)
            setAsyncToken(userInfo.idToken);
            setAsyncEmail(userInfo.user.email)
            // console.log(userInfo);
            onSignIn(userInfo, bookmarks.data)
        } catch (error) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
            // user cancelled the login flow
            } else if (error.code === statusCodes.IN_PROGRESS) {
            // operation (e.g. sign in) is in progress already
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
            // play services not available or outdated
            } else {
            // some other error happened
                console.log(error)
                console.log(error.code)
            }
        }
    };

    const setAsyncToken = async (idToken: any) => {
        try {
            await AsyncStorage.setItem('idToken', idToken)
        } catch(e) {
            console.log(e)
        }
        console.log('idToken Saved.')
    }

    const setAsyncEmail = async (email: any) => {
        try {
            await AsyncStorage.setItem('email', email)
        } catch(e) {
            console.log(e)
        }
        console.log('email Saved.')
    }

    const path = RNFS.DocumentDirectoryPath + '/Recordings';

    useEffect(() => {
        getCache();
    },[])

    const getCache = useCallback(() => {
        RNFS.readDir(path)
        .then((result: any) => {
            let sum = 0;
            for(let i = 0; i < result.length ; i++ ){
                sum += result[i].size ;
            }
            setCacheSize((sum / 1000000).toFixed(2));
        })
        .catch((err: any) => {
            console.log(err.message, err.code);
        });
    },[])

    const handleDeleteAlert = useCallback( () => {
        Alert.alert(
        '',
        tr({id: 'TAB_5_CACHE_DELETE_ALERT'}),
        [
            {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                //style: 'cancel',
            },
            {
                text: 'Delete', 
                onPress: () => deleteCache(),
                style: 'destructive',
            },
        ],
        {cancelable: false},
    );
    },[])

    const handleLogoutAlert = useCallback( () => {
        Alert.alert(
        '',
        tr({id: 'TAB_5_LOGOUT_ALERT'}),
        [
            {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                //style: 'cancel',
            },
            {
                text: 'Logout', 
                onPress: () => handleLogout(),
                style: 'destructive',
            },
        ],
        {cancelable: false},
    );
    },[])

    const deleteCache = useCallback(() => {
        return RNFS.unlink(path)
        .then(() => {
            console.log('FILE DELETED & WILL MAKE DOCUMENTS AGAIN');
            RNFS.mkdir(path);
            getCache();
        })
        // `unlink` will throw an error, if the item to unlink does not exist
        .catch((err: any) => {
            console.log(err.message);
        });
    },[])
    
    const handleChangeLanguage = useCallback((langCode: string) => {
        onLangSetting(langCode)
        setLanguageModal(false)
    },[])

    const handleLogout  = async () => {
        try {
            onLogout();
            await AsyncStorage.removeItem('email')
            await AsyncStorage.removeItem('idToken')
        } catch(e) {
            console.log(e)
        }
    }

    const languageCodeToWord = (code: string) => {
        switch(code){
            case "en": return "English"
            case "ko": return "한국어"
            case "jp": return "日本語"
            default: return "English"
        }
    }

    return(
        <>
            <ScrollView >
            <ImageBackground source={require('../images/parliament.jpg')} style={{width: width, height: 300, justifyContent: 'center', marginTop: -10}}>
                <View style={{marginTop: 10}}>
                    {
                        userInfo.isLogined ?
                        <>
                        {userInfo.user.photo === 'null' ? 
                            <FastImage source={require('../images/unknown.jpg')} style={{width: 80, height: 80, borderRadius: 80, alignSelf: 'center', borderWidth: 1, borderColor: 'lightgray'}} /> 
                        :
                            <FastImage source={{uri: userInfo.user.photo}} style={{width: 80, height: 80, borderRadius: 80, alignSelf: 'center', borderWidth: 1, borderColor: 'lightgray'}} />
                        }
                        <View style={{justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{fontSize: 24, color: 'white', fontWeight: 'bold'}}> {userInfo.user.name} </Text>
                            <View style={{width: 30, height: 3, backgroundColor: 'white', marginVertical: 10, borderRadius: 3}} />
                            <Text style={{fontSize: 14, color: 'white'}}> 
                                { userInfo.user.email.includes('privaterelay') ? null : userInfo.user.email } </Text>
                        </View>
                        </>
                        :
                        null
                    }
                </View>

            </ImageBackground>
            <View style={{borderTopLeftRadius: 40, borderTopRightRadius: 40, marginTop: -40, backgroundColor: 'white', paddingTop: 20, paddingHorizontal: 20}}>
            {
                userInfo.isLogined ? 
                <View style={styles.inline}>
                    <TouchableOpacity style={styles.inlineTouchOpacity} onPress={() => handleLogoutAlert()}>
                        <Text style={styles.inlineText}>
                            {tr({id: 'TAB_5_ACCOUNT'})}
                        </Text>
                        <Text style={[styles.inlineText,{color: 'red'}]}>
                            {tr({id: 'TAB_5_LOGOUT'})}
                        </Text>
                    </TouchableOpacity>
                </View>
                :
                <View style={{width: '100%', borderBottomColor: '#EEEEEE', borderBottomWidth: 1, 
                paddingLeft: 10, paddingBottom: 5}}>
                    <View style={styles.inlineTouchOpacity} >
                        <Text style={styles.inlineText}>
                            {tr({id: 'TAB_5_ACCOUNT'})}
                        </Text>
                        <View style={{flexDirection: 'row'}}>
                            <AppleLogin />
                            <GoogleSigninButton
                            style={ Platform.OS == 'ios' ? { width: 48, height: 48 } : { width: 120, height: 48 }}
                            size={ Platform.OS == 'ios' ? GoogleSigninButton.Size.Icon : GoogleSigninButton.Size.Standard}
                            color={GoogleSigninButton.Color.Light}
                            onPress={signIn}
                            disabled={isSigninInProgress} />
                        </View>
                    </View>
                </View>
                        }
                <View style={styles.inline}>
                    <TouchableOpacity style={styles.inlineTouchOpacity} onPress={() => setLanguageModal(true)}>
                        <Text style={styles.inlineText}>
                            Language
                        </Text>
                        <Text style={[styles.inlineText,{color: 'dodgerblue'}]}>{languageCodeToWord(setting.language)}</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.inline}>
                    <TouchableOpacity style={styles.inlineTouchOpacity} onPress={handleDeleteAlert}>
                        <Text style={styles.inlineText}>
                            {tr({id: 'TAB_5_CACHE'})}
                        </Text>
                        <Text><Text style={{color: 'gray', fontSize: 10}}>clear</Text> {cacheSize} MB</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.inline}>
                    <TouchableOpacity style={styles.inlineTouchOpacity} onPress={() => alert(tr({id: 'TAB_5_ADS_DELETE_ALERT'}))}>
                        <Text style={styles.inlineText}>
                            {tr({id: 'TAB_5_ADS_DELETE'})}
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.inline}>
                    <TouchableOpacity style={styles.inlineTouchOpacity} onPress={() => {
                        props.navigation.push('Tab4Detail', {
                            action: `https://brittea.uk/faq/${setting.language}`,
                            withoutAds: true
                        })
                    }}>
                        <Text style={styles.inlineText}>
                            {tr({id: 'TAB_5_FAQ'})}
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.inline}>
                    <TouchableOpacity style={styles.inlineTouchOpacity} onPress={() => Linking.openURL('mailto:brittea.alice@gmail.com').catch((err) => console.log('An error occurred', err))}>
                        <Text style={styles.inlineText}>
                            {tr({id: 'TAB_5_REPORT'})}
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={{width: '100%',  padding: '3%', paddingHorizontal: 10}}>
                    <Text style={styles.inlineText}>
                        {tr({id: 'TAB_5_APP_INFO'})}
                    </Text>
                    <Text style={{color: 'gray', marginVertical: 10, marginLeft: 10}}>Version {VersionNumber.appVersion}</Text>
                    <Text style={styles.inlineInfoText} onPress={() => {
                        props.navigation.push('Tab4Detail', {
                            action: `https://brittea.uk/privacy/${setting.language}`,
                            withoutAds: true
                        })
                    }}>Privacy Policy</Text>
                </View>
            </View>

            <Modal 
            isVisible={languageModal} 
            coverScreen 
            useNativeDriver 
            hideModalContentWhileAnimating 
            onBackdropPress={() => setLanguageModal(false)}
            >
                <View style={{ backgroundColor: 'white', width: '100%', height: '50%', padding: '5%'}}>
                    <Text style={{fontSize: 22, fontWeight: 'bold', margin: 5}}>
                        Language Setting
                    </Text>
                    <View style={styles.inline}>
                        <Text style={styles.inlineText} onPress={() => handleChangeLanguage("en")}>English - English</Text>
                    </View>
                    <View style={styles.inline}>
                        <Text style={styles.inlineText} onPress={() => handleChangeLanguage("ko")}>한국어 - Korean</Text>
                    </View>
                    {/* <View style={styles.inline}>
                        <Text style={styles.inlineText} onPress={() => alert("will be supported")}>日本語 - Japanese</Text>
                    </View> */}
                </View>
            </Modal>
        </ScrollView>
        <AdBanner />
        </>
    )
}

MyPage.navigationOptions = ( { } ) => ({
    headerShown: false,
});

const styles = StyleSheet.create({
    inline: {
        width: '100%', borderBottomColor: '#EEEEEE', borderBottomWidth: 1, 
        paddingHorizontal: 10, paddingTop: 12, paddingBottom: 12
    },
    inlineTouchOpacity: {
        flexDirection: 'row', justifyContent: 'space-between',
        alignItems: 'center',
    },
    inlineText: {
        fontSize: 18,
        color: '#2b2b2b'
    },
    inlineInfoText: {
        color: 'gray',
        textDecorationLine: 'underline',
        marginLeft: 10,
        marginBottom: 10
    }
})

export default MyPage;