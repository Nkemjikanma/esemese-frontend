import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { DefaultLayout } from "@/components/DefaultLayout";
import Footer from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  component: Component,
});

function Component() {
  return (
    <>
      <div className="h-1/12 w-full flex flex-col items-center">
        <Navbar />
      </div>
      <DefaultLayout>
        <Outlet />
      </DefaultLayout>
      <footer className="h-1/12 w-full mt-4">
        <Footer />
      </footer>
      <ReactQueryDevtools buttonPosition="top-right" />
      <TanStackRouterDevtools position="bottom-right" />
    </>
  );
}
