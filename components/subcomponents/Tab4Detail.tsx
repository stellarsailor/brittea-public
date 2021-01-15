import React, { useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, Image, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import { MaterialIndicator } from 'react-native-indicators';
import { WebView } from 'react-native-webview'
import AdBanner from './AdBanner';

function Tab4Detail(props: any){

    const { navigation } = props
    const action = navigation.getParam ('action', 'null');
    const withoutAds = navigation.getParam ('withoutAds', false);

    const [ pageLoading, setPageLoading ] = useState<boolean | null>(null);

    return(
        <SafeAreaView style={{flex: 1}}>
            <View style={{borderBottomColor: 'lightgray', borderBottomWidth: 1 , height: 50, justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', }}>
                <Icon name="left" size={22} color="gray" style={{marginLeft: 20, marginRight: 15}} onPress={() => props.navigation.goBack() } />
                {/* <Icon name="sharealt" size={22} color="gray" style={{marginRight: 20}} /> */}
            </View>
            {pageLoading ? 
            <View style={{justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%'}}>
                <MaterialIndicator color="red" /> 
            </View>
            : null}
            <WebView
            originWhitelist={['*']}
            source={{uri: action}}
            allowsInlineMediaPlayback={true}
            onLoadStart={() => setPageLoading(true)}
            onLoadEnd={() => setPageLoading(false)}
            />
            {withoutAds ? null : <AdBanner />}
        </SafeAreaView>
    )
}

Tab4Detail.navigationOptions = ( { } ) => ({
    headerShown: false,
});

const styles = StyleSheet.create({
    underline: {
        borderBottomColor: 'lightgray', borderBottomWidth: 1, width: '100%', marginBottom: 20
    }
});

export default Tab4Detail;