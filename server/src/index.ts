import cors from "@elysiajs/cors";
import { Elysia, t } from "elysia";
import { conversationsController } from "./controllers/conversationsControlller";
import { messagesController } from "./controllers/messagesController";
import { initDb } from "./lib/db";
import { logger } from "./lib/logger";

initDb();

const app = new Elysia()
  .use(cors())
  .use(logger)
  .use(conversationsController)
  .use(messagesController)
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}\n`
);
