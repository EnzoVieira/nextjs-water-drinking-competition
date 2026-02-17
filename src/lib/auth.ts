import { cookies } from "next/headers";
import { prisma } from "./prisma";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;
  if (!userId) return null;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  return user;
}

export async function loginUser(name: string) {
  const trimmed = name.trim();
  if (!trimmed) throw new Error("Name is required");

  const user = await prisma.user.upsert({
    where: { name: trimmed },
    update: {},
    create: { name: trimmed },
  });

  const cookieStore = await cookies();
  cookieStore.set("userId", user.id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });

  return user;
}

export async function logoutUser() {
  const cookieStore = await cookies();
  cookieStore.delete("userId");
}
