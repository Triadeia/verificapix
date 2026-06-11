"use server";

import { redirect } from "next/navigation";
import { createSession, findUser, verifyPassword } from "@/lib/auth";

export type LoginState = { error: string };

export async function loginAction(_: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  const user = findUser(email);
  if (!user || !verifyPassword(password)) {
    return { error: "E-mail ou senha inválidos." };
  }
  await createSession(user);
  redirect("/app/dashboard");
}
