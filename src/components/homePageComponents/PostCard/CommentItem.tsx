"use client";

import Image from "next/image";
import { Heart } from "lucide-react";
import { CommentType } from "./types";

type Props = {
  comment: CommentType;
};

export default function CommentItem({ comment }: Props) {
  return (
    <div className="flex gap-3 px-4 py-3">
      {/* Avatar */}
      <div className="relative w-9 h-9 flex-shrink-0">
        {comment.user.imageUrl ? (
          <Image
            src={comment.user.imageUrl}
            alt={comment.user.username}
            fill
            sizes="36px"
            className="rounded-full object-cover"
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-gray-300" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1">
        <p className="text-sm">
          <span className="font-semibold mr-2">
            {comment.user.username}
          </span>

          {comment.content}
        </p>

        <div className="flex gap-4 mt-1 text-xs text-gray-500">
          <span>{comment.createdAt}</span>

          <button>Reply</button>
        </div>
      </div>

      {/* Like */}
      <button className="self-start">
        <Heart
          size={14}
          className="text-gray-400 hover:text-red-500 transition"
        />
      </button>
    </div>
  );
}