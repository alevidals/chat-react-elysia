import { db } from "./db";

export function getConversations(userId: string) {
  const query = db.query(
    `
  SELECT c.id, u.id as userId, u.username
  FROM conversations c
  JOIN users u ON u.id = c.user_a_id
  WHERE c.user_b_id = $userId
  UNION
  SELECT c.id, u.id, u.username
  FROM conversations c
  JOIN users u ON u.id = c.user_b_id
  WHERE c.user_a_id = $userId
`
  );

  const conversations = query.all({ $userId: userId });

  return conversations;
}
