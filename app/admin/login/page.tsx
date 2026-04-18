import { Suspense } from "react";
import { AdminLoginClient } from "./login-client";

export const metadata = { title: "Admin Login" };

export default function AdminLoginPage() {
  return (
    <Suspense>
      <AdminLoginClient />
    </Suspense>
  );
}
