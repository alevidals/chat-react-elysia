import type { Route } from ".react-router/types/app/routes/+types/$conversationId";
import { Link } from "react-router";

export default function ChatId({
  params: { conversationId },
}: Route.ComponentProps) {
  return (
    <div>
      <h1>ChatId {conversationId}</h1>

      <Link to="/1">Chat 1</Link>
      <Link to="/2">Chat 2</Link>
    </div>
  );
}
