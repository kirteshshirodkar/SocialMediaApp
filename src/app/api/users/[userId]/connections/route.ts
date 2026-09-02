import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/src/lib/prisma";

type RouteContext = {
  params: Promise<{
    userId: string;
  }>;
};

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { userId } = await context.params;

    const type = request.nextUrl.searchParams.get("type");

    if (type !== "followers" && type !== "following") {
      return NextResponse.json(
        { error: "Type must be followers or following" },
        { status: 400 }
      );
    }

    const userExists = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
      },
    });

    if (!userExists) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    if (type === "followers") {
      const relationships = await prisma.follow.findMany({
        where: {
          followingId: userId,
        },
        orderBy: {
          createdAt: "desc",
        },
        select: {
          follower: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
              imageUrl: true,
              bio: true,
            },
          },
        },
      });

      return NextResponse.json({
        users: relationships.map(
          (relationship) => relationship.follower
        ),
      });
    }

    const relationships = await prisma.follow.findMany({
      where: {
        followerId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        following: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            imageUrl: true,
            bio: true,
          },
        },
      },
    });

    return NextResponse.json({
      users: relationships.map(
        (relationship) => relationship.following
      ),
    });
  } catch (error) {
    console.error("Connections fetch error:", error);

    return NextResponse.json(
      { error: "Unable to fetch users" },
      { status: 500 }
    );
  }
}