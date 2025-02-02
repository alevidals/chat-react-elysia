import { useState } from "react";

type Props = {
  url: string;
};

export function useWebSocket({ url }: Props) {
  const [socket] = useState(() => {
    const ws = new WebSocket(url);
    return ws;
  });

  function sendMessage(data: Record<string, unknown>) {
    socket.send(JSON.stringify(data));
  }

  function onOpen(callback: () => void) {
    socket.addEventListener("open", callback);
  }

  function onMessage(callback: (event: MessageEvent) => void) {
    socket.addEventListener("message", callback);
  }

  function onClose(callback: () => void) {
    socket.addEventListener("close", callback);
  }

  return {
    // socket,
    sendMessage,
    onOpen,
    onMessage,
    onClose,
  };
}
