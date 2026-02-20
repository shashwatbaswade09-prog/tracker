import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot, User, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { chatApi, supportApi } from '../services/api';
import type { ChatMessage as ApiChatMessage } from '../services/api';

interface Message {
    id: number;
    text: string;
    isBot: boolean;
    timestamp: Date;
    isForm?: boolean;
}

const quickReplies = [
    "What's your pricing?",
    "How does it work?",
    "Talk to support",
    "Features"
];

// Generate or get session ID
const getSessionId = () => {
    let sessionId = localStorage.getItem('nexus_chat_session');
    if (!sessionId) {
        sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('nexus_chat_session', sessionId);
    }
    return sessionId;
};

export default function ChatbotDemo() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            text: "Hey there! 👋 I'm your Nexus assistant. How can I help you today?",
            isBot: true,
            timestamp: new Date()
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [sessionId] = useState(getSessionId);
    const [isConnected, setIsConnected] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Support form state
    const [showSupportForm, setShowSupportForm] = useState(false);
    const [supportEmail, setSupportEmail] = useState('');
    const [supportName, setSupportName] = useState('');
    const [supportMessage, setSupportMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [, setTicketCreated] = useState<number | null>(null);

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, showSupportForm]);

    // Load chat history on open
    useEffect(() => {
        if (isOpen && messages.length === 1) {
            loadChatHistory();
        }
    }, [isOpen]);

    const loadChatHistory = async () => {
        try {
            const history = await chatApi.getHistory(sessionId);
            if (history.length > 0) {
                const loadedMessages: Message[] = history.map((msg: ApiChatMessage) => ({
                    id: msg.id,
                    text: msg.message,
                    isBot: msg.is_bot,
                    timestamp: new Date(msg.created_at)
                }));
                setMessages([messages[0], ...loadedMessages]);
            }
        } catch {
            console.log('Could not load chat history');
        }
    };

    const handleSend = async (text: string) => {
        if (!text.trim()) return;

        // Check if user wants to talk to support
        if (text.toLowerCase().includes('support') || text.toLowerCase().includes('human') || text.toLowerCase().includes('agent')) {
            setShowSupportForm(true);
            const userMessage: Message = {
                id: Date.now(),
                text: text,
                isBot: false,
                timestamp: new Date()
            };
            const botMessage: Message = {
                id: Date.now() + 1,
                text: "I'll connect you with our support team! 🙋‍♂️ Please fill out the form below and we'll get back to you via email.",
                isBot: true,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, userMessage, botMessage]);
            setInputValue('');
            return;
        }

        // Add user message immediately
        const userMessage: Message = {
            id: Date.now(),
            text: text,
            isBot: false,
            timestamp: new Date()
        };
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsTyping(true);

        try {
            // Call the real API
            const response = await chatApi.sendMessage(text, sessionId);

            // Add bot response
            const botMessage: Message = {
                id: response.bot_message.id,
                text: response.bot_message.message,
                isBot: true,
                timestamp: new Date(response.bot_message.created_at)
            };
            setMessages(prev => [...prev, botMessage]);
            setIsConnected(true);
        } catch (error) {
            console.error('Chat API error:', error);
            setIsConnected(false);

            // Fallback response if API fails
            const fallbackMessage: Message = {
                id: Date.now() + 1,
                text: "I'm having trouble connecting right now. Please try again in a moment! 🔄",
                isBot: true,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, fallbackMessage]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleSupportSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!supportEmail || !supportMessage) return;

        setIsSubmitting(true);
        try {
            const ticket = await supportApi.createTicket({
                email: supportEmail,
                name: supportName || 'Guest',
                message: supportMessage,
                subject: 'Support Request from Chat',
                session_id: sessionId
            });

            setTicketCreated(ticket.id);
            setShowSupportForm(false);

            // Add confirmation message
            const confirmMessage: Message = {
                id: Date.now(),
                text: `✅ Support ticket #${ticket.id} created!\n\nWe've sent a confirmation to ${supportEmail}. Our team will get back to you within 2 hours.\n\nIn the meantime, feel free to ask me anything else!`,
                isBot: true,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, confirmMessage]);

            // Clear form
            setSupportEmail('');
            setSupportName('');
            setSupportMessage('');
        } catch (error) {
            console.error('Error creating ticket:', error);
            const errorMessage: Message = {
                id: Date.now(),
                text: "Sorry, I couldn't create a support ticket right now. Please try again or email us directly at support@nexus.com",
                isBot: true,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <>
            {/* Chat Widget Button */}
            <motion.button
                className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center"
                style={{
                    background: 'linear-gradient(135deg, #ff6b00 0%, #ff9e00 100%)',
                    boxShadow: '0 8px 32px rgba(255, 107, 0, 0.4)'
                }}
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
            >
                <AnimatePresence mode="wait">
                    {isOpen ? (
                        <motion.div
                            key="close"
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                        >
                            <X className="w-6 h-6 text-black" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="chat"
                            initial={{ rotate: 90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: -90, opacity: 0 }}
                        >
                            <MessageCircle className="w-6 h-6 text-black" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="fixed bottom-24 right-6 z-50 w-96 h-[550px] rounded-2xl overflow-hidden flex flex-col"
                        style={{
                            background: 'rgba(10, 10, 10, 0.95)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(255, 107, 0, 0.2)',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 80px rgba(255, 107, 0, 0.1)'
                        }}
                    >
                        {/* Header */}
                        <div
                            className="p-4 flex items-center gap-3"
                            style={{
                                background: 'linear-gradient(135deg, rgba(255, 107, 0, 0.15) 0%, rgba(255, 158, 0, 0.08) 100%)',
                                borderBottom: '1px solid rgba(255, 107, 0, 0.2)'
                            }}
                        >
                            <div className="relative">
                                <div
                                    className="w-10 h-10 rounded-full flex items-center justify-center"
                                    style={{ background: 'linear-gradient(135deg, #ff6b00 0%, #ff9e00 100%)' }}
                                >
                                    <Bot className="w-5 h-5 text-black" />
                                </div>
                                <div
                                    className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#0a0a0a] ${isConnected ? 'bg-emerald-500' : 'bg-yellow-500'}`}
                                />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-white font-['Outfit']">Nexus Support</h3>
                                <p className={`text-xs ${isConnected ? 'text-emerald-400' : 'text-yellow-400'}`}>
                                    {isConnected ? 'Online • Powered by AI' : 'Reconnecting...'}
                                </p>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((message) => (
                                <motion.div
                                    key={message.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex gap-2 ${message.isBot ? 'justify-start' : 'justify-end'}`}
                                >
                                    {message.isBot && (
                                        <div
                                            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                                            style={{ background: 'linear-gradient(135deg, #ff6b00 0%, #ff9e00 100%)' }}
                                        >
                                            <Bot className="w-4 h-4 text-black" />
                                        </div>
                                    )}
                                    <div className={`max-w-[75%] ${message.isBot ? '' : 'order-first'}`}>
                                        <div
                                            className="px-4 py-2.5 rounded-2xl text-sm whitespace-pre-line"
                                            style={{
                                                background: message.isBot
                                                    ? 'rgba(255, 107, 0, 0.12)'
                                                    : 'linear-gradient(135deg, #ff6b00 0%, #ff9e00 100%)',
                                                color: message.isBot ? '#ffffff' : '#000000',
                                                border: message.isBot ? '1px solid rgba(255, 107, 0, 0.2)' : 'none',
                                                borderBottomLeftRadius: message.isBot ? '4px' : '16px',
                                                borderBottomRightRadius: message.isBot ? '16px' : '4px',
                                            }}
                                        >
                                            {message.text}
                                        </div>
                                        <p className={`text-[10px] text-gray-500 mt-1 ${message.isBot ? '' : 'text-right'}`}>
                                            {formatTime(message.timestamp)}
                                        </p>
                                    </div>
                                    {!message.isBot && (
                                        <div
                                            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                                            style={{ background: 'linear-gradient(135deg, #ff9e00 0%, #ff6b00 100%)' }}
                                        >
                                            <User className="w-4 h-4 text-black" />
                                        </div>
                                    )}
                                </motion.div>
                            ))}

                            {/* Support Form */}
                            {showSupportForm && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-4 rounded-xl"
                                    style={{
                                        background: 'rgba(255, 107, 0, 0.08)',
                                        border: '1px solid rgba(255, 107, 0, 0.3)'
                                    }}
                                >
                                    <div className="flex items-center gap-2 mb-4">
                                        <Mail className="w-5 h-5 text-orange-400" />
                                        <span className="text-white font-semibold text-sm">Contact Support</span>
                                    </div>
                                    <form onSubmit={handleSupportSubmit} className="space-y-3">
                                        <input
                                            type="email"
                                            placeholder="Your email *"
                                            value={supportEmail}
                                            onChange={(e) => setSupportEmail(e.target.value)}
                                            required
                                            className="w-full px-3 py-2 rounded-lg bg-black/50 border border-orange-500/30 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-orange-500"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Your name"
                                            value={supportName}
                                            onChange={(e) => setSupportName(e.target.value)}
                                            className="w-full px-3 py-2 rounded-lg bg-black/50 border border-orange-500/30 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-orange-500"
                                        />
                                        <textarea
                                            placeholder="How can we help? *"
                                            value={supportMessage}
                                            onChange={(e) => setSupportMessage(e.target.value)}
                                            required
                                            rows={3}
                                            className="w-full px-3 py-2 rounded-lg bg-black/50 border border-orange-500/30 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-orange-500 resize-none"
                                        />
                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setShowSupportForm(false)}
                                                className="flex-1 py-2 rounded-lg border border-gray-600 text-gray-400 text-sm hover:bg-white/5 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={isSubmitting || !supportEmail || !supportMessage}
                                                className="flex-1 py-2 rounded-lg text-black text-sm font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                                                style={{ background: 'linear-gradient(135deg, #ff6b00 0%, #ff9e00 100%)' }}
                                            >
                                                {isSubmitting ? (
                                                    <span>Sending...</span>
                                                ) : (
                                                    <>
                                                        <Send className="w-4 h-4" />
                                                        Submit
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                </motion.div>
                            )}

                            {/* Typing Indicator */}
                            {isTyping && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex gap-2 items-center"
                                >
                                    <div
                                        className="w-8 h-8 rounded-full flex items-center justify-center"
                                        style={{ background: 'linear-gradient(135deg, #ff6b00 0%, #ff9e00 100%)' }}
                                    >
                                        <Bot className="w-4 h-4 text-black" />
                                    </div>
                                    <div
                                        className="px-4 py-3 rounded-2xl flex gap-1"
                                        style={{
                                            background: 'rgba(255, 107, 0, 0.12)',
                                            border: '1px solid rgba(255, 107, 0, 0.2)'
                                        }}
                                    >
                                        <motion.div
                                            className="w-2 h-2 rounded-full"
                                            style={{ background: '#ff6b00' }}
                                            animate={{ y: [0, -5, 0] }}
                                            transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                                        />
                                        <motion.div
                                            className="w-2 h-2 rounded-full"
                                            style={{ background: '#ff9e00' }}
                                            animate={{ y: [0, -5, 0] }}
                                            transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                                        />
                                        <motion.div
                                            className="w-2 h-2 rounded-full"
                                            style={{ background: '#ff6b00' }}
                                            animate={{ y: [0, -5, 0] }}
                                            transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                                        />
                                    </div>
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Quick Replies */}
                        {!showSupportForm && (
                            <div className="px-4 pb-2">
                                <div className="flex flex-wrap gap-2">
                                    {quickReplies.map((reply) => (
                                        <button
                                            key={reply}
                                            onClick={() => handleSend(reply)}
                                            disabled={isTyping}
                                            className="px-3 py-1.5 text-xs rounded-full transition-all hover:scale-105 disabled:opacity-50"
                                            style={{
                                                background: 'rgba(255, 107, 0, 0.1)',
                                                border: '1px solid rgba(255, 107, 0, 0.3)',
                                                color: '#ff9e00'
                                            }}
                                        >
                                            {reply}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Input */}
                        {!showSupportForm && (
                            <div className="p-4 pt-2">
                                <div
                                    className="flex items-center gap-2 p-2 rounded-xl"
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.03)',
                                        border: '1px solid rgba(255, 107, 0, 0.2)'
                                    }}
                                >
                                    <input
                                        type="text"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && !isTyping && handleSend(inputValue)}
                                        placeholder="Type your message..."
                                        disabled={isTyping}
                                        className="flex-1 bg-transparent text-white text-sm px-2 outline-none placeholder:text-gray-500 disabled:opacity-50"
                                        style={{ fontFamily: 'Inter, sans-serif' }}
                                    />
                                    <button
                                        onClick={() => handleSend(inputValue)}
                                        disabled={!inputValue.trim() || isTyping}
                                        className="w-9 h-9 rounded-lg flex items-center justify-center transition-all disabled:opacity-50"
                                        style={{
                                            background: inputValue.trim() && !isTyping
                                                ? 'linear-gradient(135deg, #ff6b00 0%, #ff9e00 100%)'
                                                : 'rgba(255, 107, 0, 0.2)'
                                        }}
                                    >
                                        <Send className="w-4 h-4 text-black" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
