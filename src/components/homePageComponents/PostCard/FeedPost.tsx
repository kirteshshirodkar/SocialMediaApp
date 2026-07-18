"use client";

import { FeedPostProps } from "./types";
import PostHeader from "./PostHeader";
import PostImage from "./PostImage";
import PostActions from "./PostActions";
import PostFooter from "./PostFooter";

export default function FeedPost({ post }: FeedPostProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <PostHeader post={post} />

      <PostImage post={post} />

      <div className="px-4 py-3">
        <PostActions />

        <PostFooter post={post} />
      </div>
    </div>
  );
}