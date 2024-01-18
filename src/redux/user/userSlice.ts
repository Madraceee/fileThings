import { createSlice } from "@reduxjs/toolkit";

export type UserState = {
    email: string,
    token: string,
    isLoggedIn: boolean,
    folderID: string,
    rootFolderID: string,
    folderStack: string[],
    folderNameStack: string[],
    newFolderName: string;
}

export type ActionState = {
    payload: UserState,
    type: string,
}

const initialState: UserState = {
    email: "",
    token: "",
    isLoggedIn: false,
    folderID: "",
    rootFolderID: "",
    folderStack: [],
    folderNameStack: [""],
    newFolderName: ""
}


const Login = (state: UserState, action: ActionState) => {
    state.email = action.payload.email;
    state.token = action.payload.token;
    state.folderID = action.payload.folderID;
    state.rootFolderID = action.payload.folderID;
    state.isLoggedIn = true;
    state.folderStack = [action.payload.folderID]
    state.folderNameStack = ["/"];
}

const Logout = (state: UserState) => {
    state.email = "";
    state.token = "";
    state.folderID = "";
    state.isLoggedIn = false;
}

const ChangeFolder = (state: UserState, action: ActionState) => {
    state.folderID = action.payload.folderID;
    state.folderStack.push(action.payload.folderID);
    state.folderNameStack.push(action.payload.newFolderName);
}

const ChangeFolderBack = (state: UserState) => {
    if (state.folderStack.length > 1) {
        state.folderStack.pop();
        state.folderID = state.folderStack.at(-1) || state.rootFolderID;
        state.folderNameStack.pop();
        state.newFolderName = ""
    }
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        login: (state, action) => Login(state, action),
        logout: (state) => Logout(state),
        changeFolder: (state, action) => ChangeFolder(state, action),
        changeFolderBack: (state) => ChangeFolderBack(state)
    }
})

export default userSlice.reducer;
export const { login, logout, changeFolder, changeFolderBack } = userSlice.actions;
