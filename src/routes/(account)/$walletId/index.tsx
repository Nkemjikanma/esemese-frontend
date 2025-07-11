import { createFileRoute } from "@tanstack/react-router";
import { MoveLeft } from "lucide-react";
import { UploadForm } from "./-form";

export const Route = createFileRoute("/(account)/$walletId/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="relative w-screen min-w-96 flex flex-col justify-center items-center gap-2 h-full mx-auto">
      <div className="flex justify-between py-4 w-10/12">
        <a
          href="/"
          className="text-sm text-zinc-500 hover:text-zinc-800 flex items-center"
        >
          <MoveLeft className="h-4 w-4 mr-1" />
          BACK
        </a>
      </div>
      <h1 className="text-4xl md:text-5xl font-bold mb-4">Upload page</h1>

      <div className="flex relative w-10/12 items-center">
        <div className="w-full items-center ">
          <div className="">
            <UploadForm mode="single" />
          </div>
        </div>
      </div>
    </div>
  );
}
