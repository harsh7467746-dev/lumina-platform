import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    const user = await getCurrentUser();
    if (user) {
      await prisma.user.update({
        where: { id: user.id },
        data: { status: "OFFLINE" },
      });
    }

    const response = NextResponse.json({
      success: true,
      data: { message: "Successfully logged out." },
    });

    response.cookies.delete("lumina_access_token");
    response.cookies.delete("lumina_refresh_token");

    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { code: "ERROR", message: "Failed to logout" } },
      { status: 500 }
    );
  }
}
