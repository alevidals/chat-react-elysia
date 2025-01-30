import type { Route } from ".react-router/types/app/routes/+types/$conversationId";
import { queryClient } from "~/components/providers";
import { useMessages } from "~/hooks/use-messages";
import { getMessages } from "~/lib/queries";
import { cn } from "~/lib/utils";
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
    conversationId: conversationId,
    senderUserId: USER_ID,
  });

  return (
    <div className="border-l border-zinc-800 flex flex-col h-full max-h-dvh">
      <div className="bg-zinc-950 h-16 flex items-center p-4 gap-4">
        <img
          className="h-10 bg-white rounded-full"
          src="https://avataaars.io/?avatarStyle=Transparent&topType=ShortHairShortRound&accessoriesType=Blank&hairColor=BrownDark&facialHairType=Blank&clotheType=BlazerShirt&eyeType=Default&eyebrowType=Default&mouthType=Default&skinColor=Light"
        />
        <span className="text-zinc-100">{messages?.receptor.username}</span>
      </div>
      <div className="flex-1 overflow-y-scroll p-4">
        <ul>
          {messages?.messages.map((message) => (
            <li
              key={message.id}
              className={cn(
                "flex gap-4",
                message.isFromMe ? "justify-end" : "justify-start"
              )}
            >
              <div>
                <span className="text-zinc-100">
                  {message.isFromMe ? "You" : messages?.receptor.username}:
                </span>
                <p className="text-zinc-300">{message.content}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="border-t border-zinc-500">
        <input
          type="text"
          className="h-12 w-full px-4"
          placeholder="Type a message"
        />
      </div>
    </div>
  );
}
