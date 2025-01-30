import { db } from "./db";

export function getConversations(userId: string) {
  const query = db.query(
    "SELECT * FROM conversations where user_a_id = $userId OR user_b_id = $userId;"
  );

  const conversations = query.all({ $userId: userId });

  return conversations;
}
