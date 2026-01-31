import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import ClientLayout from "@/components/ClientLayout";

const mono = JetBrains_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "UTRA Terminal",
  description: "Robot telemetry and run tracking",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${mono.className} crt min-h-screen`}>
        <nav className="border-b border-[#00ff00]/30 px-4 py-2 flex gap-6 text-sm">
          <Link href="/" className="text-[#ffb000]">UTRA_TERMINAL</Link>
          <Link href="/" className="hover:text-[#00ff00]/80">[logs]</Link>
          <Link href="/runs" className="hover:text-[#00ff00]/80">[runs]</Link>
          <Link href="/achievements" className="hover:text-[#00ff00]/80">[achievements]</Link>
          <Link href="/mint" className="hover:text-[#00ff00]/80">[mint]</Link>
        </nav>
        <ClientLayout>
          <main className="p-4">{children}</main>
        </ClientLayout>
      </body>
    </html>
  );
}
