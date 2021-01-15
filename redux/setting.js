import setAsyncData from '../components/logics/setAsync'
import defaultLang from '../components/logics/getDefaultLanguage'

const GET_SETTING_TYPE = 'GET_SETTING'
const SET_COLOR_SETTING_TYPE = 'SET_COLOR_SETTING_TYPE'
const SET_LANG_SETTING_TYPE = 'SET_LANG_SETTING_TYPE'
const SET_ROLE_MODEL_TYPE = 'SET_ROLE_MODEL_TYPE'
const HANDLE_REPEAT_MODE_TYPE = 'HANDLE_REPEAT_MODE_TYPE'
const HANDLE_HIDE_BUTTON_MODE_TYPE = 'HANDLE_HIDE_BUTTON_MODE_TYPE'
const HANDLE_INSTANT_RECORD_MODE_TYPE = 'HANDLE_INSTANT_RECORD_MODE_TYPE'
const HANDLE_DETAIL_VIEW_TUTORIAL_TYPE = 'HANDLE_DETAIL_VIEW_TUTORIAL_TYPE'
const SET_WORD_BOOK_TYPE = 'SET_WORD_BOOK_TYPE'
const WORD_BOOK_DELETE_TYPE = 'WORD_BOOK_DELETE_TYPE'

export const getSettingAction = (settingValue: JSON) => ({
    type: GET_SETTING_TYPE,
    payload: settingValue
})

export const setColorSettingAction = (colorCode: string) => ({
    type: SET_COLOR_SETTING_TYPE,
    payload: colorCode
})

export const setLangSettingAction = (langCode: string) => ({
    type: SET_LANG_SETTING_TYPE,
    payload: langCode
})

export const setRoleModelAction = (roleModelName: string) => ({
    type: SET_ROLE_MODEL_TYPE,
    payload: roleModelName
})

export const handleRepeatModeAction = () => ({
    type: HANDLE_REPEAT_MODE_TYPE,
    payload: null
})

export const handleHideButtonModeAction = () => ({
    type: HANDLE_HIDE_BUTTON_MODE_TYPE,
    payload: null
})

export const handleInstantRecordModeAction = () => ({
    type: HANDLE_INSTANT_RECORD_MODE_TYPE,
    payload: null
})

export const handleDetailViewTutorialAction = () => ({
    type: HANDLE_DETAIL_VIEW_TUTORIAL_TYPE,
    payload: null
})

export const setWordBookAction = (key: string, value: string) => ({
    type: SET_WORD_BOOK_TYPE,
    payload: {
        key: key,
        value: value
    }
}) 

export const wordBookDeleteAction = (id) => ({
    type: WORD_BOOK_DELETE_TYPE,
    payload: id
})

const initialState =
    {
        roleModel: '',
        repeatMode: false,
        hideButtonMode: false,
        instantRecord: false,
        dvTutorial: true,
        bookshelfColor: 'white',
        wordBook: [],
        language: defaultLang,
    }


function setting(state = initialState, action) {
    let nextState = {};
    
    switch(action.type){
        case GET_SETTING_TYPE:
            return { ...state, ...action.payload }

        case SET_COLOR_SETTING_TYPE:
            nextState = { ...state, bookshelfColor: action.payload }
            setAsyncData(nextState)
            return nextState

        case SET_LANG_SETTING_TYPE:
            nextState = { ...state, language: action.payload }
            setAsyncData(nextState)
            return nextState

        case SET_ROLE_MODEL_TYPE:
            nextState = { ...state, roleModel: action.payload }
            setAsyncData(nextState)
            return nextState

        case HANDLE_REPEAT_MODE_TYPE:
            nextState = { ...state, repeatMode: !state.repeatMode }
            setAsyncData(nextState)
            return nextState;
        
        case HANDLE_HIDE_BUTTON_MODE_TYPE:
            nextState = { ...state, hideButtonMode: !state.hideButtonMode }
            setAsyncData(nextState)
            return nextState;
        
        case HANDLE_INSTANT_RECORD_MODE_TYPE:
            nextState = { ...state, instantRecord: !state.instantRecord }
            setAsyncData(nextState)
            return nextState;

        case HANDLE_DETAIL_VIEW_TUTORIAL_TYPE:
            nextState = { ...state, dvTutorial: !state.dvTutorial }
            setAsyncData(nextState)
            return nextState;

        case SET_WORD_BOOK_TYPE:
            let nextId;
            if(state.wordBook.length === 0){
                nextId = 1
            } else {
                nextId = Math.max(...state.wordBook.map(v => v.id)) + 1
            }
            let concatedWordBook = [ {id: nextId, key: action.payload.key, value: action.payload.value }, ...state.wordBook ]
            nextState = { ...state, wordBook: concatedWordBook}
            setAsyncData(nextState)
            return nextState;

        case WORD_BOOK_DELETE_TYPE:
            let filteredWordBook = state.wordBook.filter( v => v.id !== action.payload)
            nextState = { ...state, wordBook: filteredWordBook}
            setAsyncData(nextState)
            return nextState;

        default:
            return state;
    }
}
export default setting