import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

interface PermissionsProps {
    children: React.ReactNode;
    deviceID: string;
    userID: string;
}

interface DataProps {
    userID: string;
    deviceID: string;
    data: {
        DeviceAddress: string;
        X: AxisData;
        Y: AxisData;
        Z: AxisData;
        Temperature: number;
    };
}

interface AxisData {
    Acceleration: number;
    VelocityAngular: number;
    VibrationSpeed: number;
    VibrationAngle: number;
    VibrationDisplacement: number;
    Frequency: number;
}

type WebSocketContextType = {
    socket: WebSocket | null;
    sendMessage: (message: string) => void;
    receivedData: DataProps | null;
};

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const useWebSocket = () => {
    const context = useContext(WebSocketContext);
    if (!context) {
        throw new Error('useWebSocket must be used within a WebSocketProvider');
    }
    return context;
};

export const WebSocketProvider: React.FC<PermissionsProps> = ({ children, deviceID, userID }) => {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [receivedData, setReceivedData] = useState<DataProps | null>(null);
    const socketRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        if (socketRef.current) {
            socketRef.current.close();
        }

        const newSocket = new WebSocket(`ws://${process.env.EXPO_PUBLIC_WEBSOCKET_URL}/ws/boadcast?userID=${userID}&deviceID=${deviceID}`);
        socketRef.current = newSocket;
        setSocket(newSocket);

        console.log('WebSocket connection opened');
        newSocket.onopen = () => {
            console.log('WebSocket connection opened');
        };

        newSocket.onmessage = (event) => {
            try {
                const parsedData: DataProps = JSON.parse(event.data);
                setReceivedData(parsedData);
                console.log('WebSocket message received:', parsedData);
            } catch (error) {
                console.error('Error parsing WebSocket message:', error);
            }
        };

        newSocket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        newSocket.onclose = (event) => {
            console.log('WebSocket connection closed', event.reason || '');
        };

        return () => {
            if (newSocket) {
                newSocket.close();
                console.log('WebSocket connection cleaned up');
            }
        };
    }, [deviceID, userID]);

    const sendMessage = (message: string) => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(message);
        } else {
            console.error('WebSocket is not open. Unable to send message:', message);
        }
    };

    return (
        <WebSocketContext.Provider value={{ socket, sendMessage, receivedData }}>
            {children}
        </WebSocketContext.Provider>
    );
};