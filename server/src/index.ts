import cors from "@elysiajs/cors";
import { Elysia, t } from "elysia";
import { conversationsController } from "./controllers/conversationsControlller";
import { messagesController } from "./controllers/messagesController";
import { initDb } from "./lib/db";
import { logger } from "./lib/logger";

initDb();

const type = t.Union([
  t.Object({
    type: t.Literal("newMessage"),
    receiverId: t.Number(),
    conversationId: t.String(),
  }),
  t.Object({
    type: t.Literal("newConversation"),
    receiverId: t.String(),
  }),
]);

const app = new Elysia()
  .use(cors())
  .use(logger)
  .ws("/ws", {
    body: type,
    open: (ws) => {
      ws.subscribe("chat");
      console.log("WebSocket connected");
    },
    message: (ws, message) => {
      console.log("WebSocket message", message);
      if (message.type === "newMessage") {
        const { conversationId, receiverId } = message;

        ws.publish("chat", {
          type: "newMessage",
          receiverId,
          conversationId,
        });
      }
    },
    close: () => {
      console.log("WebSocket closed");
    },
  })
  .use(conversationsController)
  .use(messagesController)
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}\n`
);
