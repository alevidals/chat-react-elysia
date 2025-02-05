import { cn } from "~/lib/utils";

type Size = "SMALL" | "LARGE";

interface Props {
  usernameInitials: string;
  size: Size;
}

type SizeClasses = {
  [key in Size]: string;
};

const sizeClasses: SizeClasses = {
  SMALL: "text-lg",
  LARGE: "text-2xl",
};

export function Avatar({ usernameInitials, size }: Props) {
  const className = cn(
    "h-full aspect-square bg-white rounded-full flex items-center justify-center",
    sizeClasses[size]
  );

  return (
    <div className={className}>
      <span className="text-black">{usernameInitials}</span>
    </div>
  );
}
