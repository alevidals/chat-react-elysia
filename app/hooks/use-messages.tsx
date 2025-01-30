import { queryClient } from "~/components/providers";
import type { Messages } from "~/lib/types";

interface Props {
  conversationId: string;
  senderUserId: string;
}

export function useMessages({ conversationId, senderUserId }: Props) {
  const messages: Messages | undefined = queryClient.getQueryData([
    "messages",
    conversationId,
    senderUserId,
  ]);

  return { messages };
}
