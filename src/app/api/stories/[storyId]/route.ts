import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/src/lib/prisma";

type Props = {
  params: Promise<{
    storyId: string;
  }>;
};

/* =========================================================
   GET /api/stories/[storyId]
   ========================================================= */

export async function GET(
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

    const story = await prisma.story.findUnique({
      where: {
        id: storyId,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            imageUrl: true,
          },
        },
      },
    });

    if (!story) {
      return Response.json(
        { error: "Story not found" },
        { status: 404 }
      );
    }

    if (story.expiresAt <= new Date()) {
      return Response.json(
        { error: "Story has expired" },
        { status: 410 }
      );
    }

    return Response.json(story);
  } catch (error) {
    console.error("GET story error:", error);

    return Response.json(
      { error: "Failed to fetch story" },
      { status: 500 }
    );
  }
}

/* =========================================================
   DELETE /api/stories/[storyId]
   ========================================================= */

export async function DELETE(
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
     * Only owner can delete their story.
     */

    if (story.userId !== user.id) {
      return Response.json(
        { error: "You can only delete your own story" },
        { status: 403 }
      );
    }

    await prisma.story.delete({
      where: {
        id: storyId,
      },
    });

    return Response.json({
      message: "Story deleted successfully",
    });
  } catch (error) {
    console.error("DELETE story error:", error);

    return Response.json(
      { error: "Failed to delete story" },
      { status: 500 }
    );
  }
}