import { Platform, NativeModules } from 'react-native'
import locale from '../../constants/locale'

const deviceLanguage =
Platform.OS === 'ios'
  ? NativeModules.SettingsManager.settings.AppleLocale ||
    NativeModules.SettingsManager.settings.AppleLanguages[0] //iOS 13
  : NativeModules.I18nManager.localeIdentifier;
let defaultLang = deviceLanguage.substring(0,2)
if(defaultLang in locale == false) defaultLang = 'en'; // if device Language is not in our locale array, it will be 'en'

export default defaultLang;