import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    sessionUser: {}
}

const sessionUser = createSlice({
    name: 'sessionUser',
    initialState: initialState,
    reducers: {
        addSessionUser: (state, action) => {
            state.sessionUser = action.payload
        },
        removeSessionUser: () => {
            return initialState
        }
    }
})

export const { addSessionUser, removeSessionUser } = sessionUser.actions
export default sessionUser.reducer