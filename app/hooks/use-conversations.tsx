import { queryClient } from "~/components/providers";

export function useConversations(userId: string) {
  const conversations = queryClient.getQueryData(["conversations", userId]);

  return { conversations };
}
