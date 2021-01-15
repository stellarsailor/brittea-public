import React, { useCallback, useState, useEffect } from 'react'
import { View, Text, Dimensions, RefreshControl, ScrollView } from 'react-native'
import FastImage from 'react-native-fast-image'
import RecordingPane from './RecordingPane';
import { useIntl } from 'react-intl'

var RNFS = require('react-native-fs');
const window = Dimensions.get('window');
const width = window.width;
const height = window.height;

type recordingFileType = {
    id: string;
    sequence: Array<string>;
}

export default function RecordingsList(props: any) {
    const { formatMessage: tr } = useIntl();

    const [ recordingsList, setRecordingsList ] = useState<recordingFileType>([])
    const [ player, setPlayer ] = useState<Player | null>(null);
    const [ refreshing, setRefreshing ] = useState(false);
    const [ blockingOthers, setBlockingOthers ] = useState(false);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        handleRefresh();
        setTimeout(() => {
            setRefreshing(false)
        }, 1000);
    }, [refreshing]);

    const loadRecordingsList = () => {
        RNFS.readDir(RNFS.DocumentDirectoryPath + '/Recordings') 
        .then((result: any) => {
            // let after = result.map((v) => v.name.substring(0,13) )
            // console.log(after)

            // const format = (arr: any) => {
            //     Object.entries(
            //     arr.reduce((acc, n) => {
            //         const [_, key, digits] = /(.+)(\d{2})/.exec(n);
            //         return { ...acc, [key]: [...(key in acc ? acc[key] : []), digits] };
            //     }, {}))
            //     .map( ([id, sequence]) => ({ id, sequence }) );
            // }
            // console.log(JSON.stringify(format(after), undefined, 2));

            let keys = new Set();
            result.map( (v: any) => keys.add(v.name.substring(0,11)) )
            let keySetArr = Array.from(keys)

            let uniqueObj = result.reduce( (r: any, a: any) => {
                r[a.name.substring(0,11)] = r[a.name.substring(0,11)] || [];
                r[a.name.substring(0,11)].push(a.name.substring(11,13));
                return r;
            }, Object.create(null))

            let objArr: Array<recordingFileType> = []
            keySetArr.map( (k: any) => {
                objArr.push(
                    {
                        id : k, 
                        sequence: uniqueObj[k].sort() 
                    }
                )
            })
            // console.log(objArr)
            setRecordingsList(objArr)
        })
        .catch((err: any) => {
            console.log(err.message, err.code);
        });
    }
  
    useEffect(() => {
        loadRecordingsList()
    },[])

    const handleRefresh = useCallback( () => {
        loadRecordingsList()
    },[])


    return (
        <View style={{flex: 1}}>
            {
                recordingsList.length === 0 ?
                <ScrollView
                refreshControl={ <RefreshControl refreshing={refreshing} onRefresh={onRefresh} /> }
                contentContainerStyle={{paddingHorizontal: '5%', height: '100%'}} 
                >
                    <View style={{justifyContent: 'center', alignItems: 'center', height: '100%'}}>
                        <FastImage source={require('../../images/empty.png')} style={{width: 80, height: 90}} />
                        <Text style={{textAlign: 'center', fontSize: 12, color: 'gray', position: 'absolute', bottom: 20}}>
                            {tr({id: 'TAB_1_REFRESH_ASK'})}
                        </Text>
                    </View>
                </ScrollView>
                :
                <ScrollView
                refreshControl={ <RefreshControl refreshing={refreshing} onRefresh={onRefresh} /> }
                contentContainerStyle={{paddingHorizontal: '5%'}} 
                >
                    {recordingsList.map((v: recordingFileType) => (
                        <RecordingPane key={v.id} videoKey={v.id} sequence={v.sequence} navProps={props.navProps} handleRefresh={handleRefresh} blockingOthers={blockingOthers} setBlockingOthers={setBlockingOthers} />
                    ))}
                    <Text style={{textAlign: 'center', fontSize: 12, color: 'gray', marginVertical
                    : 20}}>
                        {tr({id: 'TAB_1_REFRESH_ASK'})}
                    </Text>
                </ScrollView>
            }       
        </View>
    )
}
