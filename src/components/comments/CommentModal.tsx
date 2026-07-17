"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";

type CommentType = {
  id: string;
  content: string;
  createdAt: string;

  user: {
    username: string;
    imageUrl: string | null;
  };
};

interface CommentModalProps {
  open: boolean;
  postId: string;
  onClose: () => void;
}

export default function CommentModal({
  open,
  postId,
  onClose,
}: CommentModalProps) {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/posts/${postId}/comments`);

      if (!res.ok) return;

      const data = await res.json();

      setComments(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (open) {
      fetchComments();
    }
  }, [open, postId]);

  const submitComment = async () => {
    if (!content.trim()) return;

    try {
      setLoading(true);

      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
        }),
      });

      if (!res.ok) return;

      setContent("");

      fetchComments();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-end md:items-center">
      <div className="bg-white w-full md:w-[600px] h-[80vh] rounded-t-3xl md:rounded-3xl flex flex-col">

        {/* Header */}

        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-semibold text-lg">
            Comments
          </h2>

          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {/* Comments */}

        <div className="flex-1 overflow-y-auto p-4">

          {comments.length === 0 && (
            <p className="text-center text-gray-500 mt-10">
              No comments yet.
            </p>
          )}

          {comments.map((comment) => (
            <div
              key={comment.id}
              className="flex gap-3 py-3"
            >
              {comment.user.imageUrl ? (
                <Image
                  src={comment.user.imageUrl}
                  alt={comment.user.username}
                  width={36}
                  height={36}
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-gray-300" />
              )}

              <div>
                <p>
                  <span className="font-semibold mr-2">
                    {comment.user.username}
                  </span>

                  {comment.content}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}

        <div className="border-t p-4">
          <div className="flex gap-3">

            <input
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 rounded-full bg-gray-100 px-4 py-3 outline-none"
            />

            <button
              disabled={loading}
              onClick={submitComment}
              className="font-semibold text-blue-500 disabled:text-gray-400"
            >
              Post
            </button>

          </div>
        </div>

      </div>
    </div>
  );
}