import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, generateAccessToken, generateRefreshToken } from "@/lib/auth";
import { loginSchema } from "@/lib/validations/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Username/email and password are required.",
          },
        },
        { status: 400 }
      );
    }

    const { identifier, password } = parsed.data;
    const ipAddress = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const userAgent = req.headers.get("user-agent") || "unknown";

    // Find user by email or username
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier.toLowerCase() },
          { username: identifier.toLowerCase() },
        ],
      },
    });

    if (!user) {
      // Record security event
      await prisma.securityEvent.create({
        data: {
          eventType: "FAILED_LOGIN_UNKNOWN_USER",
          severity: "INFO",
          ipAddress,
          detailsJson: JSON.stringify({ attemptedIdentifier: identifier }),
        },
      });

      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_CREDENTIALS",
            message: "Invalid username/email or password.",
          },
        },
        { status: 401 }
      );
    }

    // Check account status
    if (user.isBanned) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "ACCOUNT_BANNED",
            message: "This account has been permanently suspended for terms violation.",
          },
        },
        { status: 403 }
      );
    }

    if (user.isSuspended) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "ACCOUNT_SUSPENDED",
            message: "This account is temporarily suspended. Please contact support.",
          },
        },
        { status: 403 }
      );
    }

    // Verify password
    const isMatch = await verifyPassword(password, user.passwordHash);
    if (!isMatch) {
      // Record failed password event
      await prisma.securityEvent.create({
        data: {
          eventType: "FAILED_PASSWORD_ATTEMPT",
          severity: "MEDIUM",
          userId: user.id,
          ipAddress,
          detailsJson: JSON.stringify({ username: user.username }),
        },
      });

      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_CREDENTIALS",
            message: "Invalid username/email or password.",
          },
        },
        { status: 401 }
      );
    }

    // Update presence status to ONLINE
    await prisma.user.update({
      where: { id: user.id },
      data: { status: "ONLINE" },
    });

    // Generate tokens
    const accessToken = generateAccessToken({
      userId: user.id,
      username: user.username,
      role: user.role,
    });
    const refreshToken = generateRefreshToken();

    // Create session
    await prisma.session.create({
      data: {
        userId: user.id,
        refreshTokenHash: refreshToken.substring(0, 32),
        ipAddress,
        userAgent,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    const userPayload = {
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      email: user.email,
      role: user.role,
      status: "ONLINE",
      avatarUrl: user.avatarUrl,
      bannerUrl: user.bannerUrl,
      bio: user.bio,
      customStatus: user.customStatus,
      accentColor: user.accentColor,
      createdAt: user.createdAt,
    };

    const response = NextResponse.json({
      success: true,
      data: { user: userPayload },
      meta: { timestamp: new Date().toISOString() },
    });

    response.cookies.set("lumina_access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60,
      path: "/",
    });

    response.cookies.set("lumina_refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred during login.",
        },
      },
      { status: 500 }
    );
  }
}
