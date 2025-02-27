export interface Conversation {
  id: number;
  userId: number;
  username: string;
  lastMessage: string;
  unreadMessages: number;
}

export interface Messages {
  receptor: {
    id: number;
    username: string;
  };
  messages: {
    id: number;
    isFromMe: boolean;
    content: string;
    createdAt: string;
    isRead: boolean;
  }[];
}
