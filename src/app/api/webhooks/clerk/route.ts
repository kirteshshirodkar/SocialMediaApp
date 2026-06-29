import { headers } from "next/headers";
import { Webhook } from "svix";
import { prisma } from "@/src/lib/prisma";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error("Please add CLERK_WEBHOOK_SECRET");
  }

  const headerPayload = await headers();

  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response("Missing Svix Headers", { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: any;

  try {
    evt = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    });
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return new Response("Invalid webhook", { status: 400 });
  }

  const { type, data } = evt;

  try {
    switch (type) {
      // =========================
      // USER CREATED / UPDATED
      // =========================
      case "user.created":
      case "user.updated": {
        await prisma.user.upsert({
          where: {
            clerkId: data.id,
          },
          update: {
            username: data.username,
            firstName: data.first_name,
            lastName: data.last_name,
            imageUrl: data.image_url,
            email: data.email_addresses?.[0]?.email_address,
          },
          create: {
            clerkId: data.id,
            username: data.username,
            firstName: data.first_name,
            lastName: data.last_name,
            imageUrl: data.image_url,
            email: data.email_addresses?.[0]?.email_address,
          },
        });

        console.log(`${type}: ${data.username}`);
        break;
      }

      // =========================
      // USER DELETED
      // =========================
      case "user.deleted": {
        if (!data.id) break;

        await prisma.user.delete({
          where: {
            clerkId: data.id,
          },
        });

        console.log(`Deleted user: ${data.id}`);
        break;
      }

      default:
        console.log(`Unhandled event: ${type}`);
    }
  } catch (error) {
    console.error("Database Error:", error);
    return new Response("Database Error", { status: 500 });
  }

  return new Response("Webhook received", { status: 200 });
}