import { useMessages } from "~/hooks/use-messages";

interface Props {
  conversationId: string;
  senderUserId: string;
}

export function useLastMessage({ conversationId, senderUserId }: Props) {
  const { messages } = useMessages({ conversationId, senderUserId });

  const lastMessage = messages?.messages[messages.messages.length - 1];

  return { lastMessage };
}
