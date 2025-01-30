import { queryClient } from "~/components/providers";
import { USER_ID } from "~/root";

export function useConversation(conversationId: string) {
  const conversation = queryClient.getQueryData([
    "conversation",
    USER_ID,
    conversationId,
  ]);

  return { conversation };
}
