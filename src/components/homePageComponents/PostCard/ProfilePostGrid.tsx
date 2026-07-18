"use client";

import Image from "next/image";
import Link from "next/link";
import { PostType } from "./types";

export default function ProfilePostGrid({
  posts,
}: {
  posts: PostType[];
}) {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 mt-6">
      <div className="grid grid-cols-3 gap-4">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/profile/${post.user.username}/posts/${post.id}`}
            className="relative aspect-square overflow-hidden rounded-xl group cursor-pointer"
          >
            {post.imageUrl && (
              <Image
                src={post.imageUrl}
                alt="post"
                fill
                sizes="(max-width:768px) 33vw,300px"
                className="object-cover group-hover:scale-105 transition"
              />
            )}

            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition" />
          </Link>
        ))}
      </div>
    </div>
  );
}