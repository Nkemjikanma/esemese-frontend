import { useSuspenseQuery } from "@tanstack/react-query";
import { Check } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { useGetPhotosByCategory } from "@/hooks/useGetPhotosByCategory";
import { ipfsURL } from "@/lib/utils";

// http://localhost:3000/files?categories=landscape,portrait
type Category =
  | "Black and White"
  | "Travel"
  | "Nature"
  | "Portrait"
  | "Landscape"
  | "Street"
  | "Urban"
  | "Urban Landscape"
  | "Grayscale"
  | "Heavy filters"
  | "AI Variant"
  | "wildlife"
  | "nature";

type PhotoType = {
  id: number;
  title: string;
  description: string;
  image: string;
  position: "center" | "top" | "bottom" | "left" | "right"; // assuming these are the possible positions
  category: Category[];
};

const categories = [
  "Black and White",
  "Travel",
  "Nature",
  "Portrait",
  "Landscape",
  "Street",
  "Urban",
  "Urban Landscape",
  "Grayscale",
  "Heavy filters",
  "AI Variant",
];

// const photos: PhotoType[] = [
//   {
//     id: 1,
//     title: "Urban Landscape",
//     description: "A stunning cityscape at twilight",
//     image: "/2.jpg",
//     position: "center",
//     category: ["Black and White", "Travel", "Nature"],
//   },
//   {
//     id: 2,
//     title: "Natural Wonder",
//     description: "Breathtaking view of a mountain range",
//     image: "/3.jpg",
//     position: "center",
//     category: ["Landscape", "Street", "Urban"],
//   },
//   {
//     id: 3,
//     title: "Abstract Reality",
//     description: "A mesmerizing play of light and shadow-sm",
//     image: "/4.jpg",
//     position: "center",
//     category: ["Urban Landscape", "Grayscale", "Heavy filters"],
//   },
//   {
//     id: 4,
//     title: "Serene Waters",
//     description: "Tranquil lake reflecting the sky",
//     image: "/5.jpg",
//     position: "center",
//     category: ["Heavy filters", "AI Variant"],
//   },
//   {
//     id: 5,
//     title: "Wildlife Moment",
//     description: "Rare capture of nature in action",
//     image: "/6.jpg",
//     position: "center",
//     category: ["wildlife", "nature"],
//   },
// ];

export const CategoriesDisplay = () => {
  const [selected, setSelected] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const initialCategoryQuery = useGetPhotosByCategory([]);
  const { data } = useSuspenseQuery(initialCategoryQuery);

  // Get all unique categories
  const categories = useMemo(() => {
    if (!data || data.images.length === 0) {
      return [];
    }

    const categorySet = new Set<string>();

    data.images.forEach((file) => {
      if (file.keyvalues?.category) {
        categorySet.add(file.keyvalues.category);
      } else {
        Object.entries(file.keyvalues || {}).forEach(([key, value]) => {
          if (
            key.toLowerCase().includes("category") ||
            key.toLowerCase().includes("tags")
          ) {
            if (typeof value === "string" && value.includes(",")) {
              value.split(",").forEach((v) => categorySet.add(v.trim()));
            } else {
              categorySet.add(String(value));
            }
          }
        });
      }
    });

    return Array.from(categorySet).sort();
  }, [data]);

  const categoryQuery = useGetPhotosByCategory(selected);
  const { data: filteredData } = useSuspenseQuery(
    selected.length > 0 ? categoryQuery : initialCategoryQuery,
  );

  const toggleCategory = (category: string) => {
    setSelected((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  };

  const displayImages = filteredData?.images || [];

  // Update currentImageIndex if it's out of bounds after filtering
  useEffect(() => {
    if (displayImages.length > 0 && currentImageIndex >= displayImages.length) {
      setCurrentImageIndex(0);
    }
  }, [displayImages, currentImageIndex]);

  return (
    <section className="relative flex py-6 w-full">
      <div className="mx-auto w-5/6">
        <h4 className="font-normal mb-4 uppercase">Find your categories</h4>

        <div className="relative grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
          <div className="relative w-full order-2 md:order-1 md:col-span-2 lg:col-span-1">
            <motion.div
              className="flex flex-wrap gap-3"
              layout
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 30,
                mass: 0.5,
              }}
            >
              {categories.length > 0 ? (
                categories.map((category) => {
                  const isSelected = selected.includes(category);
                  return (
                    <motion.button
                      key={category}
                      onClick={() => {
                        toggleCategory(category);
                      }}
                      layout
                      initial={false}
                      animate={{
                        backgroundColor: isSelected
                          ? "oklch(0.666 0.179 58.318)"
                          : "#f5f5f5",
                      }}
                      whileHover={{
                        backgroundColor: isSelected
                          ? "oklch(0.666 0.179 58.318)"
                          : "#f5f5f5",
                        scale: isSelected ? 1.2 : 0.9,
                        transition: { duration: 0.1 },
                      }}
                      whileTap={{
                        backgroundColor: isSelected
                          ? "oklch(0.666 0.179 58.318)"
                          : "#f5f5f5",
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                        mass: 0.5,
                        backgroundColor: { duration: 0.1 },
                      }}
                      className={`
                                            inline-flex items-center py-2 px-4 rounded-none text-base font-medium
                                            whitespace-nowrap overflow-hidden ring-1 ring-inset
                                            ${
                                              isSelected
                                                ? "text-black ring-[hsla(0,0%,100%,0.12)]"
                                                : "text-zinc-500 ring-[hsla(0,0%,100%,0.06)]"
                                            }
                                        `}
                    >
                      <motion.div
                        className="relative flex items-center"
                        animate={{
                          width: isSelected ? "auto" : "100%",
                          paddingRight: isSelected ? "1.5rem" : "0",
                        }}
                        transition={{
                          ease: [0.175, 0.885, 0.32, 1.275],
                          duration: 0.3,
                        }}
                      >
                        <h4>{category}</h4>
                        <AnimatePresence>
                          {isSelected && (
                            <motion.span
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0, opacity: 0 }}
                              transition={{
                                type: "spring",
                                stiffness: 500,
                                damping: 30,
                                mass: 0.5,
                              }}
                              className="absolute right-0"
                            >
                              <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center">
                                <Check
                                  className="w-3 h-3 text-[#2a1711]"
                                  strokeWidth={1.5}
                                />
                              </div>
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    </motion.button>
                  );
                })
              ) : (
                <p className="text-zinc-500">No categories found</p>
              )}
            </motion.div>
          </div>

          {/* Image Display Section */}
          {/* Image Display Section - Fixed to prevent overflow */}
          <div className="relative w-full order-1 md:order-2 md:col-span-2 lg:col-span-3 h-[500px] overflow-hidden">
            <AnimatePresence mode="wait">
              {displayImages.length > 0 ? (
                <motion.div
                  key={displayImages[currentImageIndex]?.id || "empty"}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="relative w-full h-full"
                >
                  <div className="absolute inset-0">
                    <img
                      src={ipfsURL(
                        displayImages[currentImageIndex].cid,
                        displayImages[currentImageIndex].name,
                      )}
                      alt={displayImages[currentImageIndex].name}
                      className="w-full h-full object-cover object-center"
                      onError={(e) => {
                        console.error(
                          `Failed to load image: ${displayImages[currentImageIndex].name}`,
                        );
                        e.currentTarget.src = "/placeholder.svg";
                      }}
                    />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent text-white rounded-b-lg z-10">
                    <h3 className="text-xl font-semibold">
                      {displayImages[currentImageIndex].name}
                    </h3>
                    {/* You can add more image details here if available */}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg"
                >
                  <p className="text-gray-500">No images found</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Optional: Add navigation controls for multiple images */}
        {/* {displayImages.length > 1 && (
          <div className="flex justify-center mt-4 gap-2">
            {displayImages.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  currentImageIndex === index
                    ? "bg-amber-600 dark:bg-amber-600 w-4"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`View image ${index + 1}`}
              />
            ))}
          </div>
        )} */}
      </div>
    </section>
  );
};
