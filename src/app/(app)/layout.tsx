import type React from "react";
import TopNav from "../../components/TopNav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#07070c] text-white">
      <TopNav />
      <main className="mx-auto w-full max-w-6xl px-6 pb-8 md:px-8 md:pb-10">
        {children}
      </main>
    </div>
  );
}