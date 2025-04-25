import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// GET single user by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(params.id) },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

// UPDATE user by ID
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { username, email } = body;

    // Validation
    if (!username || !email) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: Number(params.id) },
      data: { username, email },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    if (error.code === "P2025") {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Update failed" },
      { status: 500 }
    );
  }
}

// DELETE user by ID
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.user.delete({
      where: { id: Number(params.id) },
    });

    return NextResponse.json(
      { success: true, message: "User deleted" },
      { status: 200 }
    );
  } catch (error) {
    if (error.code === "P2025") {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Deletion failed" },
      { status: 500 }
    );
  }
}
