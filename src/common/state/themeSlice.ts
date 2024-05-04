import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Theme } from "../constants/enums";

interface ThemeState {
    theme: Theme;
}

const initialState: ThemeState = {
    theme: Theme.DarkPlus
}

const ThemeSlice = createSlice({
    name: "Theme",
    initialState,
    reducers: {
        setTheme: (state, action: PayloadAction<Theme>) => {
            state.theme=action.payload;
            localStorage.setItem("theme",JSON.stringify(action.payload));
        }
    }
});
export const { setTheme } = ThemeSlice.actions;

export default ThemeSlice.reducer;