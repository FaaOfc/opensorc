import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const { username, name, email, password } = await request.json();

    if (!username || !name || !email || !password) {
      return NextResponse.json(
        { error: "Semua field wajib diisi (username, name, email, password)." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password minimal 6 karakter." },
        { status: 400 }
      );
    }

    // Check existing
    const existingUser = await db.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });

    if (existingUser) {
      if (existingUser.username === username) {
        return NextResponse.json(
          { error: "Username sudah digunakan." },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: "Email sudah terdaftar." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await db.user.create({
      data: { username, name, email, password: hashedPassword },
    });

    return NextResponse.json({
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Gagal membuat akun." },
      { status: 500 }
    );
  }
}
