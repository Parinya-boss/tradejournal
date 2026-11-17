type LoginCredentials = {
  email: string;
  password: string;
};

export async function login(credentials: LoginCredentials): Promise<string> {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (response.status === 400 || response.status === 401) {
    throw new Error("ข้อมูลเข้าสู่ระบบไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง");
  }

  if (!response.ok) {
    throw new Error("ไม่สามารถเข้าสู่ระบบได้ในขณะนี้ กรุณาลองอีกครั้ง");
  }

  const data: unknown = await response.json();

  if (
    typeof data !== "object" ||
    data === null ||
    !("accessToken" in data) ||
    typeof data.accessToken !== "string" ||
    data.accessToken.length === 0
  ) {
    throw new Error("รูปแบบข้อมูลตอบกลับจากระบบไม่ถูกต้อง");
  }

  return data.accessToken;
}
