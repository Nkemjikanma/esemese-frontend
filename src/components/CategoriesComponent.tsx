import { Check } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { PinataFile } from "@/hooks/useGetFavourites";
import { ipfsURL } from "@/lib/utils";

interface CategoriesComponentProps {
  selected: string[];
  categories: string[];
  currentImageIndex: number;
  toggleCategory: (category: string) => void;
  displayImages: PinataFile[];
}
export const CategoriesComponnent = ({
  selected,
  categories,
  currentImageIndex,
  toggleCategory,
  displayImages,
}: CategoriesComponentProps) => {
  return (
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
              const isSelected = selected.includes(category.toLowerCase());
              return (
                <motion.button
                  key={category}
                  onClick={() => {
                    toggleCategory(category.toLowerCase());
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
  );
};
