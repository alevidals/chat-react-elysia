import type { Conversation, Messages } from "./types";

interface GetMessagesParams {
  conversationId: string;
  senderUserId: string;
}

export async function getConversations(userId: string) {
  const delay = Math.floor(Math.random() * 2000) + 1000;
  await new Promise((resolve) => setTimeout(resolve, delay));
  const response = await fetch(`http://localhost:3000/conversations/${userId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch conversations");
  }

  const data: Conversation[] = await response.json();

  return data;
}

export async function getMessages({
  conversationId,
  senderUserId,
}: GetMessagesParams) {
  // const delay = Math.floor(Math.random() * 2000) + 1000;
  // await new Promise((resolve) => setTimeout(resolve, delay));

  const response = await fetch(
    `http://localhost:3000/messages/${conversationId}/${senderUserId}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch messages");
  }

  const data: Messages = await response.json();

  return data;
}
