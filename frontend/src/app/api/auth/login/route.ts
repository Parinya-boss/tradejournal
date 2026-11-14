import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const origin = request.headers.get("origin");

  if (origin && origin !== new URL(request.url).origin) {
    return NextResponse.json(
      { message: "ไม่อนุญาตคำขอจากเว็บไซต์นี้" },
      { status: 403 },
    );
  }

  const backendUrl = process.env.BACKEND_URL;

  if (!backendUrl) {
    return NextResponse.json(
      { message: "ยังไม่ได้ตั้งค่า BACKEND_URL" },
      { status: 500 },
    );
  }

  const body: unknown = await request.json().catch(() => null);

  if (
    !body ||
    typeof body !== "object" ||
    !("email" in body) ||
    typeof body.email !== "string" ||
    !("password" in body) ||
    typeof body.password !== "string"
  ) {
    return NextResponse.json(
      { message: "ข้อมูลที่ส่งมาไม่ถูกต้อง" },
      { status: 400 },
    );
  }

  let backendResponse: Response;

  try {
    backendResponse = await fetch(`${backendUrl}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: body.email,
        password: body.password,
      }),
      cache: "no-store",
    });
  } catch {
    return NextResponse.json(
      { message: "เชื่อมต่อ backend ไม่ได้" },
      { status: 503 },
    );
  }

  if (!backendResponse.ok) {
    if (backendResponse.status === 400 || backendResponse.status === 401) {
      return NextResponse.json(
        { message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" },
        { status: 401 },
      );
    }

    return NextResponse.json(
      { message: "Backend ไม่สามารถประมวลผลได้" },
      { status: 502 },
    );
  }

  const data: unknown = await backendResponse.json().catch(() => null);

  if (
    !data ||
    typeof data !== "object" ||
    !("accessToken" in data) ||
    typeof data.accessToken !== "string" ||
    !data.accessToken
  ) {
    return NextResponse.json(
      { message: "ข้อมูลที่ได้รับจาก backend ไม่ถูกต้อง" },
      { status: 502 },
    );
  }

  const response = NextResponse.json({
    message: "เข้าสู่ระบบสำเร็จ",
  });

  response.cookies.set("access_token", data.accessToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60,
  });

  return response;
}
