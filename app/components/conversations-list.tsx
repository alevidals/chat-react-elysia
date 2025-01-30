import { Link, useParams } from "react-router";
import { useConversations } from "~/hooks/use-conversations";
import { cn } from "~/lib/utils";
import { USER_ID } from "~/root";

export function ConversationsList() {
  const { conversations } = useConversations(USER_ID);
  const { conversationId } = useParams();

  return (
    <ul className="bg-zinc-950 flex flex-col">
      {conversations?.map((conversation) => {
        return (
          <li key={conversation.id}>
            {
              <Link
                to={`/${conversation.id}`}
                className={cn(
                  "h-20 p-4 flex items-center gap-6 hover:bg-zinc-800",
                  {
                    "bg-zinc-800": conversation.id === Number(conversationId),
                  }
                )}
              >
                <img
                  className="h-full w-auto bg-white rounded-full"
                  src="https://avataaars.io/?avatarStyle=Transparent&topType=ShortHairShortRound&accessoriesType=Blank&hairColor=BrownDark&facialHairType=Blank&clotheType=BlazerShirt&eyeType=Default&eyebrowType=Default&mouthType=Default&skinColor=Light"
                />
                <span
                  className={cn("text-zinc-100", {
                    "font-semibold": conversation.id === Number(conversationId),
                  })}
                >
                  {conversation.username}
                </span>
              </Link>
            }
          </li>
        );
      })}
    </ul>
  );
}
