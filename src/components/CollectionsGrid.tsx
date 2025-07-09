"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ExternalLink, Image as ImageIcon } from "lucide-react";
import { useGetCollectionThumbnail } from "@/hooks/useGetCollectionThumbnail";
import { AddButton } from "../assets/AddButton";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

export const CollectionsGrid = () => {
  const collectionsQuery = useGetCollectionThumbnail();
  const { data, isLoading, error } = useSuspenseQuery(collectionsQuery);

  const collections = data?.collections || [];

  if (isLoading) {
    return (
      <section className="relative w-full flex py-6">
        <div className="relative mx-auto w-5/6">
          <h4 className="font-normal">Collections</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-5">
            {Array.from({ length: 4 }).map((_, index) => (
              <Card key={index} className="overflow-hidden rounded-none">
                <CardContent className="p-0">
                  <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 animate-pulse" />
                  <div className="p-4">
                    <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 animate-pulse mb-2" />
                    <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 animate-pulse" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 px-4 md:px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-3xl font-bold mb-4">Error Loading Collections</h3>
          <p className="text-xl mb-8">
            {error.message || "An error occurred while loading collections"}
          </p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </section>
    );
  }

  if (collections.length === 0) {
    return (
      <section className="py-12 px-4 md:px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-3xl font-bold mb-4">No Collections Yet</h3>
          <p className="text-xl mb-8">
            No collections have been created just yet.
          </p>
          <Button
            title="Add New"
            className="group cursor-pointer outline-hidden hover:rotate-90 duration-300"
          >
            <AddButton />
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="relative flex py-12 w-full">
      <div className="mx-auto w-5/6">
        <h4 className="font-medium text-xl mb-8 uppercase tracking-wide">
          Collections
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-5">
          {collections.map((collection) => (
            <Link
              key={collection.id}
              to={`/gallery/${collection.id}`}
              className="aspect-[4/5] relative overflow-hidden rounded-none group cursor-pointer"
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <img
                  src={collection.imageUrl || "/placeholder.svg"}
                  alt={collection.name}
                  loading="lazy"
                  className="h-full w-full object-cover object-center transition-transform duration-700 ease-in-out group-hover:scale-110"
                />

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300"></div>
              </div>

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-6 text-white z-10">
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

                  <div className="flex items-center mt-3 opacity-0 transform -translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                    <span className="text-sm font-medium mr-1">
                      View Collection
                    </span>
                    <ExternalLink size={14} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
