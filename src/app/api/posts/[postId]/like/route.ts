import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/src/lib/prisma";
import { NextResponse } from "next/server";

type Params = {
  params: Promise<{
    postId: string;
  }>;
};

// GET - Check whether the current user liked the post
export async function GET(
  _req: Request,
  { params }: Params
) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json(
        { liked: false },
        { status: 401 }
      );
    }

    const { postId } = await params;

    const user = await prisma.user.findUnique({
      where: {
        clerkId,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const like = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId: user.id,
          postId,
        },
      },
    });

    return NextResponse.json({
      liked: !!like,
    });
  } catch (error) {
    console.error("GET LIKE ERROR:", error);

    return NextResponse.json(
      { error: "Failed to check like" },
      { status: 500 }
    );
  }
}

// POST - Like the post
export async function POST(
  _req: Request,
  { params }: Params
) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { postId } = await params;

    const user = await prisma.user.findUnique({
      where: {
        clerkId,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    // Check if already liked
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId: user.id,
          postId,
        },
      },
    });

    // Don't create duplicate likes
    if (!existingLike) {
      await prisma.like.create({
        data: {
          userId: user.id,
          postId,
        },
      });
    }

    const likeCount = await prisma.like.count({
      where: {
        postId,
      },
    });

    return NextResponse.json({
      liked: true,
      likeCount,
    });
  } catch (error) {
    console.error("LIKE ERROR:", error);

    return NextResponse.json(
      { error: "Failed to like post" },
      { status: 500 }
    );
  }
}

// DELETE - Unlike the post
export async function DELETE(
  _req: Request,
  { params }: Params 
) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { postId } = await params;

    const user = await prisma.user.findUnique({
      where: {
        clerkId,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    await prisma.like.deleteMany({
      where: {
        userId: user.id,
        postId,
      },
    });

    const likeCount = await prisma.like.count({
      where: {
        postId,
      },
    });

    return NextResponse.json({
      liked: false,
      likeCount,
    });
  } catch (error) {
    console.error("UNLIKE ERROR:", error);

    return NextResponse.json(
      { error: "Failed to unlike post" },
      { status: 500 }
    );
  }
}