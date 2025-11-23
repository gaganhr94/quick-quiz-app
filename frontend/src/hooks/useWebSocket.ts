import { useEffect, useState, useRef, useCallback } from 'react';
import { API_ENDPOINTS } from '../config/api';

export const useWebSocket = (quizId: string, name?: string, onMessage?: (data: any) => void) => {
    const [isConnected, setIsConnected] = useState(false);
    const wsRef = useRef<WebSocket | null>(null);
    const onMessageRef = useRef(onMessage);
    const messageQueue = useRef<any[]>([]);

    // Update ref when onMessage changes
    useEffect(() => {
        onMessageRef.current = onMessage;
    }, [onMessage]);

    useEffect(() => {
        if (!quizId) return;

        const wsUrl = API_ENDPOINTS.wsQuiz(quizId, name);
        const websocket = new WebSocket(wsUrl);
        wsRef.current = websocket;

        websocket.onopen = () => {
            console.log('WebSocket connected');
            setIsConnected(true);
            // Flush message queue
            while (messageQueue.current.length > 0) {
                const msg = messageQueue.current.shift();
                websocket.send(JSON.stringify(msg));
            }
        };

        websocket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (onMessageRef.current) {
                onMessageRef.current(message);
            }
        };

        websocket.onclose = () => {
            console.log('WebSocket disconnected');
            setIsConnected(false);
            wsRef.current = null;
        };

        return () => {
            websocket.close();
            wsRef.current = null;
        };
    }, [quizId, name]);

    const sendMessage = useCallback((message: any) => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify(message));
        } else {
            console.log('WebSocket not ready, queuing message:', message);
            messageQueue.current.push(message);
        }
    }, []);

    return { sendMessage, isConnected };
};
