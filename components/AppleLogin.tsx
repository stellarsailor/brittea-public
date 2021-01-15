import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet } from 'react-native';
import appleAuth, {
  AppleButton,
  AppleAuthError,
  AppleAuthRequestScope,
  AppleAuthRealUserStatus,
  AppleAuthCredentialState,
  AppleAuthRequestOperation,
} from '@invertase/react-native-apple-authentication';
import AsyncStorage from '@react-native-community/async-storage';
import serverUrl from '../constants/serverLocation';
import { useSelector, useDispatch } from 'react-redux'
import { signInAction } from '../redux/userInfo';

export default function AppleLogin() {
    // const userInfo = useSelector((state: any) => state.userInfo)
    
    const dispatch = useDispatch();
    const onSignIn = useCallback((userInfo, bookmarks) => dispatch(signInAction(userInfo, bookmarks)),[dispatch])

    async function onAppleButtonPress() {
        try {
            const appleAuthRequestResponse = await appleAuth.performRequest({
                requestedOperation: AppleAuthRequestOperation.LOGIN,
                requestedScopes: [AppleAuthRequestScope.EMAIL, AppleAuthRequestScope.FULL_NAME],
            });
    
            const data = appleAuthRequestResponse;

            let userInfo = {
                idToken: data.identityToken,
                user: {
                    id: data.user,
                    email: data.email,
                    familyName: data.fullName?.familyName,
                    givenName: data.fullName?.givenName,
                    name: data.fullName?.givenName + ' ' + data.fullName?.familyName,
                    photo: 'null'
                }
            };
    
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
    
            setAsyncToken(userInfo.idToken);
            setAsyncEmail(userInfo.user.email)
            onSignIn(userInfo, bookmarks.data)
        } catch (error) {
            if (error.code === AppleAuthError.CANCELED) {
                console.log('User canceled Apple Sign in.');
            } else {
                console.error(error);
            }
        }
    }
    
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

    

    if (!appleAuth.isSupported) {
        return (<></>);
    }
    return (
        <AppleButton
        style={styles.appleButton}
        cornerRadius={3}
        buttonStyle={AppleButton.Style.BLACK}
        buttonType={AppleButton.Type.CONTINUE}
        onPress={() => onAppleButtonPress()}
        />
    );
}

const styles = StyleSheet.create({
    appleButton: {
        width: 40,
        height: 40,
        marginTop: 4,
        marginRight: 10,
    },
});
