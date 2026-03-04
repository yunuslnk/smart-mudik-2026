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
            // Updated to port 20262 as per backend config
            socketRef.current = io('http://127.0.0.1:20262');

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
    }, [isOpen]);

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

    return (
        <>
            {!isOpen && (
                <div className="chat-bubble-fab" onClick={() => setIsOpen(true)}>
                    <MessageSquare size={28} />
                </div>
            )}

            {isOpen && (
                <div className="chat-window">
                    <div className="chat-header">
                        <h3>Live Chat Mudik</h3>
                        <button className="close-chat" onClick={() => setIsOpen(false)}>
                            <X size={20} />
                        </button>
                    </div>

                    <div className="chat-messages">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`message-bubble ${msg.userId === (user?.id || 'guest') ? 'user' : 'other'}`}
                            >
                                {renderMessageContent(msg.content)}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="chat-input-area">
                        <input
                            type="text"
                            placeholder="Tulis pesan..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        />
                        <button
                            className="send-btn"
                            onClick={handleSendMessage}
                            disabled={!inputValue.trim()}
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};
