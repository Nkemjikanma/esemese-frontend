import { queryOptions } from "@tanstack/react-query";
import type { PinataFile } from "./useGetFavourites";

export interface GroupImagesResponse {
  success: boolean;
  group_id: string;
  images: PinataFile[];
  message: string | null;
}

interface UseGetGroupImagesOptions {
  groupId?: string;
  limit?: number;
}
const getGroupImages = async (
  options: UseGetGroupImagesOptions,
): Promise<GroupImagesResponse> => {
  const params = new URLSearchParams();

  if (options.groupId) {
    params.append("group_id", options.groupId);
  }

  if (options.limit !== undefined) {
    params.append("limit", options.limit.toString());
  }

  const queryString = params.toString() ? `?${params.toString()}` : "";

  const response = await fetch(
    `http://localhost:3000/group-images${queryString}`,
    {},
  );

  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }

  return await response.json();
};

export const getGroupImagesOptions = (options: UseGetGroupImagesOptions = {}) =>
  queryOptions({
    queryKey: ["queryImages", options.groupId, options.limit],
    queryFn: () => getGroupImages(options),
    staleTime: 600000,
  });

export const useGetGroupImages = (options: UseGetGroupImagesOptions = {}) =>
  getGroupImagesOptions(options);
