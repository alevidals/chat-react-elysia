import Elysia, { t } from "elysia";
import { addMessage, getMessages } from "../lib/queries";

const webSocketMessageSchema = t.Union([
  t.Object({
    type: t.Literal("newMessage"),
    receiverId: t.Number(),
    conversationId: t.String(),
  }),
]);

export const messagesController = new Elysia()
  .ws("/messages", {
    body: webSocketMessageSchema,
    query: t.Object({
      conversationId: t.String(),
    }),
    open: (ws) => {
      const { conversationId } = ws.data.query;
      ws.subscribe(conversationId);
    },
    message: (ws, message) => {
      const types = {
        newMessage: () => {
          const { conversationId, receiverId } = message;

          ws.publish(conversationId, {
            type: "newMessage",
            receiverId,
            conversationId,
          });
        },
      };

      types[message.type]();
    },
    close: (ws) => {
      const { conversationId } = ws.data.query;
      ws.unsubscribe(conversationId);
    },
  })
  .get(
    "/messages/:conversationId/:senderUserId",
    ({ params, server, request }) => {
      const { conversationId, senderUserId } = params;

      server?.upgrade(request, {
        data: {
          conversationId,
        },
      });

      const messages = getMessages({ conversationId, senderUserId });

      return messages;
    }
  )
  .post(
    "/messages/:conversationId/:senderUserId",
    ({ params, body, error }) => {
      const { conversationId, senderUserId } = params;

      const success = addMessage({
        conversationId,
        senderUserId,
        content: body.content,
      });

      if (!success) {
        return error(500, "Failed to send message");
      }
    },
    {
      body: t.Object({
        content: t.String(),
      }),
    }
  );
