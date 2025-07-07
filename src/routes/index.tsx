import { useSuspenseQueries, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { DefaultLayout } from "@/components/DefaultLayout";
import { CategoriesDisplay } from "../components/CategoriesDisplay";
import { CollectionsGrid } from "../components/CollectionsGrid";
import { LatestPhotoCarousel } from "../components/LatestPhotoCarousel";
import { RecentActivities } from "../components/RecentActivities";
import { useGetFavourites } from "../hooks/useGetFavourites";

export const Route = createFileRoute("/")({
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(useGetFavourites),
  component: HomeComponent,
  errorComponent: () => <>Error occured...</>,
  pendingComponent: () => <>Pending...</>,
});

function HomeComponent() {
  // const favorites = Route.useLoaderData();
  const { data: favorites } = useSuspenseQuery(useGetFavourites);
  return (
    <DefaultLayout>
      <div className="relative flex flex-col justify-center items-center gap-2 h-5/6 w-screen mx-auto min-w-96">
        <LatestPhotoCarousel favourites={favorites} />
        <RecentActivities />
        <CollectionsGrid />
        <CategoriesDisplay />
      </div>
    </DefaultLayout>
  );
}
