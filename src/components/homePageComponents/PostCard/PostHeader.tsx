"use client";

import Image from "next/image";
import Link from "next/link";
import { MoreHorizontal } from "lucide-react";
import { FeedPostProps } from "./types";

export default function PostHeader({ post }: FeedPostProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <Link
        href={`/profile/${post.user.username}`}
        className="flex items-center gap-3"
      >
        {post.user.imageUrl ? (
          <div className="relative w-10 h-10">
            <Image
              src={post.user.imageUrl}
              alt={post.user.username}
              fill
              sizes="40px"
              className="rounded-full object-cover"
            />
          </div>
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-200" />
        )}

        <div>
          <p className="font-semibold text-sm">
            {post.user.username}
          </p>

          <p className="text-xs text-gray-500">
            Suggested for you
          </p>
        </div>
      </Link>

      <button className="text-gray-500 hover:text-black">
        <MoreHorizontal size={20} />
      </button>
    </div>
  );
}