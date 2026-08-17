import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/src/lib/prisma";

type Props = {
  params: Promise<{
    storyId: string;
  }>;
};

export async function POST(
  req: Request,
  { params }: Props
) {
  try {
    const { storyId } = await params;

    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        clerkId,
      },
    });

    if (!user) {
      return Response.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const story = await prisma.story.findUnique({
      where: {
        id: storyId,
      },
    });

    if (!story) {
      return Response.json(
        { error: "Story not found" },
        { status: 404 }
      );
    }

    /*
     * Don't create a view for your own story.
     */

    if (story.userId === user.id) {
      return Response.json({
        message: "Own story does not need a view",
      });
    }

    /*
     * upsert prevents duplicate views.
     */

    const view = await prisma.storyView.upsert({
      where: {
        storyId_userId: {
          storyId,
          userId: user.id,
        },
      },
      update: {
        viewedAt: new Date(),
      },
      create: {
        storyId,
        userId: user.id,
      },
    });

    return Response.json({
      message: "Story marked as seen",
      view,
    });
  } catch (error) {
    console.error("POST story view error:", error);

    return Response.json(
      { error: "Failed to mark story as seen" },
      { status: 500 }
    );
  }
}