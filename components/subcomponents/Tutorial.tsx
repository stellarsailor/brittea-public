import React from 'react'
import { View, Text, Dimensions, StyleSheet, Image, TouchableOpacity } from 'react-native';
import ViewPager from '@react-native-community/viewpager';
import { useIntl } from 'react-intl'
import Icon from 'react-native-vector-icons/AntDesign';
import FastImage from 'react-native-fast-image';

const window = Dimensions.get('window');
const width = window.width;
const height = window.height;

export default function Tutorial(props) {
    const { formatMessage: tr } = useIntl();

    const { setFirstTime } = props;

    return (
    <ViewPager style={{flex: 1, width: '100%', height: '100%'}} initialPage={0}>
        <View key="1" style={styles.pager}>
            <View style={styles.triangle} />
            <View style={styles.textPart}>
                <Text style={styles.titleBox}>WELCOME!</Text>
                <Text style={styles.instructionBox}>{tr({id: 'TUTORIAL_1'})}</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
                <View style={[styles.circle, {backgroundColor: 'red'}]} />
                <View style={styles.blocks4} />
            </View>
            <Image source={require('../../images/tutorial1.png')} style={{width: 500, height: height * 0.8, resizeMode: 'contain', marginBottom: - height * 1/2}} />
            
        </View>
        <View key="2" style={styles.pager}>
            <View style={styles.triangle} />
            <View style={styles.textPart}>
                <Text style={styles.titleBox}>Self-Feedback</Text>
                <Text style={styles.instructionBox}>{tr({id: 'TUTORIAL_2'})}</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
                <View style={styles.blocks1} />
                <View style={[styles.circle, {backgroundColor: 'red'}]} />
                <View style={styles.blocks3} />
            </View>
            <Image source={require('../../images/tutorial2.png')} style={{width: 500, height: height * 0.8, resizeMode: 'contain', marginBottom: - height * 1/2}} />
        </View>
        <View key="3" style={styles.pager}>
            <View style={styles.triangle} />
            <View style={styles.textPart}>
                <Text style={styles.titleBox}>Bespoke</Text>
                <Text style={styles.instructionBox}>{tr({id: 'TUTORIAL_3'})}</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
                <View style={styles.blocks2} />
                <View style={[styles.circle, {backgroundColor: 'red'}]} />
                <View style={styles.blocks2} />
            </View>
            <Image source={require('../../images/tutorial3.png')} style={{width: 500, height: height * 0.8, resizeMode: 'contain', marginBottom: - height * 1/2}} />
        </View>
        <View key="4" style={styles.pager}>
            <View style={styles.triangle} />
            <View style={styles.textPart}>
                <Text style={styles.titleBox}>Simple & Easy</Text>
                <Text style={styles.instructionBox}>{tr({id: 'TUTORIAL_4'})}</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
                <View style={styles.blocks3} />
                <View style={[styles.circle, {backgroundColor: 'red'}]} />
                <View style={styles.blocks1} />
            </View>
            <Image source={require('../../images/tutorial4.png')} style={{width: 500, height: height * 0.8, resizeMode: 'contain', marginBottom: - height * 1/2}} />
        </View>
        <View key="5" style={styles.pager}>
            <View style={[styles.textPart, {height: '100%'}]}>
                <FastImage source={require('../../images/britteaicon.png')} style={{width: 100, height: 100, justifyContent: 'center', alignItems: 'center'}} />
                <Text style={[styles.instructionBox, {fontWeight: 'bold'}]}>Would you fancy a cup of tea? {'\n'}{'\n'} <Text style={{fontWeight: 'normal'}}>{tr({id: 'TUTORIAL_5'})}</Text></Text>
                <TouchableOpacity style={styles.startButton} onPress={() => setFirstTime(false)}>
                    <Text style={{color: 'white', fontWeight: 'bold'}}>Of Course!</Text>
                </TouchableOpacity>
            </View>
            <View style={{flexDirection: 'row'}}>
                <View style={styles.blocks4} />
                <View style={[styles.circle, {backgroundColor: 'red'}]} />
            </View>
        </View>
        
    </ViewPager>
    )
}

const styles = StyleSheet.create({
    pager: {
        flex: 1, 
        backgroundColor: 'white', 
        alignItems: 'center'
    },
    triangle: {  
        position: 'absolute',
        width: 0,
        height: 0,
        borderLeftWidth: width,
        borderBottomWidth: height,
        borderStyle: 'solid',
        backgroundColor: 'transparent',
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: '#FBFBFB'
    },
    textPart: {
        paddingHorizontal: 20, 
        alignItems: 'center', 
        justifyContent: 'center',
        height: height * 1/3, 
    },
    titleBox: {
        marginTop: 50,
        color: 'red', 
        fontSize: 30,
        fontWeight: 'bold'
    },
    instructionBox: {
        marginTop: 20,
        marginBottom: 20,
        color: 'black', 
        fontSize: 20, 
        textAlign: 'center',
    },
    circle: {
        width: 10, height: 7, borderRadius: 7,
        marginHorizontal: 5,
        marginVertical: 10
    },
    blocks4: {
        backgroundColor: 'lightgray', width: 55, height: 7, borderRadius: 7, marginVertical: 10
    },
    blocks3: {
        backgroundColor: 'lightgray', width: 40, height: 7, borderRadius: 7, marginVertical: 10
    },
    blocks2: {
        backgroundColor: 'lightgray', width: 25, height: 7, borderRadius: 7, marginVertical: 10
    },
    blocks1: {
        backgroundColor: 'lightgray', width: 10, height: 7, borderRadius: 7, marginVertical: 10
    },
    startButton: {
        borderRadius: 8,
        backgroundColor: 'dodgerblue',
        width: width * 0.8,
        height: 40,
        marginTop: 30,
        marginBottom: 5,
        justifyContent: 'center',
        alignItems: 'center'
    }
})