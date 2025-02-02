import type { Route } from ".react-router/types/app/routes/+types/$conversationId";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Avatar } from "~/components/avatar";
import { Chat } from "~/components/chat";
import { queryClient } from "~/components/providers/providers";
import { useMessages } from "~/hooks/use-messages";
import { addMessage, getMessages } from "~/lib/queries";
import { getInitials } from "~/lib/utils";
import { USER_ID } from "~/root";

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
  const { messages } = useMessages({
    conversationId,
    senderUserId: USER_ID,
  });

  const [socket] = useState(() => {
    const ws = new WebSocket(
      `ws://localhost:3000/messages?conversationId=${conversationId}`
    );
    return ws;
  });

  const usernameInitials = getInitials(messages?.receptor.username ?? "A A ");

  const mutation = useMutation({
    mutationFn: async (content: string) => {
      if (!messages) return;

      await addMessage({
        conversationId: conversationId,
        senderUserId: USER_ID,
        content,
      });

      socket.send(
        JSON.stringify({
          type: "newMessage",
          receiverId: messages.receptor.id,
          conversationId,
        })
      );
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["messages", conversationId, USER_ID],
      });
    },
  });

  useEffect(() => {
    if (!socket) return;

    socket.addEventListener("open", () => {
      socket.send(
        JSON.stringify({
          type: "newMessage",
          receiverId: 1,
          conversationId,
        })
      );
    });

    socket.addEventListener("message", async (event) => {
      const data = JSON.parse(event.data);

      if (
        data.type === "newMessage" &&
        data.conversationId === conversationId &&
        data.receiverId === Number(USER_ID)
      ) {
        queryClient.invalidateQueries({
          queryKey: ["messages", conversationId, USER_ID],
        });
      }
    });
  }, []);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key !== "Enter") return;

    const value = (e.target as HTMLInputElement).value.trim();

    if (!value) return;

    mutation.mutate(value);
    (e.target as HTMLInputElement).value = "";
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
          type="text"
          className="h-12 px-4 w-full focus:outline-none"
          placeholder="Type a message..."
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
}
