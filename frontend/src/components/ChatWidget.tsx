import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../services/AuthContext';
import './ChatWidget.css';

interface Message {
    id: string;
    userId: string | null;
    content: string;
    isAdmin: boolean;
    createdAt: string;
    user?: {
        name: string;
        email: string;
    };
}

export const ChatWidget: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const { user } = useAuth();
    const socketRef = useRef<Socket | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen && !socketRef.current) {
            const { protocol, hostname } = window.location;
            const socketUrl = `${protocol}//${hostname}:20262`;
            console.log('Connecting to Chat Socket at:', socketUrl);

            socketRef.current = io(socketUrl, {
                auth: {
                    userId: user?.id || null
                },
                transports: ['websocket'],
                reconnectionAttempts: 5
            });

            socketRef.current.on('connect', () => {
                console.log('Connected to Chat Socket ✅');
            });

            socketRef.current.on('connect_error', (err) => {
                console.error('Chat Socket Connection Error ❌:', err.message);
            });

            socketRef.current.on('init_messages', (history: Message[]) => {
                setMessages(history);
            });

            socketRef.current.on('receive_message', (message: Message) => {
                setMessages((prev) => [...prev, message]);
            });
        }

        if (!isOpen && socketRef.current) {
            socketRef.current.disconnect();
            socketRef.current = null;
        }

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        };
    }, [isOpen, user?.id]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = () => {
        if (!inputValue.trim() || !socketRef.current) return;

        socketRef.current.emit('send_message', {
            userId: user?.id || null,
            content: inputValue,
            isAdmin: false
        });

        setInputValue('');
    };

    const renderMessageContent = (content: string) => {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        return content.split(urlRegex).map((part, i) => {
            if (part.match(urlRegex)) {
                return (
                    <a key={i} href={part} target="_blank" rel="noopener noreferrer">
                        {part}
                    </a>
                );
            }
            return part;
        });
    };

    const getUsername = (email?: string) => {
        if (!email) return 'Guest';
        return email.split('@')[0];
    };

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        const d = date.toLocaleDateString('en-GB');
        const t = date.toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
        return `${d} ${t}`;
    };

    const getAvatarColor = (email?: string) => {
        const colors = [
            '#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#6366f1', '#8b5cf6', '#ec4899'
        ];
        if (!email) return 'transparent';
        const index = email.length % colors.length;
        return colors[index];
    };

    const getInitials = (email?: string) => {
        if (!email) return '?';
        return email.charAt(0).toUpperCase();
    };

    return (
        <>
            {!isOpen && (
                <div className="chat-bubble-fab" onClick={() => setIsOpen(true)}>
                    <MessageSquare size={28} />
                    <span className="live-badge">LIVE</span>
                </div>
            )}

            {isOpen && (
                <div className="chat-window youtube-style">
                    <div className="chat-header">
                        <div className="header-left">
                            <span className="live-dot"></span>
                            <h3>Live Chat</h3>
                        </div>
                        <button className="close-chat" onClick={() => setIsOpen(false)}>
                            <X size={20} />
                        </button>
                    </div>

                    <div className="chat-messages">
                        {!user ? (
                            <div className="login-required-msg">
                                <p>Silakan login untuk bergabung.</p>
                                <button onClick={() => window.location.href = '/login'}>Login</button>
                            </div>
                        ) : (
                            <>
                                {messages.map((msg) => (
                                    <div key={msg.id} className="yt-message">
                                        <div
                                            className="yt-avatar"
                                            style={{ backgroundColor: getAvatarColor(msg.user?.email) }}
                                        >
                                            {getInitials(msg.user?.email)}
                                        </div>
                                        <div className="yt-message-content">
                                            <span
                                                className="yt-username"
                                                style={{ color: getAvatarColor(msg.user?.email) }}
                                            >
                                                {getUsername(msg.user?.email)}
                                            </span>
                                            <span className="yt-timestamp">
                                                {formatDateTime(msg.createdAt)}
                                            </span>
                                            <span className="yt-text">
                                                {renderMessageContent(msg.content)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </>
                        )}
                    </div>

                    <div className="chat-input-area">
                        <input
                            type="text"
                            placeholder={user ? "Bicarakan sesuatu..." : "Login untuk chat"}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            disabled={!user}
                        />
                        <button
                            className="send-btn"
                            onClick={handleSendMessage}
                            disabled={!inputValue.trim() || !user}
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};
