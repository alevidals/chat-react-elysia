import { useMutation } from "@tanstack/react-query";
import { queryClient } from "~/components/providers";
import { useWebSocket } from "~/hooks/use-websocket";
import { addMessage } from "~/lib/queries";
import { USER_ID } from "~/root";

interface Props {
  conversationId: string;
  receptorId: number;
}

export function useSendMessage({ conversationId, receptorId }: Props) {
  const { sendMessage: sendConversationsMessage } = useWebSocket({
    pathname: "conversations",
  });

  const { sendMessage: sendMessagesMessage } = useWebSocket({
    pathname: "messages",
  });

  const mutation = useMutation({
    mutationFn: async (content: string) => {
      await addMessage({
        conversationId: conversationId,
        senderUserId: USER_ID,
        content,
      });

      sendMessagesMessage({
        type: "newMessage",
        receiverId: receptorId,
        conversationId,
      });

      sendConversationsMessage({
        type: "newMessage",
        conversationId,
        content,
        receiverId: String(receptorId),
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["messages", conversationId, USER_ID],
      });
    },
  });

  return mutation;
}
