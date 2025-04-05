import React from "react";
import { ImSpinner2 } from "react-icons/im";
import clsx from "clsx";

interface SpinnerProps {
  size?: number; // icon size in px
  className?: string;
  centered?: boolean;
  minHeight?: string;
}

export default function Spinner({
  size = 80,
  className = "",
  centered = true,
  minHeight = "500px",
}: SpinnerProps) {
  return (
    <div
      className={clsx(
        centered && "flex items-center justify-center",
        "w-full h-full",
        className
      )}
      style={{ minHeight }}
    >
      <ImSpinner2
        className="animate-spin text-muted-foreground"
        style={{ fontSize: `${size}px` }}
      />
    </div>
  );
}
