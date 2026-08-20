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
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    /* =======================================================
       FIND CURRENT USER
       ======================================================= */

    const currentUser = await prisma.user.findUnique({
      where: {
        clerkId,
      },
      select: {
        id: true,
      },
    });

    if (!currentUser) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    const now = new Date();

    /* =======================================================
       GET STORIES OF A SPECIFIC USER
       
       Example:
       GET /api/stories?userId=abc123
       ======================================================= */

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

      return Response.json({
        user: stories[0]?.user ?? null,
        stories: stories.map((story) => ({
          id: story.id,
          mediaUrl: story.mediaUrl,
          caption: story.caption,
          createdAt: story.createdAt,
          expiresAt: story.expiresAt,

          /*
           * If you add resourceType to Prisma:
           */
          resourceType: story.resourceType,

          isOwnStory: story.userId === currentUser.id,
        })),
      });
    }

    /* =======================================================
       GET ALL ACTIVE STORIES
       ======================================================= */

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

      /*
       * Oldest → newest inside each user group.
       */
      orderBy: {
        createdAt: "asc",
      },
    });

    /* =======================================================
   GROUP STORIES BY USER
   ======================================================= */

    type StoryData = {
      id: string;
      mediaUrl: string;
      caption: string | null;
      createdAt: Date;
      expiresAt: Date;
      resourceType: string;
      isViewed: boolean;
    };

    type StoryGroup = {
      user: {
        id: string;
        username: string;
        imageUrl: string | null;
      };

      stories: StoryData[];
    };

    const groupedStories = new Map<string, StoryGroup>();

    for (const story of stories) {
      const existing = groupedStories.get(story.userId);

      const storyData: StoryData = {
        id: story.id,
        mediaUrl: story.mediaUrl,
        caption: story.caption,
        createdAt: story.createdAt,
        expiresAt: story.expiresAt,
        resourceType: story.resourceType,
        isViewed: story.views.length > 0,
      };

      if (!existing) {
        groupedStories.set(story.userId, {
          user: story.user,
          stories: [storyData],
        });
      } else {
        existing.stories.push(storyData);
      }
    }

    /* =======================================================
   ALWAYS ADD CURRENT USER
   ======================================================= */

    if (!groupedStories.has(currentUser.id)) {
      const currentUserData = await prisma.user.findUnique({
        where: {
          id: currentUser.id,
        },
        select: {
          id: true,
          username: true,
          imageUrl: true,
        },
      });

      if (currentUserData) {
        groupedStories.set(currentUser.id, {
          user: currentUserData,
          stories: [],
        });
      }
    }

    /* =======================================================
   CREATE FINAL RESPONSE
   ======================================================= */

    const result = Array.from(groupedStories.values()).map((group) => {
      const isOwnStory = group.user.id === currentUser.id;

      const isSeen = isOwnStory
        ? false
        : group.stories.length > 0 &&
          group.stories.every((story) => story.isViewed);

      return {
        user: group.user,

        stories: group.stories,

        isOwnStory,

        isSeen,
      };
    });

    /* =======================================================
   CURRENT USER ALWAYS FIRST
   ======================================================= */

    result.sort((a, b) => {
      if (a.isOwnStory) return -1;
      if (b.isOwnStory) return 1;

      return 0;
    });

    return Response.json({
      currentUserId: currentUser.id,
      stories: result,
    });
    /* =======================================================
       RESPONSE
       ======================================================= */

    return Response.json({
      currentUserId: currentUser.id,
      stories: result,
    });
  } catch (error) {
    console.error("GET /api/stories error:", error);

    return Response.json(
      {
        error: "Failed to fetch stories",
      },
      {
        status: 500,
      },
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
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    /* =======================================================
       FIND CURRENT USER
       ======================================================= */

    const currentUser = await prisma.user.findUnique({
      where: {
        clerkId,
      },
      select: {
        id: true,
      },
    });

    if (!currentUser) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    /* =======================================================
       READ REQUEST BODY
       ======================================================= */

    const body = await req.json();

    const { mediaUrl, caption, resourceType } = body;

    /* =======================================================
       VALIDATE MEDIA
       ======================================================= */

    if (!mediaUrl || typeof mediaUrl !== "string") {
      return Response.json(
        {
          error: "Story media is required",
        },
        {
          status: 400,
        },
      );
    }

    /* =======================================================
       VALIDATE RESOURCE TYPE
       ======================================================= */

    const validResourceType = resourceType === "video" ? "video" : "image";

    /* =======================================================
       STORY EXPIRATION
       ======================================================= */

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    /* =======================================================
       CREATE STORY
       ======================================================= */

    const story = await prisma.story.create({
      data: {
        mediaUrl,

        caption:
          typeof caption === "string" && caption.trim().length > 0
            ? caption.trim()
            : null,

        resourceType: validResourceType,

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

    /* =======================================================
       RESPONSE
       ======================================================= */

    return Response.json(
      {
        message: "Story created successfully",

        story: {
          id: story.id,
          mediaUrl: story.mediaUrl,
          caption: story.caption,
          resourceType: story.resourceType,
          createdAt: story.createdAt,
          expiresAt: story.expiresAt,

          user: story.user,

          isOwnStory: true,
        },
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error("POST /api/stories error:", error);

    return Response.json(
      {
        error: "Failed to create story",
      },
      {
        status: 500,
      },
    );
  }
}
