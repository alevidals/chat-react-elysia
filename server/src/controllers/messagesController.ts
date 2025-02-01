import Elysia, { t } from "elysia";
import { addMessage, getMessages } from "../lib/queries";

export const messagesController = new Elysia()
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
  );
