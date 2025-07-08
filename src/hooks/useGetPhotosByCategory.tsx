import { queryOptions } from "@tanstack/react-query";
import type { PinataFile } from "./useGetFavourites";

interface CategoryResponse {
  success: boolean;
  images: PinataFile[];
  message: string | null;
}
const getPhotoByCategory = async (
  categoryParams: string[],
): Promise<CategoryResponse> => {
  const response = await fetch(
    `http://localhost:3000/files-category?categories=${categoryParams.join(",")}`,
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

  return await response.json();
};

export const useGetPhotosByCategory = (categories: string[] = []) =>
  queryOptions({
    queryKey: ["categories", ...categories],
    queryFn: () => getPhotoByCategory(categories),
    staleTime: 600000,
  });
