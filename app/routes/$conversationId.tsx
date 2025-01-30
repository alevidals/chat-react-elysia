import type { Route } from ".react-router/types/app/routes/+types/$conversationId";
import { queryClient } from "~/components/providers";
import { useConversation } from "~/hooks/use-conversation";
import { useConversations } from "~/hooks/use-conversations";
import { getConversations } from "~/lib/queries";
import { USER_ID } from "~/root";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const { conversationId } = params;

  await queryClient.prefetchQuery({
    queryKey: ["conversation", USER_ID, conversationId],
    queryFn: async () => {
      const { conversations } = useConversations(USER_ID);
      console.log(conversations);

      if (!conversations) return null;

      return conversations.find(
        (conversation) => conversation.id === Number(conversationId)
      );
    },
    staleTime: Infinity,
  });
}

export default function ChatId({
  params: { conversationId },
}: Route.ComponentProps) {
  const { conversation } = useConversation(conversationId);

  console.log(conversation);

  return (
    <div className="border-l border-zinc-800">
      <div className="bg-zinc-950 h-16 flex items-center p-4 gap-4">
        <img
          className="h-10 bg-white rounded-full"
          src="https://avataaars.io/?avatarStyle=Transparent&topType=ShortHairShortRound&accessoriesType=Blank&hairColor=BrownDark&facialHairType=Blank&clotheType=BlazerShirt&eyeType=Default&eyebrowType=Default&mouthType=Default&skinColor=Light"
        />
        {/* <span className="text-zinc-100">{conversation.username}</span> */}
      </div>
    </div>
  );
}
