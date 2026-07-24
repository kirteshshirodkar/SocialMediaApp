"use client";

import FeedPost from "./FeedPost";
import ProfilePostGrid from "./ProfilePostGrid";
import { PostType } from "./types";

export default function PostCard({
  posts,
  variant = "home",
  
}: {
  posts: PostType[];
  variant?: "home" | "profile";
  
}) {
  if (variant === "profile") {
    return <ProfilePostGrid posts={posts} />;
  }

  return (
    <div className="w-full max-w-xl mx-auto space-y-8">
      {posts.map((post) => (
        <FeedPost key={post.id} post={post}  />
      ))}
    </div>
  );
}
