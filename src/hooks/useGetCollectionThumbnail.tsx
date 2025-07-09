import { queryOptions } from "@tanstack/react-query";
import { ipfsURL } from "@/lib/utils";

interface CollectionData {
  id: string;
  name: string;
  imageUrl: string;
  photoCount: number;
  isPublic?: boolean;
}

interface CollectionsResponse {
  success: boolean;
  collections: CollectionData[];
  message: string | null;
}

interface ApiCollectionData {
  id: string;
  name: string;
  is_public: boolean;
  created_at: string;
  thumbnail_image: {
    cid: string;
    name: string;
  } | null;
  photo_count: number;
}

interface ApiResponse {
  success: boolean;
  collections: ApiCollectionData[];
  message: string | null;
}

const getCollectionThumbnail = async (): Promise<CollectionsResponse> => {
  try {
    const response = await fetch(
      "http://localhost:3000/groups-with-thumbnails",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const data: ApiResponse = await response.json();

    const collections = data.collections.map((collection) => ({
      id: collection.id,
      name: collection.name,
      imageUrl: collection.thumbnail_image
        ? ipfsURL(
            collection.thumbnail_image.cid,
            collection.thumbnail_image.name,
          )
        : "/esemese_2.svg",
      photoCount: collection.photo_count,
      isPublic: collection.is_public,
    }));

    console.log(collections);

    return {
      success: true,
      collections,
      message: null,
    };
  } catch (error) {
    console.error("Failed to fetch collections:", error);
    throw error;
  }
};

export const useGetCollectionThumbnail = () =>
  queryOptions({
    queryKey: ["collections"],
    queryFn: () => getCollectionThumbnail(),
    staleTime: 600000,
  });
