// API Configuration and Services

const API_BASE_URL = import.meta.env.VITE_API_URL || '';
const API_V1 = API_BASE_URL ? `${API_BASE_URL}/api` : '/api';

// Helper for making API requests
async function apiRequest<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    // Clear any malformed tokens that might have been set as strings like "undefined" or "null"
    const rawToken = localStorage.getItem('nexus_token');
    const token = (rawToken && rawToken !== 'undefined' && rawToken !== 'null') ? rawToken : null;

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    // Don't send Authorization header for login/register as it can cause issues if the token is malformed
    const isAuthEndpoint = endpoint.includes('/auth/login') || endpoint.includes('/auth/register');
    if (token && !isAuthEndpoint) {
        (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_V1}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        if (response.status === 401) {
            localStorage.removeItem('nexus_token');
            // Optional: window.location.href = '/login';
        }
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
    access_token?: string; // Some providers
    access?: string;       // SimpleJWT
    refresh?: string;
    token_type?: string;
}

export const authApi = {
    register: async (data: { email: string; username: string; password: string; whop_email?: string }) => {
        return apiRequest<User>('/auth/register', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    login: async (username: string, password: string) => {
        const response = await apiRequest<LoginResponse>('/auth/login/', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
        });
        const token = response.access_token || response.access;
        if (token) {
            localStorage.setItem('nexus_token', token);
        }
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

// --- Admin API ---

export interface AdminStats {
    total_views: number;
    total_submissions: number;
}

export const adminApi = {
    getStats: async () => {
        return apiRequest<AdminStats>('/submissions/dashboard/admin/');
    },

    getUsers: async () => {
        return apiRequest<User[]>('/auth/users/');
    },

    getAllSubmissions: async () => {
        return apiRequest<Submission[]>('/submissions/');
    },
};

// --- Integrations API ---

export interface ConnectedAccount {
    id: number;
    platform: string;
    handle: string;
    profile_url: string;
    status: string;
    verification_code?: string;
    verified_at?: string;
    metrics?: {
        views?: number;
        subscribers?: number;
        likes?: number;
        comments?: number;
        video_count?: number;
        title?: string;
        thumbnail?: string;
    };
}

export interface VideoInsight {
    id: string;
    title: string;
    thumbnail: string;
    published_at: string;
    views: number;
    likes: number;
    comments: number;
    duration: string;
    is_short: boolean;
}

export const integrationsApi = {
    getConnectUrl: async (platform: string) => {
        const endpoint = platform === 'YOUTUBE' ? '/integrations/connected-accounts/connect_youtube/' : `/integrations/connected-accounts/connect_${platform.toLowerCase()}/`;
        return apiRequest<{ url: string }>(endpoint);
    },

    oauthExchange: async (platform: string, code: string) => {
        return apiRequest<ConnectedAccount>('/integrations/connected-accounts/oauth_exchange/', {
            method: 'POST',
            body: JSON.stringify({ platform, code }),
        });
    },

    manualLink: async (platform: string, handle: string) => {
        return apiRequest<ConnectedAccount>('/integrations/connected-accounts/manual_link/', {
            method: 'POST',
            body: JSON.stringify({ platform, handle }),
        });
    },

    getAccounts: async () => {
        return apiRequest<ConnectedAccount[]>('/integrations/connected-accounts/');
    },

    getAccountMetrics: async (id: number) => {
        return apiRequest<ConnectedAccount['metrics']>(`/integrations/connected-accounts/${id}/metrics/`);
    },

    getContentMetrics: async (id: number) => {
        return apiRequest<VideoInsight[]>(`/integrations/connected-accounts/${id}/content_metrics/`);
    },

    unlinkAccount: async (id: number) => {
        return apiRequest<void>(`/integrations/connected-accounts/${id}/`, {
            method: 'DELETE',
        });
    },
};

export default {
    auth: authApi,
    campaigns: campaignsApi,
    chat: chatApi,
    health: healthApi,
    support: supportApi,
    admin: adminApi,
    integrations: integrationsApi,
};
