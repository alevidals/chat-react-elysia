import type { Route } from ".react-router/types/app/routes/+types/$conversationId";
import { useEffect } from "react";
import { Avatar } from "~/components/avatar";
import { Chat } from "~/components/chat";
import { queryClient } from "~/components/providers";
import { useMessages } from "~/hooks/use-messages";
import { useSendMessage } from "~/hooks/use-send-message";
import { getMessages, readMessages } from "~/lib/queries";
import type { Conversation } from "~/lib/types";
import { getInitials } from "~/lib/utils";
import { USER_ID } from "~/root";

interface setReadMessagesParams {
  conversationId: string;
  unreadMessages: number;
}

function setReadMessages({
  conversationId,
  unreadMessages,
}: setReadMessagesParams) {
  queryClient.setQueryData(
    ["conversations", USER_ID],
    (prev: Conversation[]) => {
      const updated = prev.map((conversation) => {
        if (conversation.id === Number(conversationId)) {
          return {
            ...conversation,
            unreadMessages,
          };
        }

        return conversation;
      });

      return updated;
    }
  );
}

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const { conversationId } = params;

  await queryClient.prefetchQuery({
    queryKey: ["messages", conversationId, USER_ID],
    queryFn: () => getMessages({ conversationId, senderUserId: USER_ID }),
    staleTime: Infinity,
  });
}

export default function ChatId({
  params: { conversationId },
}: Route.ComponentProps) {
  const messages = useMessages({
    conversationId,
    senderUserId: USER_ID,
  });

  const sendMessageMutation = useSendMessage({
    conversationId,
    receptorId: messages?.receptor.id ?? 0,
  });

  useEffect(() => {
    readMessages({ conversationId, senderUserId: USER_ID });
    setReadMessages({ conversationId, unreadMessages: 0 });
  }, [messages]);

  const usernameInitials = getInitials(messages?.receptor.username ?? "");

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key !== "Enter") return;

    const value = (e.target as HTMLInputElement).value.trim();

    if (!value) return;

    sendMessageMutation.mutate(value);
    (e.target as HTMLInputElement).value = "";
  }

  function focusOnView(node: HTMLInputElement) {
    node?.focus();
  }

  return (
    <div className="border-l border-zinc-500 flex flex-col h-full max-h-dvh">
      <div className="bg-zinc-950 h-16 flex items-center p-4 gap-4">
        <Avatar usernameInitials={usernameInitials} size="SMALL" />
        <span className="text-zinc-100">{messages?.receptor.username}</span>
      </div>
      <Chat messages={messages?.messages} />
      <div className="border-t border-zinc-500">
        <input
          ref={focusOnView}
          type="text"
          className="h-12 px-4 w-full focus:outline-none"
          placeholder="Type a message..."
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
}
