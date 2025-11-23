import { useEffect, useState, useRef } from 'react';
import { API_ENDPOINTS } from '../config/api';

export const useWebSocket = (quizId: string, name?: string, onMessage?: (data: any) => void) => {
    const [ws, setWs] = useState<WebSocket | null>(null);
    const onMessageRef = useRef(onMessage);

    // Update ref when onMessage changes
    useEffect(() => {
        onMessageRef.current = onMessage;
    }, [onMessage]);

    useEffect(() => {
        const wsUrl = API_ENDPOINTS.wsQuiz(quizId, name);
        const websocket = new WebSocket(wsUrl);

        websocket.onopen = () => {
            console.log('WebSocket connected');
            setWs(websocket);
        };

        websocket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (onMessageRef.current) {
                onMessageRef.current(message);
            }
        };

        websocket.onclose = () => {
            console.log('WebSocket disconnected');
            setWs(null);
        };

        return () => {
            websocket.close();
        };
    }, [quizId, name]);

    const sendMessage = (message: any) => {
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(message));
        } else {
            console.warn('WebSocket is not ready. Message not sent:', message);
        }
    };

    return { sendMessage };
};
