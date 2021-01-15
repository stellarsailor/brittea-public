if (!__DEV__) console.log = () => {};

import React, { useEffect, useState, useCallback } from 'react';
import { SafeAreaView, StyleSheet, ScrollView, View, Text, Button, TouchableOpacity, Platform, NativeModules } from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import SplashScreen from 'react-native-splash-screen'
import Icon from 'react-native-vector-icons/AntDesign';
import Icon2 from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-community/async-storage';

import Tab1Main from './components/Tab1Main';
import Tab2Main from './components/Tab2Main';
import Tab2Sub from './components/Tab2Sub';
import Tab3Main from './components/Tab3Main'
import Tab4Main from './components/Tab4Main';
import Tab4Detail from './components/subcomponents/Tab4Detail';
import MyPage from './components/MyPage';
import DetailView from './components/DetailView';
import Tutorial from './components/subcomponents/Tutorial';
import WordBook from './components/subcomponents/WordBook';
import ScriptReport from './components/subcomponents/ScriptReport'

import serverUrl from './constants/serverLocation';

import { getSettingAction } from './redux/setting';
import { signInAction } from './redux/userInfo';
import { useSelector, useDispatch } from 'react-redux'

import { FormattedMessage, injectIntl, IntlProvider } from 'react-intl'
import locale from './constants/locale'
import defaultLang from './components/logics/getDefaultLanguage'

function App (props) {
  const setting = useSelector((state: any) => state.setting)
  const userInfo = useSelector((state: any) => state.userInfo)

  const [ pageIsReady , setPageIsReady ] = useState(false)
  const [ overlayScreen, setOverlayScreen ] = useState(true)
  const [ firstTime, setFirstTime ] = useState(true)
  
  const dispatch = useDispatch();
  const onGetSetting = useCallback((payload) => dispatch(getSettingAction(payload)),[dispatch])
  const onSignIn = useCallback((userInfo, bookmarks) => dispatch(signInAction(userInfo, bookmarks)),[dispatch])
  
  const getSettingData = async () => {
    let value = '';
    try {
      value = await AsyncStorage.getItem('setting')
      if(value === null) {
        console.log('no setting found. will make new setting');
        setAsyncData({
          roleModel: '',
          repeatMode: false,
          hideButtonMode: false,
          bookshelfColor: 'white',
          wordBook: [],
          language: defaultLang,
        })
        setFirstTime(true);
      } else {
        console.log('setting found. here is.')
        onGetSetting(JSON.parse(value));
      }
    } catch(e) {
      console.log(e)
    }
  }

  const getIdTokenAndEmail = async () => {
    let idToken = '';
    let email = '';
    try {
      idToken = await AsyncStorage.getItem('idToken')
      email = await AsyncStorage.getItem('email')
      // console.log('token found. here is.')
      // console.log(idToken);
      if(idToken && email){
        let url = serverUrl + `/user/${email}/${idToken}`
        const verifyToken = await fetch(url)
        const results = await verifyToken.json()
  
        url = serverUrl + `/user/${results.data.id}/bookmark/select/all`
        const rawResponse2 = await fetch(url)
        const bookmarks = await rawResponse2.json()

        onSignIn({user: results.data}, bookmarks.data)
      } else {
        console.log('저장된 토큰 또는 이메일 없음')
        //async에 저장된 토큰이나 메일이 없을경우엔 아무것도 안함.
      }
    } catch(e) {
        console.log(e)
    }
  }

  const setAsyncData = async (settingValue) => {
      try {
          await AsyncStorage.setItem('setting', JSON.stringify(settingValue))
      } catch(e) {
          console.log(e)
        }
      console.log('setting Done.')
  }

  const deleteUserId = async () => {
    try {
      await AsyncStorage.removeItem('setting');
    } catch (error) {
      // Error retrieving data
      console.log(error.message);
    }
  }

  useEffect(() => {
    getSettingData();
    getIdTokenAndEmail();
  },[])

  return (
    <IntlProvider locale={defaultLang} messages={locale[setting.language]} onError={(e) => console.log(e)}>
      <AppContainer/>
      {
        firstTime ? 
        <View style={{justifyContent: 'center', alignItems: 'center', flex: 1, position: 'absolute', width: '100%', height: '100%'}}>
          <Tutorial setFirstTime={setFirstTime} />
        </View>
        : null
      }
    </IntlProvider>
  )
}


const Tab1Stack = createStackNavigator(
  {
    Tab1Main: Tab1Main,
    Tab2Sub: Tab2Sub
  },
);
const Tab2Stack = createStackNavigator(
  {
    Tab2Main: Tab2Main,
    Tab2Sub: Tab2Sub
  }
);
const Tab3Stack = createStackNavigator(
  {
    Tab3Main: Tab3Main,
  }, 
  {
    headerMode: 'none'
  }
)
const Tab4Stack = createStackNavigator(
  {
    Tab4Main: Tab4Main,
    Tab4Detail: Tab4Detail,
    WordBook: WordBook,
  },
  {
    headerMode: 'none',
  }
);
const Tab5Stack = createStackNavigator(
  {
    MyPage: MyPage,
  }
);

const BottomTabNavigator = createMaterialBottomTabNavigator(
{
  tab1: { 
    screen : Tab1Stack , navigationOptions: {
      tabBarLabel: <Text style={Platform.OS === 'ios' ? null : {fontWeight: 'bold'}, {fontSize: 13}}><FormattedMessage id="BOTTOMTAB_1" /></Text>,
      tabBarIcon: ({ focused , tintColor }) => (
        <Icon name="home" size={24} color={focused ? tintColor : 'black' } />
        )
      },
  },
  tab2: { 
    screen : Tab2Stack , navigationOptions: {
      tabBarLabel: <Text style={Platform.OS === 'ios' ? null : {fontWeight: 'bold'}, {fontSize: 13}}><FormattedMessage id="BOTTOMTAB_2" /></Text>,
      tabBarIcon: ({ focused , tintColor }) => (
        <Icon name="search1" size={24} color={focused ? tintColor : 'black' } />
        )
      },
  },
  tab3: {
    screen : Tab3Stack, navigationOptions: {
      tabBarLabel: <Text style={Platform.OS === 'ios' ? null : {fontWeight: 'bold'}, {fontSize: 13}}><FormattedMessage id="BOTTOMTAB_3" /></Text>,
      tabBarIcon: ({ focused , tintColor }) => (
        <Icon2 name="headphones" size={24} color={focused ? tintColor : 'black' } />
      ),
    },
  },
  tab4: {
    screen : Tab4Stack, navigationOptions: {
      tabBarLabel: <Text style={Platform.OS === 'ios' ? null : {fontWeight: 'bold'}, {fontSize: 13}}><FormattedMessage id="BOTTOMTAB_4" /></Text>,
      tabBarIcon: ({ focused , tintColor }) => (
        <Icon name="book" size={24} color={focused ? tintColor : 'black' } />
        )
    },
  },
  tab5: {
    screen : Tab5Stack, navigationOptions: {
      tabBarLabel: <Text style={Platform.OS === 'ios' ? null : {fontWeight: 'bold'}, {fontSize: 13}}><FormattedMessage id="BOTTOMTAB_5" /></Text>,
      tabBarIcon: ({ focused , tintColor }) => (
        <Icon name="user" size={24} color={focused ? tintColor : 'black' } />
        )
    },
  },
},
{
  initialRouteName: 'tab1',
  backBehavior: 'none',
  shifting: true,
  activeColor: 'red',
  inactiveColor: 'black',
  barStyle: { backgroundColor: 'white', borderTopWidth: 1, borderTopColor: '#E9E9E9' },
});

const testNavigator = createStackNavigator(
  {
    Home : BottomTabNavigator,
    ScriptReport: ScriptReport,
    Detail: DetailView,
  },{
    headerMode: 'none',
    initialRouteName: 'Home',
  }
)

const styles = (tintColor) => StyleSheet.create({
  bottomTabLabel: {
    color: 'gray',
    fontSize: 12,
    textAlign: 'center'
  },
  bottomTabLabelFocused: {
    color: tintColor,
    fontSize: 12,
    textAlign: 'center'
  },
});


const AppContainer = createAppContainer(testNavigator);

export default App;
