"use client";

import { FeedPostProps } from "./types";

type PostFooterProps = FeedPostProps & {
  onViewComments: () => void;
};

export default function PostFooter({ post, onViewComments }: PostFooterProps) {
  return (
    <>
      <p className="font-semibold text-sm mt-3">245 likes</p>

      <div className="mt-2 text-sm">
        <span className="font-semibold mr-2">{post.user.username}</span>

        <span>{post.caption}</span>
      </div>

      <button
        onClick={onViewComments}
        className="text-gray-500 text-sm mt-2 hover:text-gray-700"
      >
        View all 18 comments
      </button>

      <p className="text-xs uppercase tracking-wide text-gray-400 mt-3">
        {new Intl.DateTimeFormat("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }).format(new Date(post.createdAt))}
      </p>
    </>
  );
}
