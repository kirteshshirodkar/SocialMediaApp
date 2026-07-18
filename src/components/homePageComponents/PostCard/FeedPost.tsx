"use client";

import { FeedPostProps } from "./types";
import PostHeader from "./PostHeader";
import PostImage from "./PostImage";
import PostActions from "./PostActions";
import PostFooter from "./PostFooter";
import { useState } from "react";
import CommentModal from "./CommentModal";

export default function FeedPost({ post }: FeedPostProps) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <PostHeader post={post} />

      <PostImage post={post} />

      <div className="px-4 py-3">
        <PostActions
          liked={liked}
          saved={saved}
          onLike={() => setLiked(!liked)}
          onSave={() => setSaved(!saved)}
          onComment={() => setCommentsOpen(true)}
        />

        <PostFooter post={post} onViewComments={() => setCommentsOpen(true)} />
        <CommentModal
          open={commentsOpen}
          onClose={() => setCommentsOpen(false)}
          post={post}
        />
      </div>
    </div>
  );
}
