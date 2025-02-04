import Elysia, { t } from "elysia";
import { getConversations, getUnreadCount } from "../lib/queries";

const webSocketConversationsSchema = t.Union([
  t.Object({
    type: t.Literal("newMessage"),
    conversationId: t.String(),
    content: t.String(),
    receiverId: t.String(),
  }),
]);

export const conversationsController = new Elysia()
  .ws("/conversations", {
    body: webSocketConversationsSchema,
    open: (ws) => {
      ws.subscribe("conversations");
    },
    message: (ws, message) => {
      const types = {
        newMessage: () => {
          const { conversationId, content, receiverId } = message;

          const unreadMessages = getUnreadCount({
            conversationId,
            receiverId,
          });

          ws.publish("conversations", {
            type: "newMessage",
            conversationId,
            content,
            unreadMessages,
          });
        },
      };

      types[message.type]();
    },
    close: (ws) => {
      ws.unsubscribe("conversations");
    },
  })
  .get("/conversations/:userId", ({ params }) => {
    const { userId } = params;

    const conversations = getConversations(userId);

    return conversations;
  });
