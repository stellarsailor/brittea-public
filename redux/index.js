import { combineReducers } from 'redux';
import userInfo from './userInfo'
import setting from './setting'

const rootReducer = combineReducers({
    userInfo,
    setting
})

export default rootReducer;
