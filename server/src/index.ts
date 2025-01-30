import cors from "@elysiajs/cors";
import { logger } from "@grotto/logysia";
import { Elysia } from "elysia";
import { initDb } from "./lib/db";
import { getConversations } from "./lib/queries";

initDb();

const app = new Elysia()
  .use(cors())
  .use(
    logger({
      logIP: false,
      writer: {
        write(msg: string) {
          console.log(msg);
        },
      },
    })
  )
  .get("/", () => "Hello Elysia")
  .get("/conversations/:userId", ({ params: { userId } }) => {
    const conversations = getConversations(userId);

    return conversations;
  })
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}\n`
);
