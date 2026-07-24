import PostCard from "@/src/components/homePageComponents/PostCard";
import { prisma } from "@/src/lib/prisma";
import { postInclude } from "@/src/lib/postInclude";
import { CurrentUserProvider } from "@/src/context/CurrentUserContext";
import { getCurrentUser } from "@/src/lib/getCurrentUser";
export default async function UserPostsPage({
  params,
}: {
  params: Promise<{
    username: string;
    postId: string;
  }>;
}) {
  const { username, postId } = await params;

  const currentUser = await getCurrentUser();

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
    include: {
      posts: {
        include: postInclude,
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
      <CurrentUserProvider
  currentUserId={currentUser?.id ?? ""}
>
  <PostCard
    posts={orderedPosts}
    variant="home"
  />
</CurrentUserProvider>
    </div>
  );
}
