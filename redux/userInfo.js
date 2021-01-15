import serverUrl from '../constants/serverLocation';

//action types
const SIGNIN_TYPE = 'SIGNIN' 
const LOGOUT_TYPE = 'LOGOUT'
const BOOKMARK_ADD_TYPE = 'BOOKMARK_ADD_TYPE'
const BOOKMARK_DELETE_TYPE = 'BOOKMARK_DELETE_TYPE'

//action create function
export const signInAction = (userInfo, bookmarks) => ({
    type: SIGNIN_TYPE,
    payload: { userInfo, bookmarks }
})

export const logoutAction = () => ({
    type: LOGOUT_TYPE,
    payload: null
})

export const bookmarkAddAction = (videoInfo) => ({
    type: BOOKMARK_ADD_TYPE,
    payload: videoInfo
})

export const bookmarkDeleteAction = (videoId) => ({
    type: BOOKMARK_DELETE_TYPE,
    payload: videoId
})

//====================================================

const initialState = 
    {
        user: {
            email: '',
            familyName: '',
            givenName: '',
            id: '',
            name: '',
            photo: '',
        },
        isLogined: false,
        bookmarks: []
    }

//reducer
function userInfo(state = initialState, action) {
    let nextState = {};
    switch(action.type){
        case SIGNIN_TYPE:
            nextState = { ...state, user: action.payload.userInfo.user, isLogined: true, bookmarks: action.payload.bookmarks }
            //console.log(nextState)
            return nextState
        case LOGOUT_TYPE:
            return initialState
        case BOOKMARK_ADD_TYPE:
            let concatedBookmarks = [ {
                title: action.payload.title,
                videoId: action.payload.videoId,
                youtubeKey: action.payload.youtubeKey,
                createdAt: action.payload.createdAt,
            }, ...state.bookmarks ]
            return { ...state, bookmarks: concatedBookmarks };
        case BOOKMARK_DELETE_TYPE:
            let filteredBookmarks = state.bookmarks.filter( v => v.videoId !== action.payload)

            return { ...state, bookmarks: filteredBookmarks };

        default:
            return state;
    }
}
export default userInfo