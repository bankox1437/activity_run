import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const apiURL = import.meta.env.VITE_API_URL

export const checkAuth = createAsyncThunk('auth/checkAuth', async (_, { rejectWithValue }) => {
    const token = localStorage.getItem('token')
    if (!token) return rejectWithValue('No token')
    try {
        const res = await axios.get(`${apiURL}auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
        })
        return res.data.user
    } catch {
        localStorage.removeItem('token')
        return rejectWithValue('Invalid token')
    }
})

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        loading: true,
    },
    reducers: {
        loginSuccess(state, action) {
            const { token, user } = action.payload
            localStorage.setItem('token', token)
            state.user = user
            state.loading = false
        },
        logout(state) {
            localStorage.removeItem('token')
            state.user = null
            state.loading = false
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(checkAuth.pending, (state) => {
                state.loading = true
            })
            .addCase(checkAuth.fulfilled, (state, action) => {
                state.user = action.payload
                state.loading = false
            })
            .addCase(checkAuth.rejected, (state) => {
                state.user = null
                state.loading = false
            })
    },
})

export const { loginSuccess, logout } = authSlice.actions
export default authSlice.reducer
