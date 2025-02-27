import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
  useNavigate,
  useParams,
} from "react-router";

import type { Route } from "./+types/root";
import "~/app.css";
import { Providers, queryClient } from "~/components/providers";
import { getConversations } from "~/lib/queries";
import { ConversationsList } from "~/components/conversations-list";
import { useEffect } from "react";
import { Spinner } from "~/components/spinner";
import { useWebSocket } from "~/hooks/use-websocket";
import type { Conversation, Messages } from "~/lib/types";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Providers>{children}</Providers>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export const USER_ID = import.meta.env.VITE_USER_ID;

export async function clientLoader() {
  await queryClient.prefetchQuery({
    queryKey: ["conversations", USER_ID],
    queryFn: () => getConversations(USER_ID),
    staleTime: Infinity,
  });
}

export default function App() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const { conversationId } = useParams();

  const { onMessage: onConversationMessage } = useWebSocket({
    pathname: "conversations",
  });

  const { onMessage: onMessagesMessage } = useWebSocket({
    pathname: "messages",
  });

  useEffect(() => {
    onConversationMessage((event) => {
      const data = JSON.parse(event.data);

      if (data.type === "newMessage") {
        queryClient.setQueryData(
          ["conversations", USER_ID],
          (prevConversation: Conversation[]) => {
            const updatedConversations = prevConversation.map(
              (conversation) => {
                if (String(conversation.id) === data.conversationId) {
                  return {
                    ...conversation,
                    lastMessage: data.content,
                    unreadMessages: data.unreadMessages ?? 0,
                  };
                }

                return conversation;
              }
            );

            return updatedConversations;
          }
        );
      }
    });
  }, []);

  useEffect(() => {
    onMessagesMessage((event) => {
      const data = JSON.parse(event.data);

      if (data.type === "newMessage" && data.receiverId === Number(USER_ID)) {
        queryClient.invalidateQueries({
          queryKey: ["messages", data.conversationId, USER_ID],
          // refetchType a all para que actualice los mensajes tanto si están renderizados como no
          refetchType: "all",
        });
      } else if (
        data.type === "readedMessages" &&
        data.conversationId === conversationId
      ) {
        queryClient.setQueryData(
          ["messages", conversationId, USER_ID],
          (prevMessages: Messages) => {
            const updatedMessages = prevMessages.messages.map((message) => {
              if (data.readedMessages.includes(message.id)) {
                return {
                  ...message,
                  isRead: true,
                };
              }

              return message;
            });

            return {
              ...prevMessages,
              messages: updatedMessages,
            };
          }
        );
      }
    });
  }, [conversationId]);

  return (
    <div className="grid grid-cols-[20rem_1fr] lg:grid-cols-[26.25rem_1fr] h-dvh max-h-dvh">
      <ConversationsList />
      <Outlet />
    </div>
  );
}

export function HydrateFallback() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <Spinner />
    </div>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
