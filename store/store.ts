import { configureStore } from "@reduxjs/toolkit";
import TasksSlice from "../reducers/TasksSlice";


const store = configureStore({
    reducer: {
        tasks : TasksSlice,

    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;