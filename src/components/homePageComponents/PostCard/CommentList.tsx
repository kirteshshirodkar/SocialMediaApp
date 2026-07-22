"use client";

import CommentItem from "./CommentItem";
import { CommentType } from "./types";

type Props = {
  comments: CommentType[];
};

export default function CommentList({
  comments,
}: Props) {
  return (
    <div className="flex-1 overflow-y-auto">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
        />
      ))}
    </div>
  );
}