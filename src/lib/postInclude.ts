import { Prisma } from "@prisma/client";

export const postInclude = {
  user: true,

  comments: {
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  },

  _count: {
    select: {
      comments: true,
      likes: true,
    },
  },
} satisfies Prisma.PostInclude;