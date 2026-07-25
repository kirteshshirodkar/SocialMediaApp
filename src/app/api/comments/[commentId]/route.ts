import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/src/lib/prisma";
import { NextResponse } from "next/server";
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ commentId: string }> },
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { commentId } = await params;

    const currentUser = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const comment = await prisma.comment.findUnique({
      where: {
        id: commentId,
      },
      include: {
        post: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }
    const canDelete =
      comment.userId === currentUser.id ||
      comment.post.userId === currentUser.id;
    if (!canDelete) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    await prisma.comment.delete({
      where: {
        id: comment.id,
      },
    });

   return NextResponse.json(
  {
    success: true,
    message: "Comment deleted successfully",
  },
  { status: 200 }
);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
