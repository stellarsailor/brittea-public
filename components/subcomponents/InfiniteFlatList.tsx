import React, { useEffect, useState, useCallback } from 'react';
import { FlatList, Dimensions, View } from 'react-native';
import { MaterialIndicator } from 'react-native-indicators';
import FastImage from 'react-native-fast-image'
import shuffleArray from '../logics/shuffleArray'

const window = Dimensions.get('window');
const width = window.width;
const height = window.height;

type FlatListProps = {
    dataType?: any;
    fetchUrl: string;
    renderItem: any;
    renderFlatListHeader?: any ;
}

export default function InfiniteFlatList(props: FlatListProps) {
    
    const { dataType, fetchUrl, renderItem, renderFlatListHeader } = props

    // const [ dataReRenderToggle, setDataReRenderToggle] = useState(false);
    const [ dataSet, setDataSet ] = useState([])
    const [ hasMore, setHasMore ] = useState(true); //changed to false when data is 0 
    const [ loading, setLoading ] = useState(false);
    const [ page, setPage ] = useState(0);

    const [ onEndReachedCalledDuringMomentum, setOnEndReachedCalledDuringMomentum ] = useState(true)
    const [ refreshing, setRefreshing ] = useState(false);

    useEffect( () => {
        fetchData(0)
    },[])

    const fetchData = useCallback( (page) => {
        setLoading(true)
        setTimeout(() => {
            let url = fetchUrl + `&page=${page}`
            console.log(url + '--fetched');
            fetch(url) 
            .then((res) => res.json())
            .then((res) => {
                //console.log('기존 값' + dataSet.map(v => v.id))
                if(res.data.length !== 0){
                    setLoading(false)
                    setHasMore(true);
                    if(page === 0){
                        setDataSet(shuffleArray(res.data))
                        setPage(page + 1)
                    } else {
                        setDataSet([...dataSet, ...shuffleArray(res.data)])
                        setPage(page + 1)
                    }
                } else {
                    console.log('no data')
                    setLoading(false)
                    setHasMore(false);
                }
            })
            .catch((err) => console.log(err));
        }, 300);
    },[dataSet])
    
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchData(0);
        setTimeout(() => {
            setRefreshing(false)
        }, 1000);
    }, []);

    const onMomentumScrollBegin = useCallback( () => {
        setOnEndReachedCalledDuringMomentum(false)
    },[onEndReachedCalledDuringMomentum])

    const onEndReached = useCallback( () => {
        // console.log(!onEndReachedCalledDuringMomentum)
        // console.log(hasMore)
        // console.log(!loading)
        if (!onEndReachedCalledDuringMomentum && hasMore && !loading) {
            console.log('next fetch requested')
            fetchData(page);
            setOnEndReachedCalledDuringMomentum(true);
        }
    },[onEndReachedCalledDuringMomentum, hasMore, loading, page])

    return(
        <FlatList 
        data={dataSet}
        //extraData={loading}
        renderItem={({item, index}) => renderItem(item, index)}
        keyExtractor={(dataSet) => dataSet.id.toString()}
        onRefresh={onRefresh}
        refreshing={refreshing}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.1}
        onMomentumScrollBegin={onMomentumScrollBegin}
        ListHeaderComponent={renderFlatListHeader}
        ListFooterComponent={ loading ? <MaterialIndicator color="red" style={{margin: 20, height: height * 1/2}} /> : null}
        ListEmptyComponent={ loading ? null : 
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', height: height * 1/2}}>
            <FastImage source={require('../../images/empty.png')} style={{width: 80, height: 90}} />
        </View>}
        />
    )
}

