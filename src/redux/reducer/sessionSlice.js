import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    token: ""
}

const tokenSlice = createSlice({
    name: 'token',
    initialState: initialState,
    reducers: {
        addSessionToken: (state, action) => {
            state.token = action.payload
        },
        removeSessionToken: () => {
            return initialState
        }
    }
})

export const { addSessionToken, removeSessionToken } = tokenSlice.actions
export default tokenSlice.reducer