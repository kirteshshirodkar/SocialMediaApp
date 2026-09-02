import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { prisma } from "@/src/lib/prisma";

type RouteContext = {
  params: Promise<{
    userId: string;
  }>;
};

async function getAuthenticatedUser() {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    return null;
  }

  return prisma.user.findUnique({
    where: {
      clerkId,
    },
    select: {
      id: true,
    },
  });
}

/* =========================================================
   FOLLOW USER
   ========================================================= */

export async function POST(
  request: Request,
  context: RouteContext
) {
  try {
    const { userId: targetUserId } = await context.params;

    const currentUser = await getAuthenticatedUser();

    if (!currentUser) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (currentUser.id === targetUserId) {
      return NextResponse.json(
        { error: "You cannot follow yourself" },
        { status: 400 }
      );
    }

    const targetUser = await prisma.user.findUnique({
      where: {
        id: targetUserId,
      },
      select: {
        id: true,
      },
    });

    if (!targetUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    /*
     * upsert makes the operation safe.
     * Clicking Follow multiple times will not create duplicates.
     */
    await prisma.follow.upsert({
      where: {
        followerId_followingId: {
          followerId: currentUser.id,
          followingId: targetUserId,
        },
      },
      update: {},
      create: {
        followerId: currentUser.id,
        followingId: targetUserId,
      },
    });

    const followersCount = await prisma.follow.count({
      where: {
        followingId: targetUserId,
      },
    });

    return NextResponse.json({
      isFollowing: true,
      followersCount,
    });
  } catch (error) {
    console.error("Follow user error:", error);

    return NextResponse.json(
      { error: "Unable to follow user" },
      { status: 500 }
    );
  }
}

/* =========================================================
   UNFOLLOW USER
   ========================================================= */

export async function DELETE(
  request: Request,
  context: RouteContext
) {
  try {
    const { userId: targetUserId } = await context.params;

    const currentUser = await getAuthenticatedUser();

    if (!currentUser) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await prisma.follow.deleteMany({
      where: {
        followerId: currentUser.id,
        followingId: targetUserId,
      },
    });

    const followersCount = await prisma.follow.count({
      where: {
        followingId: targetUserId,
      },
    });

    return NextResponse.json({
      isFollowing: false,
      followersCount,
    });
  } catch (error) {
    console.error("Unfollow user error:", error);

    return NextResponse.json(
      { error: "Unable to unfollow user" },
      { status: 500 }
    );
  }
}