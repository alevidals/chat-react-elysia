import { queryClient } from "~/components/providers";
import type { Conversation } from "~/lib/types";

export function useConversations(userId: string) {
  const conversations: Conversation[] | undefined = queryClient.getQueryData([
    "conversations",
    userId,
  ]);

  return { conversations };
}
