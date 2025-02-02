import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

interface Props {
  children: ReactNode;
}

interface WebSocketContextValue {
  socket: WebSocket | null;
  sendMessage<T>(data: T): void;
}

const defaultContextValue: WebSocketContextValue = {
  socket: null,
  sendMessage: () => {},
};

const WebSocketContext =
  createContext<WebSocketContextValue>(defaultContextValue);

export function useWebSocket() {
  const context = useContext(WebSocketContext);

  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }

  return context;
}

export function WebSocketProvider({ children }: Props) {
  const [socket] = useState(() => {
    const ws = new WebSocket("ws://localhost:3000/ws");
    return ws;
  });

  function sendMessage<T>(data: T) {
    socket.send(JSON.stringify(data));
  }

  const value: WebSocketContextValue = {
    socket,
    sendMessage,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
}
