const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export interface RegisterResponse {
  username: string;
  email: string;
  password: string; // hashed password
  message: string;
}

export async function registerUser(
  username: string,
  email: string,
  password: string
): Promise<RegisterResponse> {
  const res = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      Username: username,
      Email: email,
      Password: password,
    }),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || "Registration failed.");
  }

  return await res.json();
}

export async function sendOtp(email: string): Promise<string> {
  const res = await fetch(`${BASE_URL}/sendotp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ Email: email }),
  });

  const contentType = res.headers.get("Content-Type");

  if (!res.ok) {
    if (contentType?.includes("application/json")) {
      const data = await res.json();
      throw new Error(data.message || "OTP sending failed.");
    } else {
      const text = await res.text();
      throw new Error(text || "Unexpected error occurred.");
    }
  }

  const data = await res.json();
  return data.OTP; // ใช้ได้ถ้าต้องเก็บ OTP ไปแสดง debug (เช่นใน dev)
}

export async function verifyOtp(
  username: string,
  email: string,
  hashedPassword: string,
  otp: string
): Promise<void> {
  const res = await fetch(`${BASE_URL}/verifyotp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username,
      Email: email,
      password: hashedPassword,
      otp,
    }),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || "OTP verification failed.");
  }

  return;
}
