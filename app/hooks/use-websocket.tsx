import { useState } from "react";
import { WEBSOCKET_URL } from "~/lib/env";

type Pathname = "conversations" | "messages";

interface Props {
  pathname: Pathname;
}

export function useWebSocket({ pathname }: Props) {
  const [socket] = useState(() => {
    const ws = new WebSocket(`${WEBSOCKET_URL}/${pathname}`);
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
    sendMessage,
    onOpen,
    onMessage,
    onClose,
  };
}
