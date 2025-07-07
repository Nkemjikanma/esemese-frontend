import type { ReactNode } from "react";
import Footer from "./Footer";
import { Navbar } from "./Navbar";

export function DefaultLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen justify-center items-center min-w-96 mx-auto">
      <main className="layout w-full flex flex-grow flex-col justify-center">
        {children}
      </main>
      <footer className="h-1/12 w-full mt-4">
        <Footer />
      </footer>
    </div>
  );
}
