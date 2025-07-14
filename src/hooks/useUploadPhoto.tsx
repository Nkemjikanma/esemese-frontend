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

    // add group information
    formData.append("createNewGroup", data.createNewGroup.toString());

    if (data.createNewGroup && data.groupName) {
      formData.append("groupName", data.groupName);
    } else if (!data.createNewGroup && data.groupId) {
      formData.append("groupId", data.groupId);
    }

    if (data.files.length === data.photos.length) {
      data.photos.forEach((photo, index) => {
        const uniqueId = `file_${Date.now()}_${index}`;
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

    // Use AbortController for timeout/cancellation
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 300000);

    // upload progress tracking
    try {
      const xhr = new XMLHttpRequest();

      const response = await new Promise<any>((resolve, reject) => {
        xhr.upload.addEventListener("progress", (event) => {
          if (event.lengthComputable) {
            const percentComplete = Math.round(
              (event.loaded / event.total) * 100,
            );
            setProgress(percentComplete);
          }
        });

        xhr.addEventListener("load", () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const response = JSON.parse(xhr.responseText);
              resolve(response);
            } catch (e) {
              reject(new Error("Invalid JSON response"));
            }
          } else {
            reject(new Error(`HTTP Error: ${xhr.status}`));
          }
        });

        xhr.addEventListener("error", () => reject(new Error("Network error")));
        xhr.addEventListener("abort", () =>
          reject(new Error("Upload aborted")),
        );

        xhr.open("POST", "/api/upload");
        xhr.send(formData);
      });

      return response;
    } finally {
      clearTimeout(timeoutId);
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
