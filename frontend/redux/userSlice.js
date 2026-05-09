import { createSlice } from "@reduxjs/toolkit"

const userSlice = createSlice({
    name: "user",

    initialState: {
        userData: null,
        otherUserData: null,
        loading: true // 👈 Isey TRUE rakho, taaki API ka wait kare refresh par
    },

    reducers: {
        setUserData: (state, action) => {
            state.userData = action.payload;
            state.loading = false; // 👈 Data aate hi loading false
        },
        setOtherUserData: (state, action) => {
            state.otherUserData = action.payload;
            state.loading = false; // 👈 Error ya data dono pe false
        },
        setLoading: (state, action) => {
            state.loading = action.payload; // 👈 Manual control ke liye
        }
    }
})

export const { setUserData, setOtherUserData, setLoading } = userSlice.actions
export default userSlice.reducer