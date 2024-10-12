import type { Metadata } from "next";
import localFont from "next/font/local";
import "../globals.css";
import { ClerkProvider } from "@clerk/nextjs";

// -----------< Components >-----------
import TopBar from "@/components/shared/TopBar";
import LeftSideBar from "@/components/shared/LeftSideBar";
import RightSideBar from "@/components/shared/RightSideBar";
import BottomBar from "@/components/shared/BottomBar";

export const metadata: Metadata = {
  title: "Threads",
  description: "A Next.js 14 Meta Threads Application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <TopBar />

          <main className="flex flex-row">
            <LeftSideBar></LeftSideBar>

            <section className="main-container">
              <div className="w-full max-w-4xl">
                {children}
              </div>
            </section>

            <RightSideBar></RightSideBar>
          </main>

          <BottomBar />
        </body>
      </html>
    </ClerkProvider>
  );
}
