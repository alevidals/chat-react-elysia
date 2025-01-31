import { Link, useParams } from "react-router";
import { Avatar } from "~/components/avatar";
import { useConversations } from "~/hooks/use-conversations";
import { cn, getInitials } from "~/lib/utils";
import { USER_ID } from "~/root";

export function ConversationsList() {
  const { conversations } = useConversations(USER_ID);
  const { conversationId } = useParams();

  return (
    <ul className="bg-zinc-950 flex flex-col gap-2 p-4">
      {conversations?.map((conversation) => {
        const usernameInitials = getInitials(conversation.username);

        return (
          <li key={conversation.id}>
            {
              <Link
                to={`/${conversation.id}`}
                className={cn(
                  "h-20 p-4 flex items-center gap-4 hover:bg-zinc-900 rounded-2xl",
                  {
                    "bg-blue-400 hover:bg-blue-400":
                      conversation.id === Number(conversationId),
                  }
                )}
              >
                <Avatar usernameInitials={usernameInitials} size="LARGE" />
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
