import { useQuery } from "@tanstack/react-query";
import { queryClient } from "~/components/providers/providers";
import { useWebSocket } from "~/components/providers/websocket-provider";
import { getMessages } from "~/lib/queries";
import type { Messages } from "~/lib/types";

interface Props {
  conversationId: string;
  senderUserId: string;
}

export function useMessages({ conversationId, senderUserId }: Props) {
  const { data: messages } = useQuery({
    queryKey: ["messages", conversationId, senderUserId],
    queryFn: () => getMessages({ conversationId, senderUserId }),
    staleTime: Infinity,
  });

  return { messages };
}
