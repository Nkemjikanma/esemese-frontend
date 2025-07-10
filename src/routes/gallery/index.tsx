import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ImageIcon, MoveLeft } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { CommandSearch } from "@/components/CommandSearch";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useGetCollectionThumbnail } from "@/hooks/useGetCollectionThumbnail";

export const Route = createFileRoute("/gallery/")({
  component: RouteComponent,
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
      <a href="/" className="mt-4 text-amber-600 hover:underline">
        Return to wwww.esemese.xyz
      </a>
    </div>
  ),
});

function RouteComponent() {
  const collectionsQuery = useGetCollectionThumbnail();
  const { data, isLoading } = useSuspenseQuery(collectionsQuery);

  const collections = data?.collections || [];
  // const router = useRouter();

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
        <CommandSearch />
      </div>

      <div className="w-10/12 mb-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            ụlọ ngosi - gallery
          </h1>

          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            The things we've seen, the places we've been and all that is dear to
            our heart resides here.
          </p>
        </motion.div>
      </div>

      <div className="relative flex flex-col items-center w-10/12 min-h-[60vh] overflow-hidden mx-auto gap-6">
        {collections.length === 0 || isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center h-60 w-full text-center"
          >
            <img
              src="/empty-gallery.svg"
              alt="Empty Gallery"
              className="h-32 mb-6 opacity-80"
            />
            <h2 className="text-2xl font-semibold mb-2">No Collections Yet</h2>
            <p className="text-zinc-600 dark:text-zinc-400 mb-6 max-w-md">
              ...maybe they are still being fetched
            </p>
            {/* <Button className="bg-amber-600 hover:bg-amber-700 text-white">
              Create Collection
            </Button> */}
          </motion.div>
        ) : (
          <AnimatePresence>
            {/* Featured Collection */}
            {collections.length === 1 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full mb-4"
              >
                <div className="flex flex-col items-end mb-4 justify-end">
                  <h2 className="text-xl font-medium uppercase tracking-wider">
                    Featured Collection
                  </h2>
                  <div className="h-1 w-8 bg-amber-600"></div>
                </div>
              </motion.div>
            )}

            {collections.map((collection, index) => {
              return (
                <motion.div
                  key={collection.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative w-full"
                >
                  <Card className="relative rounded-none overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <CardContent className="p-0 h-full">
                      <div className="relative aspect-[16/9] w-full h-60 overflow-hidden">
                        {/* Image Section */}
                        <img
                          src={collection.imageUrl}
                          alt={collection.name}
                          className="absolute inset-0 w-full h-full object-cover"
                          sizes="(max-width: 1200px) 100vw"
                        />

                        {/* Description Overlay Section */}
                        <div
                          className={`absolute text-white top-0 h-full w-2/5 bg-gradient-to-r ${
                            index % 2 === 0
                              ? "from-transparent to-black/80 right-0"
                              : "from-black/80 to-transparent left-0"
                          } p-6 flex flex-col justify-center z-10`}
                        >
                          <div className="transform transition-transform duration-300 group-hover:translate-y-0 translate-y-2">
                            <h3 className="text-2xl font-bold mb-2 group-hover:text-amber-300 transition-colors">
                              {collection.name}
                            </h3>
                            <div className="flex items-center space-x-2 opacity-80 mb-2">
                              <ImageIcon size={16} />
                              <span className="text-sm">
                                {collection.photoCount} photos
                              </span>
                            </div>

                            <Link
                              className="flex items-center space-x-2 text-white hover:text-amber-600 transition-colors duration-300 w-fit"
                              to="/gallery/$collectionId"
                              from={Route.fullPath}
                              params={{ collectionId: collection.id }}
                            >
                              <span>View Collection</span>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M5 12h14M12 5l7 7-7 7" />
                              </svg>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>

      {/* Additional Content for Single Collection */}
      {collections.length === 1 && (
        <div className="w-10/12 mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-zinc-50 dark:bg-zinc-900 p-6 rounded-none border border-zinc-200 dark:border-zinc-800"
          >
            <h3 className="text-xl font-semibold mb-4">
              Collection Highlights
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400 mb-4">
              This collection showcases your best work and special moments
              captured through your lens.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center text-sm">
                <span className="w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
                Professional quality photographs
              </li>
              <li className="flex items-center text-sm">
                <span className="w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
                Carefully curated selection
              </li>
              <li className="flex items-center text-sm">
                <span className="w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
                High-resolution images
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-zinc-50 dark:bg-zinc-900 p-6 rounded-none border border-zinc-200 dark:border-zinc-800"
          >
            <h3 className="text-xl font-semibold mb-4">What's Next?</h3>
            <p className="text-zinc-600 dark:text-zinc-400 mb-4">
              Continue building your photography portfolio with these next
              steps:
            </p>
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start text-left"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
                Create Another Collection
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-left"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="18" height="18" x="3" y="3" rx="2" />
                  <circle cx="9" cy="9" r="2" />
                  <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                </svg>
                Add More Photos
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-left"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06z" />
                  <path d="M10 2c1 .5 2 2 2 5" />
                </svg>
                Share Your Collection
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
