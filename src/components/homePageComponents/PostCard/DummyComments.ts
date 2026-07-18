import { CommentType } from "./types";

export const dummyComments: CommentType[] = [
  {
    id: "1",
    content: "Amazing picture 🔥",
    createdAt: "2h",
    user: {
      username: "john_doe",
      imageUrl: "https://i.pravatar.cc/150?img=11",
    },
  },
  {
    id: "2",
    content: "Love this ❤️",
    createdAt: "1h",
    user: {
      username: "alex",
      imageUrl: "https://i.pravatar.cc/150?img=22",
    },
  },
  {
    id: "3",
    content: "Where is this place? 😍",
    createdAt: "45m",
    user: {
      username: "sophia",
      imageUrl: "https://i.pravatar.cc/150?img=33",
    },
  },
  {
    id: "4",
    content: "Beautiful shot!",
    createdAt: "20m",
    user: {
      username: "michael",
      imageUrl: "https://i.pravatar.cc/150?img=44",
    },
  },
  {
    id: "5",
    content: "Need more photos like this 👏",
    createdAt: "10m",
    user: {
      username: "emma",
      imageUrl: "https://i.pravatar.cc/150?img=55",
    },
  },
  {
    id: "6",
    content: "This deserves more likes 🙌",
    createdAt: "5m",
    user: {
      username: "david",
      imageUrl: "https://i.pravatar.cc/150?img=66",
    },
  },
];