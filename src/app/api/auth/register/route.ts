import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, generateAccessToken, generateRefreshToken } from "@/lib/auth";
import { registerSchema } from "@/lib/validations/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: parsed.error.issues[0]?.message || "Validation failed",
            details: parsed.error.issues,
          },
        },
        { status: 400 }
      );
    }

    const { username, displayName, email, password } = parsed.data;

    // Check existing username or email
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ username: username.toLowerCase() }, { email: email.toLowerCase() }],
      },
    });

    if (existingUser) {
      const field =
        existingUser.username.toLowerCase() === username.toLowerCase()
          ? "Username"
          : "Email";
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "CONFLICT",
            message: `${field} is already registered.`,
          },
        },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user strictly with role = 'USER'
    const newUser = await prisma.user.create({
      data: {
        username: username.toLowerCase(),
        displayName,
        email: email.toLowerCase(),
        passwordHash,
        role: "USER", // Absolute server-side enforcement
        status: "ONLINE",
      },
      select: {
        id: true,
        username: true,
        displayName: true,
        email: true,
        role: true,
        status: true,
        avatarUrl: true,
        bannerUrl: true,
        bio: true,
        customStatus: true,
        accentColor: true,
        createdAt: true,
      },
    });

    // Generate tokens
    const accessToken = generateAccessToken({
      userId: newUser.id,
      username: newUser.username,
      role: newUser.role,
    });
    const refreshToken = generateRefreshToken();

    // Store session in DB
    await prisma.session.create({
      data: {
        userId: newUser.id,
        refreshTokenHash: refreshToken.substring(0, 32),
        ipAddress: req.headers.get("x-forwarded-for") || "127.0.0.1",
        userAgent: req.headers.get("user-agent") || "unknown",
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    const response = NextResponse.json({
      success: true,
      data: { user: newUser },
      meta: { timestamp: new Date().toISOString() },
    });

    // Set secure HttpOnly cookies
    response.cookies.set("lumina_access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60, // 15 min
      path: "/",
    });

    response.cookies.set("lumina_refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred during registration.",
        },
      },
      { status: 500 }
    );
  }
}
