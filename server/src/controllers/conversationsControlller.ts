import Elysia, { t } from "elysia";
import { getConversations } from "../lib/queries";

const webSocketConversationsSchema = t.Union([
  t.Object({
    type: t.Literal("newMessage"),
    conversationId: t.String(),
    content: t.String(),
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
          const { conversationId, content } = message;

          ws.publish("conversations", {
            type: "newMessage",
            conversationId,
            content,
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
