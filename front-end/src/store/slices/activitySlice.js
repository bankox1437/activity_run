import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL
const getToken = () => localStorage.getItem('token')
const authHeader = () => ({ Authorization: `Bearer ${getToken()}` })


// ดึงกิจกรรมทั้งหมด (หน้า Home)
export const fetchAllActivities = createAsyncThunk(
    'activity/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const res = await axios.get(`${API}activity/all`)
            return res.data.data || []
        } catch (err) {
            return rejectWithValue(err.message)
        }
    }
)

// ดึงแผนที่ status การ join ของผู้ใช้ปัจจุบัน { activity_id: status }
export const fetchJoinedMap = createAsyncThunk(
    'activity/fetchJoinedMap',
    async (_, { rejectWithValue }) => {
        if (!getToken()) return {}
        try {
            const res = await axios.get(`${API}activity/my-joined`, {
                headers: authHeader(),
            })
            // แปลง array → object เพื่อ lookup เร็ว: { [activity_id]: status }
            return Object.fromEntries(
                (res.data.data || []).map((j) => [j.activity_id, j.status])
            )
        } catch {
            return rejectWithValue('Failed to fetch joined')
        }
    }
)

// ดึงกิจกรรมที่สร้างเองและที่ join ไว้ (หน้า MyActivity)
export const fetchMyActivities = createAsyncThunk(
    'activity/fetchMyActivities',
    async (_, { rejectWithValue }) => {
        try {
            const headers = authHeader()
            const [createdRes, joinedRes] = await Promise.all([
                axios.get(`${API}activity/my-created`, { headers }),
                axios.get(`${API}activity/my-joined`, { headers }),
            ])
            return {
                myCreated: createdRes.data.data || [],
                myJoined: joinedRes.data.data || [],
            }
        } catch (err) {
            return rejectWithValue(err.message)
        }
    }
)

const activitySlice = createSlice({
    name: 'activity',
    initialState: {
        // หน้า Home
        homeActivities: [],
        homeLoading: false,
        homeError: null,

        // สถานะ join ของผู้ใช้ { [activity_id]: status }
        joinedMap: {},

        // หน้า MyActivity
        myCreated: [],
        myJoined: [],
        myLoading: false,
        myError: null,
    },
    reducers: {
        // ลบกิจกรรมที่สร้างออกจาก list (หลัง delete สำเร็จ)
        removeCreated(state, action) {
            state.myCreated = state.myCreated.filter((a) => a.id !== action.payload)
        },
        // ลบกิจกรรมที่ join ออกจาก list (หลัง leave สำเร็จ)
        removeJoined(state, action) {
            state.myJoined = state.myJoined.filter((j) => j.join_id !== action.payload)
        },
        // อัปเดต joinedMap โดยตรง (ใช้หลัง join/leave)
        updateJoinedMap(state, action) {
            state.joinedMap = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            // Home activities 
            .addCase(fetchAllActivities.pending, (state) => {
                state.homeLoading = true
                state.homeError = null
            })
            .addCase(fetchAllActivities.fulfilled, (state, { payload }) => {
                state.homeActivities = payload
                state.homeLoading = false
            })
            .addCase(fetchAllActivities.rejected, (state, { payload }) => {
                state.homeError = payload || 'Failed to load'
                state.homeLoading = false
            })

            // Joined map 
            .addCase(fetchJoinedMap.fulfilled, (state, { payload }) => {
                state.joinedMap = payload
            })

            // My Activities 
            .addCase(fetchMyActivities.pending, (state) => {
                state.myLoading = true
                state.myError = null
            })
            .addCase(fetchMyActivities.fulfilled, (state, { payload }) => {
                state.myCreated = payload.myCreated
                state.myJoined = payload.myJoined
                state.myLoading = false
            })
            .addCase(fetchMyActivities.rejected, (state, { payload }) => {
                state.myError = payload || 'Failed to load'
                state.myLoading = false
            })
    },
})

export const { removeCreated, removeJoined, updateJoinedMap } = activitySlice.actions
export default activitySlice.reducer
