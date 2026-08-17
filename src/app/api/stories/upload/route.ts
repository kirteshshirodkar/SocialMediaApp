import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/src/lib/prisma";
import cloudinary from "@/src/lib/cloudinary";

export async function POST(req: Request) {
  try {
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

    const formData = await req.formData();

    const file = formData.get("file");

    if (!(file instanceof File)) {
      return Response.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    /*
     * Convert File -> Buffer
     */

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    /*
     * Upload to Cloudinary
     */

    const result = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "social-media/stories",
          resource_type: "auto",
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      uploadStream.end(buffer);
    });

    return Response.json({
      message: "Story uploaded successfully",
      mediaUrl: result.secure_url,
    });
  } catch (error) {
    console.error("Story upload error:", error);

    return Response.json(
      { error: "Failed to upload story" },
      { status: 500 }
    );
  }
}