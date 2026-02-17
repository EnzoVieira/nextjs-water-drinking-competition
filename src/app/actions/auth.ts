"use server";

import { redirect } from "next/navigation";
import { loginUser, logoutUser } from "@/lib/auth";

export async function loginAction(formData: FormData) {
  const name = formData.get("name") as string;
  if (!name?.trim()) return;
  await loginUser(name);
  redirect("/");
}

export async function logoutAction() {
  await logoutUser();
  redirect("/login");
}
