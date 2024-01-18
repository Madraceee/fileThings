import { createSlice } from "@reduxjs/toolkit";

export type UserState = {
    name: string,
    email: string,
    token: string,
    isLoggedIn: boolean,
    folderID: string
}

export type ActionState = {
    payload: UserState,
    type: string,
}

const initialState: UserState = {
    name: "",
    email: "",
    token: "",
    isLoggedIn: false,
    folderID: ""
}


const Login = (state: UserState, action: ActionState) => {
    state.name = action.payload.name;
    state.email = action.payload.email;
    state.token = action.payload.token;
    state.folderID = action.payload.folderID;
    state.isLoggedIn = true;
}

const Logout = (state: UserState) => {
    state.name = "";
    state.email = "";
    state.token = "";
    state.folderID = "";
    state.isLoggedIn = false;
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        login: (state, action) => Login(state, action),
        logout: (state) => Logout(state),
    }
})

export default userSlice.reducer;
export const { login, logout } = userSlice.actions;
