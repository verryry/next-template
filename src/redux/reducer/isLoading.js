import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    isLoading: false
}

const isLoading = createSlice({
    name: 'isLoading',
    initialState: initialState,
    reducers: {
        addIsLoading: (state, action) => {
            state.isLoading = action.payload
        },
        removeIsLoading: () => {
            return initialState
        }
    }
})

export const { addIsLoading, removeIsLoading } = isLoading.actions
export default isLoading.reducer