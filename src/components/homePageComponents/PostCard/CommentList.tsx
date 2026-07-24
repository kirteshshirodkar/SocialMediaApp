"use client";

import CommentItem from "./CommentItem";
import { CommentType } from "./types";

type Props = {
  comments: CommentType[];
  postOwnerId: string;
};

export default function CommentList({
  comments,
  postOwnerId,
}: Props) {
  return (
    <div className="flex-1 overflow-y-auto">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          postOwnerId={postOwnerId}
        />
      ))}
    </div>
  );
}
