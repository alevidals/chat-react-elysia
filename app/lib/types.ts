export interface Conversation {
  id: number;
  userId: number;
  username: string;
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
  }[];
}
