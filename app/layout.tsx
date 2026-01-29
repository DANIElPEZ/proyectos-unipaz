import type { Metadata } from "next";
import "@/src/components/globals.css";
import { AuthProvider } from "@/src/lib/context/AuthContext";

export const metadata: Metadata = {
  title: "Proyectos Unipaz",
  authors: [
    { name: "Daniel Santiago Angel Gonzalez Ubaque" },
    { name: "Darwin Garcia Andrade" },
  ],
  icons: {
    icon: [{ url: "logo.svg" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
