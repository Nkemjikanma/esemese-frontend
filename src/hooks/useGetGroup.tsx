import { queryOptions } from "@tanstack/react-query";

export interface Group {
  id: string;
  name: string;
  is_public: boolean;
  created_at: string;
}

export interface GroupsResponse {
  success: boolean;
  groups: Group[];
  message?: string;
}

const getGroups = async () => {
  const groups = await fetch("http://localhost:3000/groups", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      // Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!groups.ok) {
    throw new Error(`ERROR: ${groups.status}`);
  }

  return await groups.json();
};

export const useGetGroups = queryOptions({
  queryKey: ["groups"],
  queryFn: () => getGroups(),
  staleTime: 600000,
});
