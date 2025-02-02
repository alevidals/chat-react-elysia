import { CheckCheck } from "lucide-react";
import type { Messages } from "~/lib/types";
import { cn } from "~/lib/utils";

interface Props {
  messages: Messages["messages"] | undefined;
}

type MessageProps = Omit<Messages["messages"][number], "id">;

function Message({ content, isFromMe, createdAt, isRead }: MessageProps) {
  const isFromMeClassName = "bg-blue-400 ml-auto";
  const isNotFromMeClassName = "bg-zinc-800 mr-auto";

  const className = cn("w-fit flex max-w-md px-4 py-3 rounded-xl", {
    [isFromMeClassName]: isFromMe,
    [isNotFromMeClassName]: !isFromMe,
  });

  const date = new Date(createdAt);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return (
    <li className={className}>
      <span>{content}</span>
      <div className="ml-2 flex self-end gap-2">
        <span className="text-xs text-zinc-300">
          {hours}:{minutes}
        </span>
        <CheckCheck
          size={15}
          strokeWidth={3}
          className={cn({
            "text-zinc-300": !isRead,
            "text-blue-600": isRead,
          })}
        />
      </div>
    </li>
  );
}

export function Chat({ messages }: Props) {
  function scrollIntoView(node: HTMLDivElement) {
    node?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="flex-1 overflow-y-scroll py-4 px-10">
      <ul className="flex flex-col gap-6">
        {messages?.map(({ id, content, isFromMe, createdAt, isRead }) => (
          <Message
            key={id}
            content={content}
            isFromMe={isFromMe}
            createdAt={createdAt}
            isRead={isRead}
          />
        ))}
      </ul>
      <div ref={scrollIntoView} />
    </div>
  );
}
