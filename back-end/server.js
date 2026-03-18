require('dotenv').config()
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const cookieParser = require('cookie-parser')
const rateLimit = require('express-rate-limit')
const pool = require('./db')

const authRoutes = require('./routes/auth')
const activityRoutes = require('./routes/activity')

const app = express()

app.use(helmet())
const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.NODE_ENV !== 'production' ? 'http://localhost:5173' : null,
].filter(Boolean)

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true)
    callback(new Error(`CORS: origin ${origin} not allowed`))
  },
  credentials: true,
}))
app.use(express.json({ limit: '10mb' }))
app.use(cookieParser())
// app.use('/uploads', express.static('uploads'))

app.use('/api/auth/login', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 10 : 100
}))

app.get('/', (req, res) => res.json({ status: 'ok', message: 'Activity Run API is running' }))

app.use('/api/auth', authRoutes)
app.use('/api/activity', activityRoutes)

app.use((err, req, res, next) => {
  console.error('Global Error Handler:', err);
  res.status(500).json({
    message: 'Internal Server Error',
    detail: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
});

const http = require('http')
const { Server } = require('socket.io')

const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
})

// Store io in app for access in routes
app.set('io', io)

io.on('connection', (socket) => {
  console.log('User connected:', socket.id)

  socket.on('join_room', (roomId) => {
    socket.join(roomId)
    console.log(`User ${socket.id} joined room ${roomId}`)
  })

  socket.on('send_message', async (data) => {
    const { activity_id, sender_id, message } = data
    console.log(`[Socket] Received message from user ${sender_id} for activity ${activity_id}: ${message}`)
    try {
      const result = await pool.query(
        'INSERT INTO tb_activity_chat (activity_id, sender_id, message) VALUES ($1, $2, $3) RETURNING *',
        [activity_id, sender_id, message]
      )
      const chatMsg = result.rows[0]
      const userRes = await pool.query('SELECT first_name, last_name FROM tb_users WHERE user_id = $1', [sender_id])
      const fullMsg = { 
        ...chatMsg, 
        first_name: userRes.rows[0].first_name, 
        last_name: userRes.rows[0].last_name 
      }
      console.log(`[Socket] Broadcasting message to room activity_${activity_id}`)
      io.to(`activity_${activity_id}`).emit('receive_message', fullMsg)
    } catch (err) {
      console.error('[Socket] Chat error:', err)
    }
  })

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id)
  })
})

const PORT = process.env.PORT || 5000
server.listen(PORT, () =>
  console.log('Server running on port', PORT)
)