import PostCard from "@/src/components/homePageComponents/PostCard";
import { prisma } from "@/src/lib/prisma";

export default async function UserPostsPage({
  params,
}: {
  params: Promise<{
    username: string;
    postId: string;
  }>;
}) {
  const { username, postId } = await params;

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
    include: {
      posts: {
        include: {
          user: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!user) {
    return <div>User not found</div>;
  }

  const orderedPosts = [
    ...user.posts.filter((post) => post.id === postId),
    ...user.posts.filter((post) => post.id !== postId),
  ];

  return (
    <div className="py-8">
      <PostCard posts={orderedPosts} variant="home" />
    </div>
  );
}
