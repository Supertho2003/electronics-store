import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface IdState {
    id : number
}

const initialState = {
    id : 0
}

const IdSlice = createSlice({
    name: 'id',
    initialState,
    reducers: {
        startEdit: (state, action: PayloadAction<number>) => {
            state.id = action.payload
        },
        cancelEdit: (state, action: PayloadAction<number>) => {
            state.id = 0
        }
    }
})

const IdReducer = IdSlice.reducer
export const { startEdit, cancelEdit  } = IdSlice.actions
export default IdReducer