import { headers } from "next/headers";
import { Dashboard } from "@/app/ui/dashboard";

export default async function Home() {
  const role = (await headers()).get("x-role") === "admin" ? "admin" : "viewer";
  return <Dashboard role={role} />;
}
