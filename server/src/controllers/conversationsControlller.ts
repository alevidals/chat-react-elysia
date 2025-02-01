import Elysia from "elysia";
import { getConversations } from "../lib/queries";

export const conversationsController = new Elysia().get(
  "/conversations/:userId",
  ({ params }) => {
    const { userId } = params;

    const conversations = getConversations(userId);

    return conversations;
  }
);
