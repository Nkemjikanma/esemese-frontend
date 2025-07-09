import { useSuspenseQuery } from "@tanstack/react-query";
import { Check } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import type { PinataFile } from "@/hooks/useGetFavourites";
import { useGetPhotosByCategory } from "@/hooks/useGetPhotosByCategory";
import { ipfsURL } from "@/lib/utils";
import { CategoriesComponnent } from "./CategoriesComponent";

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
  // const categories = useMemo(() => {
  //   if (!data || data.images.length === 0) {
  //     return [];
  //   }

  //   const categorySet = new Set<string>();

  //   data.images.forEach((file) => {
  //     if (file.keyvalues?.category) {
  //       categorySet.add(file.keyvalues.category);
  //     } else {
  //       Object.entries(file.keyvalues || {}).forEach(([key, value]) => {
  //         if (
  //           key.toLowerCase().includes("category") ||
  //           key.toLowerCase().includes("tags")
  //         ) {
  //           if (typeof value === "string" && value.includes(",")) {
  //             value.split(",").forEach((v) => categorySet.add(v.trim()));
  //           } else {
  //             categorySet.add(String(value));
  //           }
  //         }
  //       });
  //     }
  //   });

  //   return Array.from(categorySet).sort();
  // }, [data]);

  // const categoryQuery = useGetPhotosByCategory(selected);
  // const { data } = useSuspenseQuery(
  //   selected.length > 0 ? categoryQuery : initialCategoryQuery,
  // );

  const toggleCategory = (category: string) => {
    setSelected((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  };

  const displayImages = useMemo(() => {
    if (!data?.images || data.images.length === 0) {
      return [];
    }

    if (selected.length === 0) {
      return data.images;
    }

    return data.images.filter((image) => {
      if (!image.keyvalues) return false;

      for (const [key, value] of Object.entries(image.keyvalues)) {
        if (
          key.toLowerCase().includes("category") ||
          key.toLowerCase().includes("categories") ||
          key.toLowerCase().includes("tags")
        ) {
          if (typeof value === "string" && value.includes(",")) {
            const imageCategories = value.split(",").map((c) => c.trim());

            if (selected.some((cat) => imageCategories.includes(cat))) {
              return true;
            }
          } else if (selected.includes(String(value))) {
            return true;
          }
        }
      }
      return false;
    });
  }, [data, selected]);

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

        <CategoriesComponnent
          selected={selected}
          categories={categories}
          currentImageIndex={currentImageIndex}
          toggleCategory={toggleCategory}
          displayImages={displayImages}
        />

        {/* Optional: Add navigation controls for multiple images */}
        <div className="w-full relative flex justify-end items-end transition-transform ease-in-out duration-200">
          {displayImages.length > 1 && (
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
          )}
        </div>
      </div>
    </section>
  );
};
