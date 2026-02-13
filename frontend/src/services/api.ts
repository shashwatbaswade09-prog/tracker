// API Configuration and Services

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const API_V1 = `${API_BASE_URL}/api/v1`;

// Helper for making API requests
async function apiRequest<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const token = localStorage.getItem('nexus_token');

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_V1}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'Request failed' }));
        throw new Error(error.detail || 'Request failed');
    }

    return response.json();
}

// --- Auth API ---

export interface User {
    id: number;
    email: string;
    username: string;
    full_name?: string;
    role: string;
    avatar_url?: string;
    whop_email?: string;
    instagram_username?: string;
    tiktok_username?: string;
    youtube_channel?: string;
    twitter_username?: string;
    is_active: boolean;
    is_verified: boolean;
    created_at: string;
}

export interface LoginResponse {
    access_token: string;
    token_type: string;
}

export const authApi = {
    register: async (data: { email: string; username: string; password: string; whop_email?: string }) => {
        return apiRequest<User>('/auth/register', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    login: async (email: string, password: string) => {
        const response = await apiRequest<LoginResponse>('/auth/login/json', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
        localStorage.setItem('nexus_token', response.access_token);
        return response;
    },

    logout: () => {
        localStorage.removeItem('nexus_token');
    },

    getMe: async () => {
        return apiRequest<User>('/auth/me');
    },

    updateProfile: async (data: Partial<User>) => {
        return apiRequest<User>('/auth/me', {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    },
};

// --- Campaigns API ---

export interface Campaign {
    id: number;
    title: string;
    description?: string;
    creator_name?: string;
    category?: string;
    payout_type?: string;
    payout_rate: number;
    min_payout: number;
    max_payout: number;
    total_budget: number;
    used_budget: number;
    platform?: string;
    requirements?: string;
    image_url?: string;
    is_active: boolean;
    deadline?: string;
    created_at: string;
}

export interface Submission {
    id: number;
    user_id: number;
    campaign_id: number;
    video_url: string;
    title?: string;
    views: number;
    earnings: number;
    status: string;
    rejection_reason?: string;
    created_at: string;
    reviewed_at?: string;
}

export const campaignsApi = {
    getAll: async (params?: { platform?: string; category?: string; active_only?: boolean }) => {
        const searchParams = new URLSearchParams();
        if (params?.platform) searchParams.append('platform', params.platform);
        if (params?.category) searchParams.append('category', params.category);
        if (params?.active_only !== undefined) searchParams.append('active_only', String(params.active_only));

        const query = searchParams.toString();
        return apiRequest<Campaign[]>(`/campaigns${query ? `?${query}` : ''}`);
    },

    getById: async (id: number) => {
        return apiRequest<Campaign>(`/campaigns/${id}`);
    },

    submit: async (campaignId: number, data: { video_url: string; title?: string }) => {
        return apiRequest<Submission>(`/campaigns/${campaignId}/submit`, {
            method: 'POST',
            body: JSON.stringify({ ...data, campaign_id: campaignId }),
        });
    },

    getMySubmissions: async () => {
        return apiRequest<Submission[]>('/campaigns/my/submissions');
    },
};

// --- Chatbot API ---

export interface ChatMessage {
    id: number;
    message: string;
    is_bot: boolean;
    created_at: string;
}

export interface ChatResponse {
    user_message: ChatMessage;
    bot_message: ChatMessage;
}

export const chatApi = {
    sendMessage: async (message: string, sessionId?: string) => {
        return apiRequest<ChatResponse>('/chat/message', {
            method: 'POST',
            body: JSON.stringify({ message, session_id: sessionId }),
        });
    },

    sendMessageAuthenticated: async (message: string, sessionId?: string) => {
        return apiRequest<ChatResponse>('/chat/message/authenticated', {
            method: 'POST',
            body: JSON.stringify({ message, session_id: sessionId }),
        });
    },

    getHistory: async (sessionId: string) => {
        return apiRequest<ChatMessage[]>(`/chat/history/${sessionId}`);
    },
};

// --- Health Check ---

export const healthApi = {
    check: async () => {
        const response = await fetch(`${API_BASE_URL}/health`);
        return response.json();
    },
};

// --- Support API ---

export interface SupportTicket {
    id: number;
    user_email: string;
    user_name: string;
    subject: string;
    initial_message: string;
    status: string;
    priority: string;
    assigned_to?: string;
    email_sent: boolean;
    created_at: string;
    resolved_at?: string;
}

export interface CreateTicketRequest {
    email: string;
    name: string;
    message: string;
    subject?: string;
    session_id?: string;
}

export const supportApi = {
    createTicket: async (data: CreateTicketRequest) => {
        return apiRequest<SupportTicket>('/support/ticket', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    getTicket: async (ticketId: number) => {
        return apiRequest<SupportTicket>(`/support/ticket/${ticketId}`);
    },

    addMessage: async (ticketId: number, message: string, isFromSupport: boolean = false) => {
        return apiRequest<unknown>(`/support/ticket/${ticketId}/message`, {
            method: 'POST',
            body: JSON.stringify({ message, is_from_support: isFromSupport }),
        });
    },
};

export default {
    auth: authApi,
    campaigns: campaignsApi,
    chat: chatApi,
    health: healthApi,
    support: supportApi,
};
