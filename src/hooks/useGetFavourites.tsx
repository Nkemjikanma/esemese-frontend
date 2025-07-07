import { queryOptions } from "@tanstack/react-query";

export interface PinataFile {
  id: string;
  name: string;
  cid: string;
  size: number;
  number_of_files: number;
  mime_type: string;
  group_id: string;
  keyvalues?: Record<string, string>; // Optional key-value pairs
  created_at: string;
}

export interface FavouritesResponse {
  success: boolean;
  group_id: string;
  images: PinataFile[];
  message: string | null;
}

const getFavourites = async (): Promise<FavouritesResponse> => {
  const favorites = await fetch("http://localhost:3000/favourites", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      // Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!favorites.ok) {
    throw new Error(`ERROR: ${favorites.status}`);
  }

  return await favorites.json();
};

export const useGetFavourites = queryOptions({
  queryKey: ["favourties"],
  queryFn: () => getFavourites(),
  staleTime: 600000,
});
