import { Link, Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Navbar } from "@/components/Navbar";

export const Route = createRootRoute({
  component: Component,
});

function Component() {
  return (
    <>
      {/* <div className="p-2 flex gap-2 text-lg border">
        <Navbar />
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
      <hr />
      <Outlet />
      <TanStackRouterDevtools position="bottom-right" />
    </>
  );
}
