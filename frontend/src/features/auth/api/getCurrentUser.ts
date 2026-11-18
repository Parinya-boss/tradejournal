export type CurrentUser = {
  email: string;
  display_name: string;
  role: "CUSTOMER" | "ADMIN";
};

export async function getCurrentUser(
  accessToken: string,
): Promise<CurrentUser> {
  const response = await fetch("/api/users/me", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (response.status === 401) {
    throw new Error("เซสชันไม่ถูกต้อง กรุณาลองเข้าระบบอีกครั้ง");
  }

  if (!response.ok) {
    throw new Error("ไม่สามารถโหลดข้อมูลผู้ใช้ได้ กรุณาลองอีกครั้ง");
  }

  const data: unknown = await response.json();

  if (
    typeof data !== "object" ||
    data === null ||
    !("email" in data) ||
    typeof data.email !== "string" ||
    !("display_name" in data) ||
    typeof data.display_name !== "string" ||
    !("role" in data) ||
    typeof data.role !== "string" ||
    (data.role !== "CUSTOMER" && data.role !== "ADMIN")
  ) {
    throw new Error("รูปแบบข้อมูลผู้ใช้ที่ตอบกลับ ไม่ถูกต้อง");
  }

  return {
    email: data.email,
    display_name: data.display_name,
    role: data.role,
  };
}
