import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import type z from "zod";
import type {
  FileType,
  photoMetadataSchema,
} from "@/routes/(account)/$walletId/-form";

interface PhotoMetadata {
  title: string;
  description: string;
  category: string;
  camera: string;
  lens: string;
  iso: string;
  aperture: string;
  shutterSpeed: string;
}

interface PhotoWithMetadata {
  id: string;
  file: File;
  metadata: PhotoMetadata;
  previewUrl: string;
}

interface UploadRequest {
  files: FileType[];
  createNewGroup: boolean;
  groupId: string;
  groupName: string;
  photos: z.infer<typeof photoMetadataSchema>[];
}

export const useUploadPhotos = () => {
  const [progress, setProgress] = useState<number>(0);
  const queryClient = useQueryClient();

  const photosWithMetadata: PhotoWithMetadata[] = [];

  const uploadFiles = async (data: UploadRequest) => {
    const formData = new FormData();

    console.log("Files to upload:", data.files.length);
    console.log("Photos metadata:", data.photos.length);

    // add group information
    formData.append("createNewGroup", data.createNewGroup.toString());

    if (data.createNewGroup && data.groupName) {
      formData.append("groupName", data.groupName);
    } else if (!data.createNewGroup && data.groupId) {
      formData.append("groupId", data.groupId);
    }

    if (data.files.length === data.photos.length) {
      // generate ids for a ll files
      const fileIds = data.files.map(
        (_, index) => `file_${Date.now()}_${index}`,
      );

      data.photos.forEach((photo, index) => {
        const uniqueId = fileIds[index];

        console.log("File type:", data.files[index].file.constructor.name);

        formData.append(uniqueId, data.files[index].file);

        formData.append(
          `metadata_${uniqueId}`,
          JSON.stringify({
            ...photo,
            originalFilename: data.files[index].file.name,
          }),
        );
      });
    }

    try {
      const response = await fetch("http://localhost:3000/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  };

  const uploadMutation = useMutation({
    mutationFn: uploadFiles,
    onSuccess: () => {
      // invalidate requests to refresh data
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      queryClient.invalidateQueries({ queryKey: ["photos"] });

      setProgress(0);
    },
    onError: (error) => {
      console.error("Upload failed:", error);
      setProgress(0);
    },
  });

  return {
    upload: uploadMutation.mutateAsync,
    progress,
    isUploading: uploadMutation.isPending,
    error: uploadMutation.error,
  };
};
