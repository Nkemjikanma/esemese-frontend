import { Link, useRouter } from "@tanstack/react-router";
import { Loader2, MoveRight } from "lucide-react";
// import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import type { FavouritesResponse } from "@/hooks/useGetFavourites";
import { ipfsURL } from "../lib/utils";
import { IPFSImage } from "./IPFSImages";

interface FavoritesCarouselProps {
  favourites?: FavouritesResponse;
  intervalTime?: number; // Time in milliseconds
  autoplayEnabled?: boolean;
}

// const featuredPhotos = [
//   {
//     id: 1,
//     title: "Urban Landscape",
//     description: "A stunning cityscape at twilight",
//     image: "/2.jpg",
//     position: "center",
//     collectionId: 1,
//   },
//   {
//     id: 2,
//     title: "Natural Wonder",
//     description: "Breathtaking view of a mountain range",
//     image: "/3.jpg",
//     position: "center",
//     collectionId: 2,
//   },
//   {
//     id: 3,
//     title: "Abstract Reality",
//     description: "A mesmerizing play of light and shadow-sm",
//     image: "/4.jpg",
//     position: "center",
//     collectionId: 3,
//   },
//   {
//     id: 4,
//     title: "Serene Waters",
//     description: "Tranquil lake reflecting the sky",
//     image: "/5.jpg",
//     position: "center",
//     collectionId: 4,
//   },
//   {
//     id: 5,
//     title: "Wildlife Moment",
//     description: "Rare capture of nature in action",
//     image: "/6.jpg",
//     position: "center",
//     collectionId: 5,
//   },
// ];

export const FavoritesCarousel = ({
  favourites,
  intervalTime = 5000, // 5 secs
  autoplayEnabled = true,
}: FavoritesCarouselProps) => {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!favourites) {
      setIsLoading(false);
    }
    setIsLoading(false);
  }, [favourites]);

  // Check if we have images to display
  const hasImages = favourites?.images && favourites.images.length > 0;

  const startAutoPlay = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);

    // Only start autoplay if we have images
    if (!hasImages) return;

    const newTimer = setInterval(() => {
      if (carouselApi?.canScrollNext()) {
        carouselApi.scrollNext();
      } else {
        carouselApi?.scrollTo(0);
      }
    }, intervalTime);
    timerRef.current = newTimer;
  }, [carouselApi, intervalTime, hasImages]);

  useEffect(() => {
    if (!carouselApi) return;

    const onSelect = () => {
      setCurrentIndex(carouselApi.selectedScrollSnap());
    };

    carouselApi.on("select", onSelect);
    return () => {
      carouselApi.off("select", onSelect);
    };
  }, [carouselApi]);

  useEffect(() => {
    if (!carouselApi || !autoplayEnabled || !hasImages) return;

    startAutoPlay();

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [carouselApi, startAutoPlay, autoplayEnabled, hasImages]);

  return (
    <div className="relative flex flex-col items-center dark:bg-black min-w-screen w-full">
      <div className="relative w-full flex flex-col justify-center items-center">
        <div className="flex justify-between py-4 w-10/12">
          <h4 className="font-normal">FEATURED PHOTOS</h4>
          <Link
            to="/gallery"
            className="text-sm text-zinc-500 hover:text-zinc-800 flex items-center"
          >
            VIEW ALL
            <MoveRight className="h-4 w-4 ml-1" />
          </Link>
        </div>

        <div className="relative flex flex-col items-center w-10/12 h-[62vh]">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <Carousel
              setApi={setCarouselApi}
              onMouseEnter={() => {
                if (timerRef.current) {
                  clearInterval(timerRef.current);
                }
              }}
              onMouseLeave={startAutoPlay}
              className="absolute flex flex-col w-full h-full"
              opts={{
                align: "start",
                // loop: true,
                slidesToScroll: 1,
              }}
            >
              <CarouselContent className="relative h-full w-full mx-auto">
                {favourites?.images.map((photo, index) => {
                  const imageURL = ipfsURL(photo.cid, photo.name);
                  return (
                    <CarouselItem
                      key={photo.id}
                      className="relative h-[60vh] px-1"
                    >
                      <div className="relative h-full w-full overflow-hidden group flex justify-center items-center">
                        <IPFSImage
                          src={imageURL}
                          cid={photo.cid}
                          alt={photo.name}
                          filename={photo.name}
                          className="object-cover w-full h-full scale-100 group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                          onError={(e) => {
                            console.error(
                              `Failed to load image: ${photo.name}`,
                            );
                            e.currentTarget.src = "/placeholder.svg";
                          }}
                          onLoad={() => {
                            console.log(
                              `Successfully loaded image: ${photo.name}`,
                            );
                          }}
                        />
                      </div>
                    </CarouselItem>
                  );
                })}
              </CarouselContent>
              <div className="absolute inset-0 bg-black opacity-50" />
              <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center p-4">
                <h1
                  className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-4 transition-all duration-500 `}
                >
                  Esemese
                </h1>

                <div
                  className={`flex flex-col sm:flex-row gap-4 transition-all duration-500 delay-200 `}
                >
                  <Link
                    className="rounded-none bg-black backdrop-blur-md isolation-auto border-gray-50 before:absolute before:w-full before:transition-all before:duration-700 hover:before:w-full before:-left-full hover:before:left-0 before:rounded-full before:bg-amber-600 hover:text-gray-50 dark:text-gray-50 before:-z-10 before:aspect-square hover:before:scale-150 hover:before:duration-700 relative z-10 px-4 py-2 overflow-hidden group"
                    to="/gallery"
                  >
                    Explore Collections
                  </Link>
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-amber-600 rounded-none text-black dark:text-white dark:hover:bg-zinc-900"
                  >
                    Learn More
                  </Button>
                </div>
              </div>
            </Carousel>
          )}
        </div>

        <div className="absolute bottom-12 left-0 right-0 flex justify-center gap-2 z-10">
          {favourites?.images.map((photo, index) => (
            <button
              key={photo.id}
              type="button"
              onClick={() => carouselApi?.scrollTo(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                currentIndex === index
                  ? "bg-amber-600 dark:bg-amber-600 w-4"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
