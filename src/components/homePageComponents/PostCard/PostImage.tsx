"use client";

import Image from "next/image";
import { FeedPostProps } from "./types";

export default function PostImage({ post }: FeedPostProps) {
  return (
    <div className="relative aspect-square w-full bg-gray-100">
      {post.imageUrl && (
        <Image
          src={post.imageUrl}
          alt={post.caption || "Post"}
          fill
          sizes="(max-width:768px)100vw,600px"
          className="object-cover"
        />
      )}
    </div>
  );
}