import { API_URL } from "~/lib/env";
import type { Conversation, Messages } from "~/lib/types";

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

export async function getConversations(userId: string) {
  const response = await fetch(`${API_URL}/conversations/${userId}`);

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
  const response = await fetch(
    `${API_URL}/messages/${conversationId}/${senderUserId}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch messages");
  }

  const data: Messages = await response.json();

  return data;
}

export async function addMessage({
  conversationId,
  senderUserId,
  content,
}: AddMessageParams) {
  const response = await fetch(
    `${API_URL}/messages/${conversationId}/${senderUserId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to send message");
  }

  return true;
}

export async function readMessages({
  conversationId,
  senderUserId,
}: ReadMessagesParams) {
  const response = await fetch(
    `${API_URL}/messages/${conversationId}/${senderUserId}/read`,
    {
      method: "POST",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to mark messages as read");
  }

  return true;
}
