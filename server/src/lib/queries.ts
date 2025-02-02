import { db } from "./db";

interface GetMessagesParams {
  conversationId: string;
  senderUserId: string;
}

interface AddMessageParams {
  conversationId: string;
  senderUserId: string;
  content: string;
}

interface ReadMessagesParams {
  conversationId: string;
  senderUserId: string;
}

export function getConversations(userId: string) {
  const query = db.query(
    `
    SELECT c.id, u.id as userId, u.username, 
           (SELECT m.content 
            FROM messages m 
            WHERE m.conversation_id = c.id 
            ORDER BY m.created_at DESC 
            LIMIT 1) as lastMessage
    FROM conversations c
    JOIN users u ON u.id = c.user_a_id
    WHERE c.user_b_id = $userId
    UNION
    SELECT c.id, u.id, u.username, 
           (SELECT m.content 
            FROM messages m 
            WHERE m.conversation_id = c.id 
            ORDER BY m.created_at DESC 
            LIMIT 1) as lastMessage
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
      `SELECT m.id, m.created_at, m.sender_id, m.content, u.id AS receptor_id, u.username AS receptor_username, readed
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
    createdAt: message.created_at,
    isRead: message.readed === 1,
  }));

  return {
    receptor,
    messages: formattedMessages,
  };
}

export function addMessage({
  conversationId,
  senderUserId,
  content,
}: AddMessageParams) {
  try {
    db.query(
      `INSERT INTO messages (conversation_id, sender_id, content)
     VALUES ($conversationId, $senderUserId, $content)`
    ).all({
      $conversationId: Number(conversationId),
      $senderUserId: Number(senderUserId),
      $content: content,
    });

    return true;
  } catch {
    return false;
  }
}

export function readMessages({
  conversationId,
  senderUserId,
}: ReadMessagesParams) {
  const messagesIds = db
    .query(
      `SELECT m.id
     FROM messages m
     WHERE m.conversation_id = $conversationId
     AND m.sender_id != $senderUserId
     AND m.readed = 0`
    )
    .all({
      $conversationId: Number(conversationId),
      $senderUserId: Number(senderUserId),
    })
    .map((m: any) => m.id);

  db.query(
    `UPDATE messages
     SET readed = 1
     WHERE id IN (${messagesIds})`
  ).run();

  return messagesIds;
}
