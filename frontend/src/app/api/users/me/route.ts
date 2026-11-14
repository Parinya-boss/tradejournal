import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    return NextResponse.json({ message: "กรุณาเข้าสู่ระบบ" }, { status: 401 });
  }

  const backendUrl = process.env.BACKEND_URL;

  if (!backendUrl) {
    return NextResponse.json(
      { message: "ยังไม่ได้ตั้งค่า BACKEND_URL" },
      { status: 500 },
    );
  }

  let backendResponse: Response;

  try {
    backendResponse = await fetch(`${backendUrl}/api/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });
  } catch {
    return NextResponse.json(
      { message: "เชื่อมต่อ backend ไม่ได้" },
      { status: 503 },
    );
  }

  if (backendResponse.status === 401) {
    return NextResponse.json(
      { message: "การเข้าสู่ระบบหมดอายุ กรุณาเข้าสู่ระบบอีกครั้ง" },
      { status: 401 },
    );
  }

  if (!backendResponse.ok) {
    return NextResponse.json(
      { message: "ไม่สามารถขอข้อมูลผู้ใช้ได้" },
      { status: 502 },
    );
  }

  const user: unknown = await backendResponse.json().catch(() => null);

  if (
    !user ||
    typeof user !== "object" ||
    !("display_name" in user) ||
    typeof user.display_name !== "string" ||
    !("email" in user) ||
    typeof user.email !== "string"
  ) {
    return NextResponse.json(
      { message: "ข้อมูลผู้ใช้จาก backend ไม่ถูกต้อง" },
      { status: 502 },
    );
  }

  return NextResponse.json(
    {
      display_name: user.display_name,
      email: user.email,
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
