import React from 'react'
import { SafeAreaView , View, Text, StyleSheet, TouchableOpacity, Dimensions, Platform} from 'react-native';
import { useIntl } from 'react-intl'

import AdBanner from './subcomponents/AdBanner';
import RecordingsList from './subcomponents/RecordingsList';

const window = Dimensions.get('window');
const width = window.width;
const height = window.height;

export default function Tab3Main(props){

    const { formatMessage: tr } = useIntl();

    return(
        <SafeAreaView style={{flex: 1}}> 
            <View style={{flexDirection: 'row', justifyContent: 'space-between', height: 30, marginTop: 15, marginBottom: 10}}>
                <Text style={styles.headerText}>
                    {tr({id: 'TAB_3_HEADER'})}<Text style={{color: 'red'}}>.</Text>
                </Text>
            </View>

            <RecordingsList navProps={props} />
            <AdBanner />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    headerText: {
        marginLeft: 25,
        fontSize: width * 0.055, 
        fontWeight: 'bold'
    },
})