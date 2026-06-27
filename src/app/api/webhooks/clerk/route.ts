import { headers } from "next/headers";
import { Webhook } from "svix";
import { prisma } from "@/src/lib/prisma";

export async function POST(req: Request) {
  const WEBHOOK_SECRET =
    process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add CLERK_WEBHOOK_SECRET"
    );
  }

  // FIXED
  const headerPayload = await headers();

  const svix_id =
    headerPayload.get("svix-id");

  const svix_timestamp =
    headerPayload.get("svix-timestamp");

  const svix_signature =
    headerPayload.get("svix-signature");

  if (
    !svix_id ||
    !svix_timestamp ||
    !svix_signature
  ) {
    return new Response("Missing Headers", {
      status: 400,
    });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: any;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.error("Webhook Error:", err);

    return new Response("Error", {
      status: 400,
    });
  }

  const eventType = evt.type;

 if (eventType === "user.created") {
  const {
    id,
    email_addresses,
    image_url,
    username,
    first_name,
    last_name,
  } = evt.data;

  try {
    const user = await prisma.user.create({
      data: {
        clerkId: id,
        email: email_addresses[0].email_address,
        username,
        firstName: first_name,
        lastName: last_name,
        imageUrl: image_url,
      },
    });

    console.log("Created user:", user);
  } catch (error) {
    console.error("Prisma Error:", error);
  }
}

  return new Response("Webhook received", {
    status: 200,
  });
}