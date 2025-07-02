import type { ReactNode } from "react";
import { Navbar } from "./Navbar";
import Footer from "./Footer";

export function DefaultLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen justify-center items-center min-w-96 mx-auto">
      <div className="h-1/12 w-full flex flex-col items-center">
        <Navbar />
      </div>
      <main className="layout w-full flex flex-grow flex-col justify-center">
        {children}
      </main>
      <footer className="h-1/12 w-full mt-4">
        <Footer />
      </footer>
    </div>
  );
}
