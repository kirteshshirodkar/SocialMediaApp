"use client";

import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
} from "lucide-react";

type PostActionsProps = {
  liked: boolean;
  saved: boolean;

  onLike: () => void;
  onSave: () => void;
  onComment: () => void;
};

export default function PostActions({
  liked,
  saved,
  onLike,
  onSave,
  onComment,
}: PostActionsProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-5">
        {/* Like */}
        <button
          onClick={onLike}
          className="hover:scale-110 transition"
        >
          <Heart
            size={26}
            className={
              liked
                ? "fill-red-500 text-red-500"
                : "text-gray-800"
            }
          />
        </button>

        {/* Comment */}
        <button
          onClick={onComment}
          className="hover:scale-110 transition"
        >
          <MessageCircle size={25} />
        </button>

        {/* Share */}
        <button className="hover:scale-110 transition">
          <Share2 size={24} />
        </button>
      </div>

      {/* Save */}
      <button
        onClick={onSave}
        className="hover:scale-110 transition"
      >
        <Bookmark
          size={24}
          className={
            saved
              ? "fill-black text-black"
              : "text-gray-800"
          }
        />
      </button>
    </div>
  );
}