import { Elysia } from "elysia";
import { initDb } from "./lib/db";
import { getConversations } from "./lib/queries";
import cors from "@elysiajs/cors";

initDb();

const app = new Elysia()
  .use(cors())
  .get("/", () => "Hello Elysia")
  .get("/conversations/:userId", ({ params: { userId } }) => {
    console.log(`Fetching conversations for user ${userId}`);
    const conversations = getConversations(userId);

    return conversations;
  })
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
