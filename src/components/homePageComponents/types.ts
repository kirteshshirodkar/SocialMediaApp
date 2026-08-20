export type CommentType = {
  id: string;
  content: string;
  createdAt: Date;

  user: {
    id: string;
    username: string;
    imageUrl: string | null;
  };
};

export type PostType = {
  id: string;
  imageUrl: string | null;
  caption: string | null;
  createdAt: Date;

  user: {
    id: string;
    username: string;
    imageUrl: string | null;
  };

  comments: CommentType[];

  _count: {
    comments: number;
    likes: number;
  };
};

export type FeedPostProps = {
  post: PostType;
};

export type CommentInputProps = {
  postId: string;
};

/* =========================================================
   STORY TYPES
   ========================================================= */

export type StoryMedia = {
  id: string;
  mediaUrl: string;
  caption: string | null;

  createdAt: string;
  expiresAt: string;

  resourceType: "image" | "video";

  isViewed: boolean;
};

export type StoryUser = {
  id: string;
  username: string;
  imageUrl: string | null;
};

export type Story = {
  user: StoryUser;

  stories: StoryMedia[];

  isSeen: boolean;
  isOwnStory: boolean;
};