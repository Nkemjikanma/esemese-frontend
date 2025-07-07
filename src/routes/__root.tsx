import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  createRootRoute,
  createRootRouteWithContext,
  Link,
  Outlet,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Navbar } from "@/components/Navbar";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  component: Component,
});

function Component() {
  return (
    <>
      {/* <div className="p-2 flex gap-2 text-lg border">

        <Link
          to="/"
          activeProps={{
            className: "font-bold",
          }}
          activeOptions={{ exact: true }}
        >
          Home
        </Link>{" "}
        <Link
          to="/gallery"
          activeProps={{
            className: "font-bold",
          }}
        >
          Gallery
        </Link>
        <Link
          to="/about"
          activeProps={{
            className: "font-bold",
          }}
        >
          About
        </Link>
      </div> */}
      <div className="h-1/12 w-full flex flex-col items-center">
        <Navbar />
      </div>
      <Outlet />
      <ReactQueryDevtools buttonPosition="top-right" />
      <TanStackRouterDevtools position="bottom-right" />
    </>
  );
}
