import { SelectedUser as User } from './../../components/types/userType';
import { createSlice } from "@reduxjs/toolkit";

interface authState{
    isAuth: boolean;
    user: User | null;
}

const initialState: authState = {
    isAuth: false,
    user: null
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers:{
        setAuth: (state, action)=>{
            state.isAuth = action.payload.isAuth;
            state.user = action.payload.user;
        }
    }
});

export const { setAuth } = authSlice.actions;
export default authSlice.reducer;