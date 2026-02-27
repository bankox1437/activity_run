require('dotenv').config()
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const cookieParser = require('cookie-parser')
const rateLimit = require('express-rate-limit')

const authRoutes = require('./routes/auth')
const activityRoutes = require('./routes/activity')

const app = express()

app.use(helmet())
app.use(cors({ origin: true, credentials: true }))
app.use(express.json())
app.use(cookieParser())
app.use('/uploads', express.static('uploads'))

app.use('/api/auth/login', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 10 : 100
}))

app.use('/api/auth', authRoutes)
app.use('/api/activity', activityRoutes)

app.listen(process.env.PORT, () =>
  console.log('Server running on port', process.env.PORT)
)