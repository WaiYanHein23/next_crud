import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    // Replace with your actual authentication logic (e.g., database check)
    if (username !== "admin" || password !== "password") {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // On success, return user data (omit sensitive fields like passwords)
    return NextResponse.json({
      id: 1,
      username,
      email: "user@example.com",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
