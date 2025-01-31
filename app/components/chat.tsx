import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import type { Messages } from "~/lib/types";
import { cn } from "~/lib/utils";

interface Props {
  messages: Messages["messages"] | undefined;
}

type MessageProps = Omit<Messages["messages"][number], "id">;

function Message({ content, isFromMe, createdAt }: MessageProps) {
  const isFromMeClassName = "bg-blue-400 ml-auto";
  const isNotFromMeClassName = "bg-zinc-800 mr-auto";

  const className = cn("w-fit flex max-w-md p-2 rounded-xl", {
    [isFromMeClassName]: isFromMe,
    [isNotFromMeClassName]: !isFromMe,
  });

  const date = new Date(createdAt);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return (
    <li className={className}>
      <span>{content}</span>
      <span className="text-xs text-zinc-300 ml-2 self-end">
        {hours}:{minutes}
      </span>
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
        {messages?.map(({ id, content, isFromMe, createdAt }) => (
          <Message
            key={id}
            content={content}
            isFromMe={isFromMe}
            createdAt={createdAt}
          />
        ))}
      </ul>
      <div ref={scrollIntoView} />
    </div>
  );
}
