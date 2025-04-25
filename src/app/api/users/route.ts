import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const result = await prisma.user.findMany();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { username, email } = await request.json();

    if (!username || !email) {
      return NextResponse.json(
        { error: "Username and email are required" },
        { status: 400 }
      );
    }

    const result = await prisma.user.create({
      data: {
        username,
        email,
      },
    });

    return NextResponse.json({ success: true, data: result }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
