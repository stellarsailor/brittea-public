import AsyncStorage from '@react-native-community/async-storage';

export default async function setAsyncData(settingValue){
    try {
        await AsyncStorage.setItem('setting', JSON.stringify(settingValue))
    } catch(e) {
        // save error
    }
    console.log('setting Done.')
}