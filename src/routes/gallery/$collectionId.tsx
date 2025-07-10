import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useLoaderData } from "@tanstack/react-router";
import { MoveLeft } from "lucide-react";
import { PhotoItem } from "@/components/CollectionItem";
import { CommandSearch } from "@/components/CommandSearch";
import { useGetCollectionThumbnail } from "@/hooks/useGetCollectionThumbnail";
import { getGroupImagesOptions } from "@/hooks/useGetGroupImages";

export const Route = createFileRoute("/gallery/$collectionId")({
  component: RouteComponent,
  loader: async ({ params, context: { queryClient } }) => {
    const collectionId = params.collectionId;

    const groupImagesQuery = getGroupImagesOptions({ groupId: collectionId });
    return await queryClient.ensureQueryData(groupImagesQuery);
  },
  pendingComponent: () => (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-xl font-bold mb-4">Error Loading Collection</h2>
      <p className="text-red-500">
        {error?.message || "An unknown error occurred"}
      </p>
      <Link to="/gallery" className="mt-4 text-amber-600 hover:underline">
        Return to Gallery
      </Link>
    </div>
  ),
});

function RouteComponent() {
  const data = useLoaderData({ from: "/gallery/$collectionId" });

  const photos = data?.images || [];

  // get collection name based on it
  const collectionsQuery = useGetCollectionThumbnail();
  const { data: collectionsData } = useSuspenseQuery(collectionsQuery);

  // Get the collection name from the route params
  const { collectionId } = Route.useParams();

  const currentCollectionName = collectionsData.collections.find(
    (collection) => collection.id === collectionId,
  );

  const collectionName = currentCollectionName?.name || collectionId;

  return (
    <div className="relative w-screen min-w-96 flex flex-col justify-center items-center gap-2 h-full mx-auto">
      <div className="grid grid-cols-2 grid-rows-2 py-4 w-10/12">
        <a
          href="/gallery"
          className="text-sm text-zinc-500 hover:text-zinc-800 flex items-center h-fit"
        >
          <MoveLeft className="h-4 w-4 mr-1" />
          BACK
        </a>
        <div className="col-span-1 place-items-end w-full h-fit">
          <CommandSearch />
        </div>

        {/* Collection header */}
        <div className="col-span-2 mb-8 justify-items-end w-full h-fit">
          <h1 className="text-3xl font-bold">{collectionName}</h1>
          <p className="text-zinc-500">{photos.length} photos</p>
        </div>
      </div>
      <div className="relative flex flex-col mt-10 mb-64 gap-64 w-10/12 snap-y snap-mandatory">
        {photos.map((photo, index) => (
          <PhotoItem key={photo.id} photo={photo} index={index} />
        ))}
      </div>
    </div>
  );
}
