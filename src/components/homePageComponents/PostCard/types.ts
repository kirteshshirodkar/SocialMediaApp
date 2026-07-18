export type PostType = {
  id: string;
  imageUrl: string | null;
  caption: string | null;
  createdAt: Date;

  user: {
    username: string;
    imageUrl: string | null;
  };
};