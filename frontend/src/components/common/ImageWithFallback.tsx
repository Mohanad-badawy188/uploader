import { useState } from "react";
import Image, { ImageProps } from "next/image";

interface Props extends Omit<ImageProps, "src" | "alt"> {
  src: string;
  alt: string;
  fallbackSrc?: string;
}

export function ImageWithFallback({
  src,
  fallbackSrc = "/no-image.png",
  alt,
  ...props
}: Props) {
  const [error, setError] = useState(false);

  return (
    <Image
      src={error ? fallbackSrc : src}
      {...props}
      alt={alt}
      onError={() => setError(true)}
    />
  );
}
