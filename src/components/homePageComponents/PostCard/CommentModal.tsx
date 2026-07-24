"use client";

import { X } from "lucide-react";

import { PostType } from "./types";
import CommentList from "./CommentList";
import CommentInput from "./CommentInput";

type Props = {
  open: boolean;
  onClose: () => void;
  post: PostType;
};

export default function CommentModal({ open, onClose, post }: Props) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white rounded-2xl w-full max-w-5xl h-[90vh] overflow-hidden"
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 bg-white rounded-full p-2 shadow hover:bg-gray-100"
        >
          <X size={20} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 h-full">
          {/* Image */}
          <div className="hidden md:block bg-black">Image goes here</div>

          {/* Right */}
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="border-b px-4 py-4 font-semibold text-center">
              Comments
            </div>

            {/* Comments */}
            <CommentList comments={post.comments} postOwnerId={post.user.id} />

            {/* Input */}
            <CommentInput postId={post.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
