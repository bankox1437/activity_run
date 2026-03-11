import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import activityReducer from './slices/activitySlice'

const store = configureStore({
    reducer: {
        auth: authReducer,
        activity: activityReducer,
    },
})

export default store
