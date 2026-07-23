import { currentUser } from "@clerk/nextjs/server";

export async function requireAdmin() {
  const user = await currentUser();
  if (!user) {
    throw new Error("Unauthorized: Please sign in to access the admin panel.");
  }
  return user;
}

