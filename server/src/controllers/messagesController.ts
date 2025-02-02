import Elysia, { t } from "elysia";
import { addMessage, getMessages, readMessages } from "../lib/queries";

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
    open: (ws) => {
      ws.subscribe("chat");
    },
    message: (ws, message) => {
      const types = {
        newMessage: () => {
          const { conversationId, receiverId } = message;

          ws.publish("chat", {
            type: "newMessage",
            receiverId,
            conversationId,
          });
        },
      };

      types[message.type]();
    },
    close: (ws) => {
      ws.unsubscribe("chat");
    },
  })
  .get("/messages/:conversationId/:senderUserId", ({ params }) => {
    const { conversationId, senderUserId } = params;
    const messages = getMessages({ conversationId, senderUserId });

    return messages;
  })
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
  )
  .post(
    "/messages/:conversationId/:senderUserId/read",
    ({ params, server }) => {
      const { conversationId, senderUserId } = params;

      const ids = readMessages({ conversationId, senderUserId });

      server?.publish(
        "chat",
        JSON.stringify({
          type: "readedMessages",
          conversationId,
          readedMessages: ids,
        })
      );
    }
  );
