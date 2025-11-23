import { useEffect, useState, useRef } from 'react';

export const useWebSocket = (quizId: string | undefined, name: string | null, onMessage: (msg: any) => void) => {
    const [ws, setWs] = useState<WebSocket | null>(null);
    const onMessageRef = useRef(onMessage);

    useEffect(() => {
        onMessageRef.current = onMessage;
    }, [onMessage]);

    useEffect(() => {
        if (!quizId) return;
        const wsUrl = `ws://${window.location.host}/ws/quiz/${quizId}/join?name=${name || ''}`;
        const socket = new WebSocket(wsUrl);

        socket.onopen = () => {
            console.log('WebSocket connected');
            setWs(socket);
        };

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (onMessageRef.current) {
                onMessageRef.current(message);
            }
        };

        socket.onclose = () => {
            console.log('WebSocket disconnected');
            setWs(null);
        };

        return () => {
            socket.close();
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
