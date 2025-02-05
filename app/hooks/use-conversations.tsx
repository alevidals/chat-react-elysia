import { useQuery } from "@tanstack/react-query";
import { getConversations } from "~/lib/queries";

export function useConversations(userId: string) {
  const { data: conversations } = useQuery({
    queryKey: ["conversations", userId],
    queryFn: () => getConversations(userId),
    staleTime: Infinity,
  });

  return conversations;
}
