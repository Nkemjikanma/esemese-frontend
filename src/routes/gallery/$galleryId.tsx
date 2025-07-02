import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/gallery/$galleryId")({
  component: RouteComponent,
  loader: async ({ params }) => {
    // getch data here
    // return fetchPost(params.postId);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
      galleryId: params.galleryId,
    };
  },
  pendingComponent: () => <div>Loading...</div>,
  errorComponent: () => <div>Error happened...</div>,
});

function RouteComponent() {
  const { galleryId } = Route.useLoaderData();

  return <div>{galleryId}</div>;
}
