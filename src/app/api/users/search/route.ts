import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;

    const query = searchParams.get("q");

    if (!query || query.trim().length < 1) {
      return NextResponse.json([]);
    }

    const users = await prisma.user.findMany({
      where: {
        OR: [
          {
            username: {
              contains: query,
              mode: "insensitive",
            },
          },

          {
            firstName: {
              contains: query,
              mode: "insensitive",
            },
          },

          {
            lastName: {
              contains: query,
              mode: "insensitive",
            },
          },
        ],
      },

      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        imageUrl: true,
        bio: true,
      },

      take: 10,
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("USER_SEARCH_ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to search users",
      },
      {
        status: 500,
      }
    );
  }
}