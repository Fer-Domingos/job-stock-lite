import type { Metadata } from "next";
import "./styles.css";

export const metadata: Metadata = {
  title: "Job Stock Lite",
  description: "Simple inventory tracking"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
