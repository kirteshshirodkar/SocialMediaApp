import { prisma } from "@/src/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const users = await prisma.user.findMany();

    return NextResponse.json({
      success: true,
      users,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json({
      success: false,
      message: "Database connection failed",
    });
  }
}