import React, { useEffect, useState, useCallback } from 'react';
import { SafeAreaView, TextInput , View, Text, StyleSheet, ScrollView, TouchableOpacity, Keyboard, Dimensions, Platform} from 'react-native';
import { useIntl } from 'react-intl'
import Icon from 'react-native-vector-icons/AntDesign';
import Icon2 from 'react-native-vector-icons/FontAwesome';
import { MaterialIndicator } from 'react-native-indicators';
import AsyncStorage from '@react-native-community/async-storage';
import Tag from './subcomponents/smallercomponents/Tag'
import serverUrl from '../constants/serverLocation';
import YoutubePane from './subcomponents/YoutubePane';
import InfiniteFlatList from './subcomponents/InfiniteFlatList';
import AdBanner from './subcomponents/AdBanner';
import shuffleArray from './logics/shuffleArray'

const window = Dimensions.get('window');
const width = window.width;

type resultType = {
    id: number;
    title: string;
    youtubeKey: string;
    speaker: string;
    keywords: string | Array<string>;
}

function Tab2Main ( props: any ){
    const { formatMessage: tr } = useIntl();

    const [ inputValue, setInputValue ] = useState('')
    const [ inputEditing, setInputEditing ] = useState(false)
    const [ searchHistoryList, setSearchHistoryList ] = useState([]);

    const [ selectedKeywords, setSelectedKeywords ] = useState<string[]>([]);
    const [ monologueSelected, setMonologueSelected ] = useState(false)
    const [ dialogueSelected, setDialogueSelected ] = useState(false)
    const [ maleSelected, setMaleSelected ] = useState(false);
    const [ femaleSelected, setFemaleSelected ] = useState(false);
    const [ teenSelected, setTeenSelected ] = useState(false);
    const [ youngSelected, setYoungSelected ] = useState(false);
    const [ middleSelected, setMiddleSelected ] = useState(false);

    const [ speakerList, setSpeakerList ] = useState<Array<string>[]>([]);

    const getAsyncSearchHistoryData = async () => {
        try {
            let value = await AsyncStorage.getItem('searchHistory')
            if(value === null) {setSearchHistoryList([])}
            else setSearchHistoryList(JSON.parse(value).historyArr)
        } catch(e) {
            console.log(e)
        }
    }
    
    const setAsyncSearchHistoryData = async (searched: string) => {
        try {
            searchHistoryList.push(searched);
            let obj = { historyArr: searchHistoryList }
            await AsyncStorage.setItem('searchHistory', JSON.stringify(obj))
            getAsyncSearchHistoryData();
        } catch(e) {
            console.log(e)
        }
    }
 
    const deleteAsyncSearchHistoryData = async () => {
        try {
            await AsyncStorage.removeItem('searchHistory')
            getAsyncSearchHistoryData();
        } catch(e) {
            console.log(e)
          }
    }

    let initialUrl = serverUrl + "/search/all?"

    const renderItem = (item: resultType, index: number) => {
        return(
            <>
            <YoutubePane navProps={props} id={item.id} title={item.title} youtubeKey={item.youtubeKey} speaker={item.speaker} />
            {/* {index % 4 === 0 ? <AdBanner key={index} /> : null} */}
            </>
        )
    }

    const handleKeywordsReset = useCallback( () => {
        setTeenSelected(false);
        setYoungSelected(false);
        setMiddleSelected(false);

        setDialogueSelected(false); 
        setMonologueSelected(false); 
        setMaleSelected(false); 
        setFemaleSelected(false);

        setSelectedKeywords([]);
    },[])

    const handleKeywordsSelect = useCallback((keyword, checked) => {
        let nextSelectedKeywords = [...selectedKeywords];
        if(keyword === 'teen'){
            if(youngSelected || middleSelected) {
                setYoungSelected(false)
                setMiddleSelected(false)
                nextSelectedKeywords = selectedKeywords.filter(k => !(k === 'young' || k === 'middle'))
            }
            setTeenSelected(checked)
        } else if(keyword === 'young'){
            if(teenSelected || middleSelected) {
                setTeenSelected(false)
                setMiddleSelected(false)
                nextSelectedKeywords = selectedKeywords.filter(k => !(k === 'teen' || k === 'middle'))
            }
            setYoungSelected(checked)
        } else if(keyword === 'middle'){
            if(teenSelected || youngSelected) {
                setTeenSelected(false)
                setYoungSelected(false)
                nextSelectedKeywords = selectedKeywords.filter(k => !(k === 'teen' || k === 'young'))
            }
            setMiddleSelected(checked)
        } else if(keyword === 'monologue'){
            if(dialogueSelected){
                setDialogueSelected(false)
                nextSelectedKeywords = selectedKeywords.filter(k => k !== 'dialogue')
            }
            setMonologueSelected(true)
        } else if(keyword === 'dialogue'){
            if(monologueSelected){
                setMonologueSelected(false)
                nextSelectedKeywords = selectedKeywords.filter(k => k !== 'monologue')
            }
            setDialogueSelected(true)
        } else if(keyword === 'male'){
            if(femaleSelected){
                setFemaleSelected(false)
                nextSelectedKeywords = selectedKeywords.filter(k => k !== 'female')
            }
            setMaleSelected(true)
        } else if(keyword === 'female'){
            if(maleSelected){
                setMaleSelected(false)
                nextSelectedKeywords = selectedKeywords.filter(k => k !== 'male')
            }
            setFemaleSelected(true)
        }
        nextSelectedKeywords = checked ? [...nextSelectedKeywords, keyword] : selectedKeywords.filter(k => k !== keyword);
        // nextSelectedKeywords = checked ? [...selectedKeywords, keyword] : selectedKeywords.filter(k => k !== keyword);
        // console.log('You are interested in: ', nextSelectedKeywords);
        setSelectedKeywords(nextSelectedKeywords);
    },[selectedKeywords, monologueSelected, dialogueSelected, maleSelected, femaleSelected, teenSelected, youngSelected, middleSelected])

    const onSearch = useCallback( ( selected , searched: string | null ) => {
        if(searched !== null){
            setAsyncSearchHistoryData(searched)
            setInputValue('')
        }
        handleKeywordsReset()
        setSelectedKeywords([]);
        props.navigation.push('Tab2Sub' , {
            keywords: selected,
            search: searched
        })
        setInputEditing(false);
    },[monologueSelected, dialogueSelected, maleSelected, femaleSelected, teenSelected, youngSelected, middleSelected])
    
    const renderHeader = () => (
        <>
        <View style={{width: '100%', backgroundColor: 'white', padding: 10, justifyContent: 'center'}}>
            <View style={{alignItems: 'center'}}>
                <Text style={{fontSize: width * 0.055, fontWeight: 'bold', marginBottom: 5}}>
                    {tr({id: 'TAB_2_ASK'})}
                </Text>
            </View>
            
            <View style={styles.TagsAge}>
                <View style={{marginRight: 15}} />
                <TouchableOpacity activeOpacity={.7} onPress={() => handleKeywordsSelect('teen', !teenSelected)}>
                    <Tag age={tr({id: 'TAB_2_TEEN'})} selected={teenSelected} />
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={.7} onPress={() => handleKeywordsSelect('young', !youngSelected)}>
                    <Tag age={tr({id: 'TAB_2_YOUNG'})} selected={youngSelected} />
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={.7} onPress={() => handleKeywordsSelect('middle', !middleSelected)}>
                    <Tag age={tr({id: 'TAB_2_MIDDLE'})} selected={middleSelected} />
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={.7} onPress={handleKeywordsReset} >
                    <Icon name="close" size={20} style={{color: 'gray'}} />
                </TouchableOpacity>
            </View>
            <View style={styles.TagsOthers}>
                <TouchableOpacity activeOpacity={.7} onPress={() => handleKeywordsSelect('monologue', !monologueSelected)}>
                    <Tag type="Monologue" selected={monologueSelected} />
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={.7} onPress={() => handleKeywordsSelect('dialogue', !dialogueSelected)}>
                    <Tag type="Dialogue" selected={dialogueSelected}  />
                </TouchableOpacity>

                <View style={{width:1, height: 40, backgroundColor: 'lightgray', marginLeft:10, marginRight: 20}} />

                <TouchableOpacity activeOpacity={.7} onPress={() => handleKeywordsSelect('male', !maleSelected)}>
                    <Tag gender="Male" selected={maleSelected} />
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={.7} onPress={() => handleKeywordsSelect('female', !femaleSelected)}>
                    <Tag gender="Female" selected={femaleSelected} />
                </TouchableOpacity>
            
            </View>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <TouchableOpacity activeOpacity={.7} onPress={() => onSearch(selectedKeywords, null)} style={styles.searchButton}>
                    <Text style={[{color: 'white', fontSize: width * 0.045}, Platform.OS == 'android' ? {marginTop: -2} : null]}>
                        {tr({id: 'SEARCH_BUTTON'})}
                    </Text>
                    <Icon name="arrowright" size={20} color="white" style={{position: 'absolute', right: 20}} />
                </TouchableOpacity>
            </View>

        </View>
        <View style={{marginBottom: 10}}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {speakerList.map((v, index) => (
                    <TouchableOpacity key={index} style={styles.speakerHorizontalList} onPress={() => props.navigation.push('Tab2Sub' , {
                        searchWithoutSpace: v
                    })}>
                        <Text>
                            {v}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
        </>
    )

    useEffect(() => {
        let speakerSet = new Set();
        fetch(serverUrl + `/search/all/speakers`)
        .then((res) => res.json())
        .then((res) => { 
            res.data.map(v => {
                if(v.speaker.includes(', ')){
                    v.speaker.split(', ').map(v => speakerSet.add(v))
                } else speakerSet.add(v.speaker)
            })
            setSpeakerList(shuffleArray(Array.from(speakerSet)))
        })
        .catch((err) => console.log(err));
    },[])

    return(
        <SafeAreaView style={{flex: 1}} >
            <View style={{flex: 1, backgroundColor: 'white'}}>
                <View style={styles.topBar} >
                    {
                        inputEditing 
                        ?
                        <Icon name="left" size={24} color="black" style={{marginLeft: 10, marginRight: 15}} onPress={() => { setInputEditing(false); Keyboard.dismiss();} } />
                        :
                        <Icon name="search1" size={24} color="black" style={{marginLeft: 10, marginRight: 15}} />
                    }

                    <TextInput
                    style={{flex:1, width: '100%', height: 45, backgroundColor: 'white'}}
                    maxLength={20}
                    onChangeText={text => setInputValue(text)}
                    value={inputValue}
                    placeholder={tr({id: 'TAB_2_PLACEHOLDER'})}
                    underlineColorAndroid="transparent"
                    clearButtonMode={'while-editing'}
                    onSubmitEditing = {() => { onSearch(null, inputValue) }}
                    onTouchStart={() => { setInputEditing(true); getAsyncSearchHistoryData();}}
                    />
                </View>
                <View style={{width: '100%', flex: 1}}>
                    <InfiniteFlatList
                    fetchUrl={initialUrl}
                    renderItem={renderItem}
                    renderFlatListHeader={renderHeader}
                    />
                    {
                        inputEditing ?
                        <ScrollView style={{flex: 1, position: 'absolute', width: '100%', height: '100%', backgroundColor: '#f5f5f5'}}>
                            <View style={{width: '100%', height: '100%', alignItems: 'center'}} >
                                {searchHistoryList !== undefined ? 
                                    <>
                                    { searchHistoryList.slice(0).reverse().map((v, index) => {
                                        if(index < 5) {
                                            return ( 
                                            <TouchableOpacity activeOpacity={.8} key={index} style={styles.searchHistoryInline} onPress={() => onSearch(null, v)}>
                                                <Icon2 name="history" size={18} color="gray" style={{position: 'absolute', left: 20}} />
                                                <Text style={{fontSize: width*0.045}}>{v}</Text>
                                            </TouchableOpacity> )
                                        } else return null;
                                    }) }
                                    <TouchableOpacity activeOpacity={.8} style={styles.searchHistoryInline} onPress={() => deleteAsyncSearchHistoryData()}>
                                        <Icon name="delete" size={18} color="red" style={{position: 'absolute', left: 20}} />
                                        <Text style={{color: 'red', fontSize: width*0.045}}>Clear History</Text>
                                    </TouchableOpacity>
                                    </>
                                : null}
                            </View>
                        </ScrollView> 
                        :
                        null
                    }
                </View>
            </View>
            <AdBanner />
        </SafeAreaView>
    )
}

Tab2Main.navigationOptions = ( { } ) => ({
    headerShown: false,
});

const styles = StyleSheet.create({
    videoList:{
        width :'100%',
        height : 200,
        borderWidth: 0.5,
        borderColor: '#d6d7da',
        backgroundColor : 'gray'
    },
    keyword: {
        backgroundColor: '#ffffff', 
        borderRadius: 5, 
        borderColor: 'lightgray', 
        borderWidth:1, 
        height: 30, 
        marginRight: 10, 
        justifyContent: 'center', 
        paddingLeft: 10,
        paddingRight: 10
    },
    trendingKeywordsTable: {
        borderColor: 'lightgray', 
        borderBottomWidth:1, 
        height: 28, 
        justifyContent: 'center', 
        padding: 5, 
        backgroundColor: 'white'
    },
    TagsAge: {
        marginLeft: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    TagsOthers: {
        flexDirection: 'row', 
        alignItems: 'center',
        justifyContent: 'center'
    },
    searchButton: {
        borderRadius: 8,
        backgroundColor: 'dodgerblue',
        width: '80%',
        height: 35,
        marginTop: 5,
        marginBottom: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    topBar: {
        backgroundColor: 'white', 
        borderColor: 'lightgray', 
        borderBottomWidth: 1, 
        flexDirection: 'row', 
        alignItems: 'center', 
        padding: 5, 
        height: 55
    },
    searchHistoryInline: {
        flexDirection: 'row', 
        backgroundColor: 'white', 
        width: '100%', height: 45, 
        paddingLeft: 50, 
        borderBottomColor: 'lightgray', 
        borderBottomWidth: 1, 
        alignItems: 'center'
    },
    speakerHorizontalList: {
        borderRadius: 10,
        backgroundColor: '#f8f8f8',
        paddingVertical: 5,
        paddingHorizontal: 7,
        borderColor: '#e8e8e8',
        borderWidth: 1,
        marginLeft: 10,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default Tab2Main;