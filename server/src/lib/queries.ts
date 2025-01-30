import { db } from "./db";

interface GetMessagesParams {
  conversationId: string;
  senderUserId: string;
}

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

export function getMessages({
  conversationId,
  senderUserId,
}: GetMessagesParams) {
  const messages = db
    .query(
      `SELECT m.id, m.sender_id, m.content, u.id AS receptor_id, u.username AS receptor_username
     FROM messages m
     JOIN conversations c ON m.conversation_id = c.id
     JOIN users u ON (u.id = c.user_a_id OR u.id = c.user_b_id) AND u.id != $senderUserId
     WHERE m.conversation_id = $conversationId
     ORDER BY m.created_at ASC`
    )
    .all({
      $senderUserId: Number(senderUserId),
      $conversationId: Number(conversationId),
    }) as any; // set as any because this part is not the key of this poc

  if (messages.length === 0) {
    return null;
  }

  const receptor = {
    id: messages[0].receptor_id,
    username: messages[0].receptor_username,
  };

  const formattedMessages = messages.map((message: any) => ({
    // set as any because this part is not the key of this poc
    id: message.id,
    isFromMe: message.sender_id === Number(senderUserId),
    content: message.content,
  }));

  return {
    receptor,
    messages: formattedMessages,
  };
}
