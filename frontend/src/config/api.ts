// API Configuration
// Uses environment variable or falls back to localhost for development

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const API_ENDPOINTS = {
    // Auth endpoints
    login: `${API_BASE_URL}/api/login`,
    register: `${API_BASE_URL}/api/register`,

    // Quiz endpoints
    quizzes: `${API_BASE_URL}/api/quizzes`,
    getQuiz: (id: string) => `${API_BASE_URL}/api/quizzes/${id}`,

    // WebSocket endpoint
    wsQuiz: (id: string, name?: string) => {
        const protocol = API_BASE_URL.startsWith('https') ? 'wss' : 'ws';
        const host = API_BASE_URL.replace('http://', '').replace('https://', '');
        return `${protocol}://${host}/ws/quiz/${id}/join${name ? `?name=${name}` : ''}`;
    },
};

export default API_BASE_URL;
