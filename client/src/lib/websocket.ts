import { useState, useEffect, useCallback } from 'react';

type WebSocketHook = {
  sendMessage: (message: string) => void;
  lastMessage: MessageEvent<any> | null;
  readyState: number;
};

export const useWebSocket = (): WebSocketHook => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [lastMessage, setLastMessage] = useState<MessageEvent<any> | null>(null);
  const [readyState, setReadyState] = useState<number>(WebSocket.CONNECTING);

  // Initialize WebSocket connection
  useEffect(() => {
    // Determine WebSocket URL based on current window location
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    const wsUrl = `${protocol}//${host}/ws`;
    
    console.log('Connecting to WebSocket at:', wsUrl);
    
    let ws: WebSocket;
    
    try {
      ws = new WebSocket(wsUrl);
      
      ws.onopen = () => {
        console.log('WebSocket connection established');
        setReadyState(WebSocket.OPEN);
      };
      
      ws.onmessage = (event: MessageEvent<any>) => {
        console.log('WebSocket message received:', event.data);
        setLastMessage(event);
      };
      
      ws.onclose = () => {
        console.log('WebSocket connection closed');
        setReadyState(WebSocket.CLOSED);
      };
      
      ws.onerror = (error: Event) => {
        console.error('WebSocket error:', error);
        setReadyState(WebSocket.CLOSED);
      };
      
      setSocket(ws);
    } catch (error) {
      console.error('Error creating WebSocket:', error);
    }
    
    // Clean up WebSocket connection on component unmount
    return () => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, []);
  
  // Send message function
  const sendMessage = useCallback((message: string) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(message);
    } else {
      console.error('WebSocket is not connected');
    }
  }, [socket]);
  
  return {
    sendMessage,
    lastMessage,
    readyState
  };
};
