import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get("pageNum")) || 0;
    const rowsPerPage = Number(searchParams.get("rowsPerPage")) || 6;

    const [users, totalUsers] = await Promise.all([
      prisma.user.findMany({
        skip: page * rowsPerPage,
        take: rowsPerPage,
        orderBy: {
          id: 'asc',
        },
      }),
      prisma.user.count(),
    ]);

    return NextResponse.json({
      users,
      totalUsers,
      totalPages: Math.ceil(totalUsers / rowsPerPage),
    });
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

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          error: "Email already exists",
          field: "email",
        },
        { status: 409 }
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
