import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { postInclude } from "@/src/lib/postInclude";

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      include: postInclude,
      orderBy: {
        createdAt: "desc",
      },
      take: 50,
    });

    // Randomize the posts for Explore
    const randomPosts = [...posts].sort(
      () => Math.random() - 0.5
    );

    return NextResponse.json(randomPosts);
  } catch (error) {
    console.error("EXPLORE_GET_ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch explore posts",
      },
      {
        status: 500,
      }
    );
  }
}