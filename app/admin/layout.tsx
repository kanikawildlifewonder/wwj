import React from "react";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import AdminLayoutClient from "./AdminLayoutClient";

export const metadata = {
  title: "Admin Dashboard | WWJ",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  // Route protection - ensure user is signed in to access admin
  if (!user) {
    redirect("/login");
  }

  return (
    <AdminLayoutClient
      userFirstName={user.firstName || "Admin"}
      userFullName={`${user.firstName || "Admin"} ${user.lastName || ""}`}
    >
      {children}
    </AdminLayoutClient>
  );
}
