"use client";

import { FeedPostProps } from "./types";
import PostHeader from "./PostHeader";
import PostImage from "./PostImage";
import PostActions from "./PostActions";
import PostFooter from "./PostFooter";
import { useEffect, useState } from "react";
import CommentModal from "./CommentModal";

export default function FeedPost({ post }: FeedPostProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post._count.likes);
  const [likeLoading, setLikeLoading] = useState(false);

  const [saved, setSaved] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);

  // Check whether current user already liked this post
  useEffect(() => {
    const checkLikeStatus = async () => {
      try {
        const response = await fetch(
          `/api/posts/${post.id}/like`
        );

        if (!response.ok) {
          return;
        }

        const data = await response.json();

        setLiked(data.liked);
      } catch (error) {
        console.error("Failed to check like status:", error);
      }
    };

    checkLikeStatus();
  }, [post.id]);

  // Like / Unlike
  const handleLike = async () => {
    if (likeLoading) return;

    setLikeLoading(true);

    const previousLiked = liked;
    const previousCount = likeCount;

    // Optimistic UI update
    setLiked(!liked);
    setLikeCount(
      liked
        ? Math.max(0, likeCount - 1)
        : likeCount + 1
    );

    try {
      const response = await fetch(
        `/api/posts/${post.id}/like`,
        {
          method: liked ? "DELETE" : "POST",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to update like"
        );
      }

      // Use database values
      setLiked(data.liked);
      setLikeCount(data.likeCount);
    } catch (error) {
      console.error("Like error:", error);

      // Roll back optimistic update
      setLiked(previousLiked);
      setLikeCount(previousCount);
    } finally {
      setLikeLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <PostHeader post={post} />

      <PostImage post={post} />

      <div className="px-4 py-3">
        <PostActions
          liked={liked}
          saved={saved}
          onLike={handleLike}
          onSave={() => setSaved(!saved)}
          onComment={() => setCommentsOpen(true)}
          likeLoading={likeLoading}
        />

        <PostFooter
          post={post}
          likeCount={likeCount}
          onViewComments={() => setCommentsOpen(true)}
        />

        <CommentModal
          open={commentsOpen}
          onClose={() => setCommentsOpen(false)}
          post={post}
        />
      </div>
    </div>
  );
}