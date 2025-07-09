import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { AboutSection } from "@/components/AboutSection";
import { CategoriesDisplay } from "../components/CategoriesDisplay";
import { CollectionsGrid } from "../components/CollectionsGrid";
import { FavoritesCarousel } from "../components/FavoritesCarousel";
import { RecentActivities } from "../components/RecentActivities";
import { useGetFavourites } from "../hooks/useGetFavourites";

export const Route = createFileRoute("/")({
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(useGetFavourites),
  component: HomeComponent,
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
      <a href="/gallery" className="mt-4 text-amber-600 hover:underline">
        Return to Gallery
      </a>
    </div>
  ),
});

function HomeComponent() {
  // const favorites = Route.useLoaderData();
  const { data: favorites } = useSuspenseQuery(useGetFavourites);
  return (
    <div className="relative flex flex-col justify-center items-center gap-2 h-5/6 w-screen mx-auto min-w-96">
      <FavoritesCarousel favourites={favorites} />
      <AboutSection />

      <CategoriesDisplay />
      <CollectionsGrid />

      <RecentActivities />
    </div>
  );
}
