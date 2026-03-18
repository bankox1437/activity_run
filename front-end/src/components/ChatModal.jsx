import React, { useState, useEffect, useRef } from 'react';
import { Icon } from '@iconify/react';
import { socket } from '../socket';
import axios from 'axios';
import { useSelector } from 'react-redux';

const ChatModal = ({ isOpen, onClose, activity }) => {
    const { user } = useSelector((state) => state.auth);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef();

    const API = import.meta.env.VITE_API_URL;
    const activityId = activity?.id || activity?.activity_id;

    useEffect(() => {
        if (isOpen && activityId) {
            fetchMessages();
            
            const joinRoom = () => {
                socket.emit('join_room', `activity_${activityId}`);
                console.log(`[Socket] Joining activity room: activity_${activityId}`);
            };

            if (socket.connected) joinRoom();
            socket.on('connect', joinRoom);

            socket.on('receive_message', (message) => {
                // Deduplicate: don't add if already exists (e.g. sender got it via REST response)
                setMessages((prev) => {
                    const alreadyExists = prev.some((m) => m.id === message.id);
                    return alreadyExists ? prev : [...prev, message];
                });
            });

            return () => {
                socket.off('connect', joinRoom);
                socket.off('receive_message');
            };
        }
    }, [isOpen, activityId]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const fetchMessages = async () => {
        if (!activityId) return;
        try {
            const res = await axios.get(`${API}activity/${activityId}/messages`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setMessages(res.data.data || []);
        } catch (err) {
            console.error('Fetch messages error:', err);
        } finally {
            setLoading(false);
        }
    };

    const [sending, setSending] = useState(false);

    const handleSend = async (e) => {
        e.preventDefault();
        const trimmed = newMessage.trim();
        if (!trimmed || sending) return;

        setSending(true);
        setNewMessage('');
        try {
            const res = await axios.post(
                `${API}activity/${activityId}/messages`,
                { message: trimmed },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            // Immediately add to state so sender sees it right away
            const sent = res.data.data;
            setMessages((prev) => {
                const alreadyExists = prev.some((m) => m.id === sent.id);
                return alreadyExists ? prev : [...prev, sent];
            });
        } catch (err) {
            console.error('Send message error:', err);
            setNewMessage(trimmed); // restore on error
        } finally {
            setSending(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            
            <div className="relative w-full max-w-md h-[600px] max-h-[90vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in duration-200">
                {/* Header */}
                <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-blue-600 text-white">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                            <Icon icon="mdi:chat-processing-outline" className="text-2xl" />
                        </div>
                        <div>
                            <h3 className="font-bold text-sm leading-tight line-clamp-1">{activity.title}</h3>
                            <p className="text-[10px] opacity-80 uppercase tracking-wider font-semibold">Activity Group Chat</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer">
                        <Icon icon="mdi:close" className="text-xl" />
                    </button>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                    {loading ? (
                        <div className="flex justify-center items-center h-full">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
                            <Icon icon="mdi:message-off-outline" className="text-4xl opacity-20" />
                            <p className="text-xs">No messages yet. Say hi!</p>
                        </div>
                    ) : (
                        messages.map((msg, idx) => {
                            const isMe = msg.sender_id === user?.id;
                            return (
                                <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                        <div className="flex items-center gap-1 mb-1 px-1">
                                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">
                                                {isMe ? 'You' : `${msg.first_name} ${msg.last_name}`}
                                            </span>
                                        </div>
                                        <div className={`px-4 py-2.5 rounded-2xl text-sm shadow-sm ${
                                            isMe ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                                        }`}>
                                            {msg.message}
                                        </div>
                                        <span className="text-[9px] text-gray-400 mt-1 px-1">
                                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                            );
                        })
                    )}
                    <div ref={scrollRef} />
                </div>

                {/* Input Area */}
                <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-100 flex gap-2 items-center">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 bg-gray-100 border-none rounded-2xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim() || sending}
                        className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-200 hover:bg-blue-700 disabled:opacity-50 disabled:shadow-none transition-all cursor-pointer"
                    >
                        <Icon icon={sending ? 'mdi:loading' : 'mdi:send'} className={`text-xl ${sending ? 'animate-spin' : '-rotate-45'}`} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatModal;
