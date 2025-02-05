import { useQuery } from "@tanstack/react-query";
import { getMessages } from "~/lib/queries";

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

  return messages;
}
