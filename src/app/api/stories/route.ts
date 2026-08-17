import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/src/lib/prisma";

export const dynamic = "force-dynamic";

/* =========================================================
   GET /api/stories
   ========================================================= */

export async function GET(req: Request) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const currentUser = await prisma.user.findUnique({
      where: {
        clerkId,
      },
    });

    if (!currentUser) {
      return Response.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    const now = new Date();

    /*
     * If userId is provided:
     * Return all active stories belonging to that user.
     */
    if (userId) {
      const stories = await prisma.story.findMany({
        where: {
          userId,
          expiresAt: {
            gt: now,
          },
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
        orderBy: {
          createdAt: "asc",
        },
      });

      return Response.json(stories);
    }

    /*
     * Otherwise return the story bubbles.
     */

    const stories = await prisma.story.findMany({
      where: {
        expiresAt: {
          gt: now,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            imageUrl: true,
          },
        },
        views: {
          where: {
            userId: currentUser.id,
          },
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    /*
     * Group stories by user.
     */

    const groupedStories = new Map<string, any>();

    for (const story of stories) {
      const existing = groupedStories.get(story.userId);

      const storyData = {
        id: story.id,
        mediaUrl: story.mediaUrl,
        caption: story.caption,
        createdAt: story.createdAt,
        expiresAt: story.expiresAt,
      };

      if (!existing) {
        groupedStories.set(story.userId, {
          user: story.user,
          stories: [storyData],
          isSeen:
            story.userId === currentUser.id
              ? false
              : story.views.length > 0,
        });
      } else {
        existing.stories.push(storyData);
      }
    }

    const result = Array.from(groupedStories.values());

    /*
     * Current user's story should always be first.
     */

    result.sort((a, b) => {
      if (a.user.id === currentUser.id) return -1;
      if (b.user.id === currentUser.id) return 1;
      return 0;
    });

    return Response.json({
      currentUserId: currentUser.id,
      stories: result,
    });
  } catch (error) {
    console.error("GET /api/stories error:", error);

    return Response.json(
      { error: "Failed to fetch stories" },
      { status: 500 }
    );
  }
}

/* =========================================================
   POST /api/stories
   ========================================================= */

export async function POST(req: Request) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const currentUser = await prisma.user.findUnique({
      where: {
        clerkId,
      },
    });

    if (!currentUser) {
      return Response.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const body = await req.json();

    const { mediaUrl, caption } = body;

    if (!mediaUrl) {
      return Response.json(
        { error: "Story media is required" },
        { status: 400 }
      );
    }

    /*
     * Story expires 24 hours after creation.
     */

    const expiresAt = new Date(
      Date.now() + 24 * 60 * 60 * 1000
    );

    const story = await prisma.story.create({
      data: {
        mediaUrl,
        caption: caption || null,
        expiresAt,
        userId: currentUser.id,
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

    return Response.json(
      {
        message: "Story created successfully",
        story,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/stories error:", error);

    return Response.json(
      { error: "Failed to create story" },
      { status: 500 }
    );
  }
}