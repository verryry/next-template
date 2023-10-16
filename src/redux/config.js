import { configureStore } from '@reduxjs/toolkit'
import sessionReducer from './reducer/sessionSlice'
import storage from 'redux-persist/lib/storage'
import {
    persistReducer, FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist'
import { combineReducers } from '@reduxjs/toolkit'
import sessionUser from './reducer/sessionUser'
import isLoading from './reducer/isLoading'


const saveToLocalStorage = (state) => {
    try {
        const serializedState = JSON.stringify(state)
        localStorage.setItem('state', serializedState)
    } catch (e) {
        console.log(e)
    }
}

const loadFromLocalStorage = () => {
    try {
        const serializedState = localStorage.getItem('state')
        if (serializedState === null) return undefined
        return JSON.parse(serializedState)
    } catch (e) {
        console.log(e)
        return undefined
    }
}

const persistConfig = {
    key: 'state',
    storage
}

const reducerSession = combineReducers({
    session: sessionReducer,
    sessionUser: sessionUser,
    isLoading: isLoading
})

const persistedReducer = persistReducer(persistConfig, reducerSession)

const store = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
            }
        })
})

// store.subscribe(() => {
//     saveToLocalStorage(store.getState())
// })

export default store