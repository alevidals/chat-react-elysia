import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WebSocketProvider } from "~/components/providers/websocket-provider";

export const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <WebSocketProvider>{children}</WebSocketProvider>
    </QueryClientProvider>
  );
}
