const uncertainResultMessage =
  "ไม่สามารถยืนยันผลการสร้างบัญชีได้ กรุณาตรวจสอบรายการก่อนลองอีกครั้ง";

export async function createTradingAccount(
  accessToken: string,
  name: string,
): Promise<void> {
  let response: Response;

  try {
    response = await fetch("/api/tradingaccounts/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ name }),
    });
  } catch {
    throw new Error(uncertainResultMessage);
  }

  if (response.status === 400) {
    throw new Error("ชื่อบัญชีไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง");
  }

  if (response.status === 401) {
    throw new Error("เซสชันหมดอายุ กรุณาออกจากระบบและเข้าสู่ระบบใหม่");
  }

  if (response.status === 403) {
    throw new Error("คุณไม่มีสิทธิ์สร้างบัญชีเทรด");
  }

  if (response.status === 409) {
    throw new Error("ไม่สามารถสร้างบัญชีเทรดได้ เนื่องจากข้อมูลขัดแย้ง");
  }

  if (!response.ok) {
    throw new Error(uncertainResultMessage);
  }
}
