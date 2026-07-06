import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/src/lib/prisma";
import cloudinary from "@/src/lib/cloudinary";

export async function POST(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dbUser = await prisma.user.findUnique({
    where: {
      clerkId: userId,
    },
  });

  if (!dbUser) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }
  const formData = await req.formData();

  const caption = formData.get("caption") as string;

  const image = formData.get("image") as File;

  if (!image) {
    return Response.json({ error: "Image required" }, { status: 400 });
  }

  const bytes = await image.arrayBuffer();

  const buffer = Buffer.from(bytes);

  const uploadResult: any = await new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: "posts",
        },
        (error, result) => {
          if (error) reject(error);

          resolve(result);
        },
      )
      .end(buffer);
  });

  const post = await prisma.post.create({
    data: {
      caption,

      imageUrl: uploadResult.secure_url,

       userId: dbUser.id,
    },
  });

  return Response.json(post);
}
