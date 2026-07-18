"use client";

import CommentItem from "./CommentItem";
import { dummyComments } from "./DummyComments";

export default function CommentList() {
  return (
    <div className="flex-1 overflow-y-auto">
      {dummyComments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
        />
      ))}
    </div>
  );
}