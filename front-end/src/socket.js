import { io } from 'socket.io-client';

const API_URL = import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '');
console.log('[Socket] Initializing with URL:', API_URL);

export const socket = io(API_URL, {
    withCredentials: true,
    autoConnect: false,
    transports: ['polling', 'websocket'] // Try polling first for better compatibility
});

socket.on('connect', () => console.log('[Socket] Connected with ID:', socket.id));
socket.on('connect_error', (err) => console.error('[Socket] Connection Error:', err));
socket.on('disconnect', (reason) => console.warn('[Socket] Disconnected:', reason));

export const connectSocket = (userId) => {
    console.log('[Socket] connectSocket called for user:', userId);
    if (!socket.connected) {
        socket.connect();
    }
    
    const join = () => {
        console.log('[Socket] Emitting join_room for user:', userId);
        socket.emit('join_room', `user_${userId}`);
    };

    if (socket.connected) join();
    socket.on('connect', join);
};

export const disconnectSocket = () => {
    if (socket.connected) {
        socket.disconnect();
    }
};
