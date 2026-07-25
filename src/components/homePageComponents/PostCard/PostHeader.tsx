"use client";

import Image from "next/image";
import Link from "next/link";
import { FeedPostProps } from "./types";
import { useCurrentUser } from "@/src/context/CurrentUserContext";
import { useRouter, usePathname } from "next/navigation";
import PostMenu from "./PostMenu";
export default function PostHeader({ post }: FeedPostProps) {
  const { currentUserId } = useCurrentUser();
  const isOwner = currentUserId === post.user.id;
  const router = useRouter();
  const pathname = usePathname();
  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/posts/${post.id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      // If we're on the dedicated post page,
      // go back to the user's profile.
      if (pathname.includes("/posts/")) {
        router.push(`/profile/${post.user.username}`);
        return;
      }

      // Otherwise just refresh the feed.
      router.refresh();
    } catch (error) {
      console.error(error);
    }
  };
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
          <p className="font-semibold text-sm">{post.user.username}</p>

          <p className="text-xs text-gray-500">Suggested for you</p>
        </div>
      </Link>

      {isOwner && <PostMenu onDelete={handleDelete} />}
    </div>
  );
}
