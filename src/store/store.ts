import themeSliceReducer from "@/common/state/themeSlice";
import MenuClickedReducer from "@/common/state/menuClickedSlice";
import { configureStore } from "@reduxjs/toolkit";

export const store=configureStore({
    reducer:{themeSliceReducer,menuClickedReducer: MenuClickedReducer}
});

export type RootState=ReturnType<typeof store.getState>;
export type AppDispatch= typeof store.dispatch;