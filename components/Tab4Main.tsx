import React, { useEffect, useState, useCallback } from 'react';
import { Animated, ImageBackground, View, Text, StyleSheet, Image , ScrollView, TouchableOpacity, SafeAreaView, FlatList, Platform, Dimensions } from 'react-native';
import { useIntl, injectIntl } from 'react-intl'
import AdBanner from './subcomponents/AdBanner';
import Icon from 'react-native-vector-icons/AntDesign';
import Modal from 'react-native-modal'
import { useSelector, useDispatch } from 'react-redux'
import { setColorSettingAction } from '../redux/setting'
import serverUrl from '../constants/serverLocation';

const window = Dimensions.get('window');
const width = window.width;
const height = window.height;

type materialListType = {
    id: number;
    title: number
    action: string;
    coverImg: string;
    description: string;
}

function Tab4Main ( props: any ){
    const setting = useSelector((state: any) => state.setting)

    const dispatch = useDispatch();
    const onColorSetting = useCallback((colorCode: string) => dispatch(setColorSettingAction(colorCode)),[dispatch])

    const { formatMessage: tr } = useIntl();

    const [ materialList, setMateriallist ] = useState<materialListType[]>([])

    const [ showOneBook, setShowOneBook ] = useState(false);
    const [ showSetting, setShowSetting ] = useState(false);
    const [ showSettingIcon, setShowSettingIcon ] = useState(true)

    const [ modalImage, setModalImage ] = useState('');
    const [ modalTitle, setModalTitle ] = useState('');
    const [ modalDescription, setModalDescription ] = useState('');
    const [ modalAction, setModalAction ] = useState('');

    useEffect(() => {
        let wordBook = {
            id: 0,
            coverImg: 'https://i.imgur.com/jeK3xkG.png',
        }
        fetch(serverUrl + `/materials?lang=${setting.language}`)
        .then((res) => res.json())
        .then((res) => setMateriallist([wordBook, ...res.data]))
        .catch((err) => console.log(err));
    },[])

    const renderBook = (item: any) => {
        if(item.id == 0){
            return(
                <TouchableOpacity activeOpacity={.9} style={{flex:1 , alignItems: 'center', justifyContent: 'center'}}
                onPress={() => {props.navigation.push('WordBook')}
                }>
                    <Image source={{uri: item.coverImg}} style={{width: height * 0.12, height: height * 0.16, marginBottom: 45}} />
                </TouchableOpacity>
            )
        } else if (item.id == null){
            return (<View style={{flex: 1}} ></View>)
        } else {
            return(
            <TouchableOpacity activeOpacity={.9} style={{flex:1 , alignItems: 'center', justifyContent: 'center'}}
            onPress={() => {
                setShowOneBook(true)
                setModalImage(item.coverImg);
                setModalTitle(item.title);
                setModalDescription(item.description);
                setModalAction(item.action);
                setShowSettingIcon(false)
            }
            }>
                <Image source={{uri: item.coverImg}} style={{width: height * 0.12, height: height * 0.16, marginBottom: 45}} />
            </TouchableOpacity>
            )
        }
    }

    const goToDetail = useCallback(() => {
        setShowOneBook(false); 
        props.navigation.push('Tab4Detail', {
            action: modalAction
        })
        setShowSettingIcon(true);
    },[modalAction])

    const hideOneBook = useCallback(() => {
        setShowOneBook(false);
        setShowSettingIcon(true);
    },[])

    const handleColor = useCallback( (colorCode: string) => {
        onColorSetting(colorCode)
        setShowSetting(false)
    },[])

    const colorCircleComponent = (colorCode: string) => (
        <TouchableOpacity onPress={() => handleColor(colorCode)}>
            <View style={[styles.colorSettingCircle, {backgroundColor: colorCode}]} />
        </TouchableOpacity>
    )

    return(
        <View style={{backgroundColor: setting.bookshelfColor, flex: 1}}>
            <SafeAreaView style={{flex: 1}}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', height: 30, marginTop: 15, marginBottom: height * 0.05}}>
                    <Text style={styles.headerText}>
                        {tr({id: 'TAB_4_HEADER'})}<Text style={{color: 'red'}}>.</Text>
                    </Text>
                    {
                        showSettingIcon ?
                        <TouchableOpacity onPress={() => setShowSetting(true)} style={{marginRight: 20}} >
                            <Icon name="ellipsis1" size={26} color="black" />
                        </TouchableOpacity>
                        :
                        <View />
                    }
                </View>
                <View>
                    <View style={{paddingLeft: 10, paddingRight: 10, width: '100%', position: 'absolute', zIndex: 10}}>
                        <FlatList
                        data={materialList.length % 3 == 1 ? [...materialList, {id: null}, {id: null}] : materialList.length % 3 == 2 ? [...materialList, {id: null}] : materialList }
                        renderItem={({ item }) => renderBook(item)}
                        keyExtractor={(item, index) => index.toString()}
                        numColumns={3}
                        horizontal={false}
                        scrollEnabled={false}
                        // style={Platform.OS === 'ios' ? {marginTop: 50} : {marginTop: 0}}
                        />
                    </View> 

                    <View style={{width: '100%', height: height * 0.15}}>
                        <Image source={require('../images/shadow_upper.png')} style={{width: '100%', position: 'absolute', bottom: 0}} />
                    </View>
                    <Image source={require('../images/ashelf.png')} style={{width: '100%'}} />
                    <Image source={require('../images/shadow_under.png')} style={{width: '100%'}} />


                    <View style={{width: '100%', height: height * 0.15}}>
                        <Image source={require('../images/shadow_upper.png')} style={{width: '100%', position: 'absolute', bottom: 0}} />
                    </View>
                    <Image source={require('../images/ashelf.png')} style={{width: '100%'}} />
                    <Image source={require('../images/shadow_under.png')} style={{width: '100%'}} />

                    <View style={{width: '100%', height: height * 0.15}}>
                        <Image source={require('../images/shadow_upper.png')} style={{width: '100%', position: 'absolute', bottom: 0}} />
                    </View>
                    <Image source={require('../images/ashelf.png')} style={{width: '100%'}} />
                    <Image source={require('../images/shadow_under.png')} style={{width: '100%'}} />
                </View>
            </SafeAreaView>


            <Modal 
            isVisible={showSetting} 
            coverScreen 
            hasBackdrop
            useNativeDriver = {true} //{Platform.OS === 'ios' ? false : true } 
            //hideModalContentWhileAnimating 
            onBackdropPress={() => setShowSetting(false)} style={{margin: 0}} 
            onBackButtonPress={() => setShowSetting(false)}
            //swipeDirection="down"
            //onSwipeComplete={() => setShowSetting(false)}
            >
                <View style={{ backgroundColor: 'white', position: 'absolute', width: '100%', height: height * 0.27, bottom: 0, borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 20, flex: 1}}>
                    {/* <View style={{justifyContent: 'center', alignItems: 'center'}}>
                        <View style={{width: 60, borderBottomColor: 'lightgray', borderBottomWidth: 7, borderRadius: 20}} />
                    </View> */}
                    <Text style={{fontSize: width * 0.055, fontWeight: 'bold', marginLeft: 10, marginTop: 10, marginBottom: 15}}>
                        {tr({id: 'TAB_4_MODAL'})}
                    </Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {colorCircleComponent('white')}
                        {colorCircleComponent('lavenderblush')}
                        {colorCircleComponent('aliceblue')}
                        {colorCircleComponent('honeydew')}
                        {colorCircleComponent('floralwhite')}
                        {colorCircleComponent('mistyrose')}
                        {colorCircleComponent('lavender')}
                        {colorCircleComponent('azure')}
                        {colorCircleComponent('#FFE9F6')}
                        {colorCircleComponent('lightgray')}
                    </ScrollView>
                </View>
            </Modal>


            <Modal
            isVisible={showOneBook}
            useNativeDriver = {Platform.OS === 'ios' ? false : true }
            backdropColor="white"
            backdropOpacity={0.8}
            animationIn="zoomIn"
            animationOut="zoomOut"
            animationInTiming={600}
            animationOutTiming={600}
            backdropTransitionInTiming={600}
            backdropTransitionOutTiming={600}
            onBackdropPress={hideOneBook}
            onBackButtonPress={hideOneBook}
            >
                <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                        <View style={{flex: 1}} />
                        <TouchableOpacity 
                        style={{marginBottom: 20}}
                        onPress={() => {
                            setShowOneBook(false);
                            setShowSettingIcon(true);
                        }}>
                            <Icon name="close" size={35} />
                        </TouchableOpacity>
                    </View>
                    <Image source={{uri: modalImage}} style={{width: width * 0.6, height: width * 0.8}} />
                    <View style={{minHeight: height * 0.12}}>
                        <Text style={{fontSize: 26, margin: 10 , textAlign: 'center', fontWeight: 'bold'}}>
                            {modalTitle}
                        </Text>
                        <Text style={{color: 'gray', fontSize: 18, textAlign: 'center'}}>
                            {modalDescription}
                        </Text>
                    </View>
                    <TouchableOpacity activeOpacity={.8} style={styles.button} onPress={goToDetail}>
                        <Text style={{color: 'white'}}>{tr({id: 'TAB_4_GO_DETAIL'})}</Text>
                    </TouchableOpacity>
                </SafeAreaView>
            </Modal>
            <AdBanner />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",

    },
    headerText: {
        marginLeft: 25,
        fontSize: width * 0.055, 
        fontWeight: 'bold'
    },
    button: {
        width: '70%', height: 40, 
        backgroundColor: 'dodgerblue', 
        alignItems: 'center', justifyContent: 'center', 
        borderRadius: 10, borderWidth: 1, borderColor: 'white',
        margin: 20, marginBottom: 80
    },
    colorSettingCircle: {
        margin: 5,
        borderRadius: 50, width: 50, height: 50, 
        borderWidth: 1, borderColor: 'lightgray'
    }
})

Tab4Main.navigationOptions = ( { } ) => ({
});

export default Tab4Main;