import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { MenuItem } from "../constants/enums";


interface MenuClickedState {
    menuItem: MenuItem|undefined;
    counter:number
}

const initialState: MenuClickedState = {
    counter: 0,
    menuItem:undefined
}

const MenuClickedSlice = createSlice({
    name: "MenuClicked",
    initialState,
    reducers: {
        setMenuClicked: (state, action: PayloadAction<MenuItem>) => {
            if(action.payload!==undefined || action.payload!==null){
                if(state.menuItem == action.payload){
                    state.counter=state.counter+1;
                }else{
                    state.counter = 0;
                    state.menuItem = action.payload;
                }
            }
        }
    }
});
export const { setMenuClicked } = MenuClickedSlice.actions;

export default MenuClickedSlice.reducer;