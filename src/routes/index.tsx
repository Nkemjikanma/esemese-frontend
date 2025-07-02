import { createFileRoute } from "@tanstack/react-router";
import App from "../App";
import { DefaultLayout } from "@/components/DefaultLayout";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  return (
    <DefaultLayout>
      <div className="relative flex flex-col justify-center items-center gap-2 h-5/6 w-screen mx-auto min-w-96">
        <App />
      </div>
    </DefaultLayout>
  );
}
