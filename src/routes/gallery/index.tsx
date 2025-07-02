import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/gallery/")({
  component: RouteComponent,
});

function RouteComponent() {
  const galleries = ["gallery1", "gallery2"];

  return (
    <div>
      {galleries.map((gallery) => (
        <div key={gallery}>
          <Link to="/gallery/$galleryId" params={{ galleryId: gallery }}>
            {gallery}
          </Link>
        </div>
      ))}
    </div>
  );
}
