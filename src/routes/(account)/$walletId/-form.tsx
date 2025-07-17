import type { AnyFieldApi } from "@tanstack/react-form";
import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { UploadCloud, X } from "lucide-react";
import { useRef, useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { GroupsResponse } from "@/hooks/useGetGroup";
import { useUploadPhotos } from "@/hooks/useUploadPhoto";

interface UploadFormProps {
  groups: GroupsResponse;
}

const fileSchema = z.custom<File>((val) => val instanceof File, {
  message: "Please upload a valid image file",
});

const imageFileSchema = fileSchema.refine(
  (file) => ["image/png", "image/jpeg", "image/jpg"].includes(file.type),
  { message: "Invalid image file type" },
);

export const photoMetadataSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  camera: z.string().optional(),
  lens: z.string().optional(),
  iso: z.string().optional(),
  aperture: z.string().optional(),
  shutterSpeed: z.string().optional(),
});

const formSchema = z.object({
  createNewGroup: z.boolean().default(false),
  groupName: z.string().optional(),
  groupId: z.string().optional(),
  photos: z.array(photoMetadataSchema),
});

const { fieldContext, formContext } = createFormHookContexts();
const { useAppForm } = createFormHook({
  fieldComponents: {
    Input,
    Switch,
    Select,
    Textarea,
    Checkbox,
  },
  formComponents: { Button },
  fieldContext,
  formContext,
});

function FieldInfo({ field }: { field: AnyFieldApi }) {
  return (
    <>
      {field.state.meta.isTouched && !field.state.meta.isValid ? (
        <em>{field.state.meta.errors.join(",")}</em>
      ) : null}
      {field.state.meta.isValidating ? "Validating..." : null}
    </>
  );
}

const CATEGORIES = [
  "Landscape",
  "Portrait",
  "Wildlife",
  "Street",
  "Architecture",
  "Abstract",
  "Macro",
  "Night",
  "Travel",
  "Documentary",
];

const LENSES = ["50mm f/1.4", "35mm f/1.4"];

export interface FileType {
  id: string; // Unique ID for each photo
  previewURL: string;
  file: File;
}

export function UploadForm({ groups }: UploadFormProps) {
  const navigate = useNavigate();

  const [files, setFiles] = useState<FileType[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { upload, progress, isUploading, error } = useUploadPhotos();
  const form = useAppForm({
    defaultValues: {
      createNewGroup: false,
      groupId: "",
      groupName: "",
      photos: [] as z.infer<typeof photoMetadataSchema>[],
    },
    validators: {
      onChange: formSchema,
    },
    onSubmit: async ({ value }) => {
      console.log("Form submitted with values:", JSON.stringify(value));

      if (files.length === 0) {
        console.log("Please upload at least one image");
        return;
      }

      const submissionData = {
        ...value,
        files: files,
      };

      console.log(submissionData);

      const response = await upload(submissionData);

      console.log(response);

      let groupID: string;
      if (!value.createNewGroup) {
        groupID = submissionData.groupId;
        navigate({
          to: `/gallery/$collectionId`,
          params: { collectionId: groupID },
        });
      }

      // TODO:// Handle new group creation and redirect to newly created collecion
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const fileList = Array.from(e.target.files).map((file) => ({
        file: file,
        id: file.name,
        previewURL: URL.createObjectURL(file),
      }));
      setFiles([...files, ...fileList]);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // use file name as photo name in single mode
      fileList.forEach((file, index) => {
        form.pushFieldValue("photos", {
          title: file.file.name.split(".")[0], // Use filename as initial title
          description: "",
          category: "",
          camera: "",
          lens: "",
          iso: "",
          aperture: "",
          shutterSpeed: "",
        });
      });
    }
  };

  const removeFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  console.log(form.fieldInfo);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="space-y-6 w-full py-2"
    >
      {/* Group creation */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 w-1/2">
          <form.Field name="createNewGroup" validators={{}}>
            {(field) => {
              return (
                <div className="flex flex-row justify-between items-center gap-2">
                  <Label htmlFor={field.name}>Create new group</Label>
                  <Switch
                    id={field.name}
                    checked={field.state.value}
                    onCheckedChange={(checked) => field.handleChange(checked)}
                  />
                  <FieldInfo field={field} />
                </div>
              );
            }}
          </form.Field>
        </div>

        <form.Subscribe selector={(state) => state.values.createNewGroup}>
          {(createNewGroup) => {
            if (createNewGroup) {
              // form.setFieldValue("groupId", "");
              return (
                <form.Field name="groupName">
                  {(field) => (
                    <div className="flex flex-row w-3/5 justify-between items-center gap-2">
                      <Label className="w-2/5" htmlFor={field.name}>
                        New Group Name
                      </Label>
                      <Input
                        id={field.name}
                        name={field.name}
                        onBlur={field.handleBlur}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="Enter collection name"
                        className="w-full"
                      />
                      <FieldInfo field={field} />
                    </div>
                  )}
                </form.Field>
              );
            } else {
              // form.setFieldValue("groupName", "");
              return (
                <form.Field name="groupId">
                  {(field) => (
                    <div className="flex flex-row w-3/5 justify-between items-center gap-2">
                      <Label className="w-2/5" htmlFor="group-id">
                        Select Group
                      </Label>
                      <Select
                        value={field.state.value}
                        onValueChange={(value) => field.handleChange(value)}
                      >
                        <SelectTrigger id="group-id" className="w-full">
                          <SelectValue placeholder="Select a group" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          {groups.groups.map((group) => (
                            <SelectItem key={group.id} value={group.id}>
                              {group.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FieldInfo field={field} />
                    </div>
                  )}
                </form.Field>
              );
            }
          }}
        </form.Subscribe>
      </div>
      <div className="w-full border-2 border-dashed border-gray-300 rounded-none py-6 text-center">
        <input
          type="file"
          ref={fileInputRef}
          id="photo-upload"
          className="hidden"
          onChange={handleFileChange}
          multiple
          accept="image/*"
        />
        <label
          htmlFor="photo-upload"
          className="cursor-pointer flex flex-col items-center"
        >
          <UploadCloud className="h-12 w-12 text-gray-400 mb-2" />
          <span className="text-sm font-medium text-gray-600">
            Upload a photo
          </span>
          <span className="text-xs text-gray-500 mt-1">
            Click to browse or drag and drop
          </span>
        </label>
      </div>

      {/* Preview area */}
      {files.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {files.map((file, index) => (
            <div key={index} className="relative group">
              <img
                src={file.previewURL}
                alt={`Preview ${index}`}
                className="h-24 w-full object-cover rounded-none"
              />
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="absolute top-1 right-1 bg-black bg-opacity-50 rounded-full p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-4 h-fit">
        <form.Field name="photos" mode="array">
          {(field) => (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Photo details</h2>
                <Button
                  type="button"
                  onClick={() => {
                    field.pushValue({
                      title: "",
                      description: "",
                      category: "",
                      camera: "",
                      shutterSpeed: "",
                      lens: "",
                      aperture: "",
                      iso: "",
                    });
                  }}
                >
                  Add Photo
                </Button>
              </div>

              {field.state.value.map((photo, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center justify-between space-y-4 h-fit"
                >
                  <div className="text-lg border">
                    {photo.title && (
                      <>
                        {photo.title} {index + 1}
                      </>
                    )}
                  </div>

                  <div className="flex flex-col gap-4 w-full">
                    <form.Field name={`photos[${index}].title`}>
                      {(subField) => (
                        <div className="flex flex-row w-3/5 justify-between items-center gap-2">
                          <Label className="w-2/5" htmlFor={`title-${index}`}>
                            Title
                          </Label>
                          <Input
                            id={`title-${index}`}
                            value={subField.state.value}
                            onBlur={subField.handleBlur}
                            onChange={(e) =>
                              subField.handleChange(e.target.value)
                            }
                            placeholder="Photo title"
                            className="w-full"
                          />
                          <FieldInfo field={subField} />
                        </div>
                      )}
                    </form.Field>

                    <form.Field name={`photos[${index}].description`}>
                      {(subField) => {
                        return (
                          <div className="flex flex-row w-3/5 justify-between items-center gap-2">
                            <Label
                              className="w-2/5"
                              htmlFor={`description-${index}`}
                            >
                              Description
                            </Label>
                            <Textarea
                              id={`description-${index}`}
                              value={subField.state.value}
                              onBlur={subField.handleBlur}
                              onChange={(e) =>
                                subField.handleChange(e.target.value)
                              }
                              placeholder="Describe the photo"
                              className="w-full"
                            />
                            <FieldInfo field={subField} />
                          </div>
                        );
                      }}
                    </form.Field>

                    <form.Field name={`photos[${index}].category`}>
                      {(subField) => {
                        return (
                          <div className="flex flex-row w-3/5 justify-between items-center gap-2">
                            <Label
                              className="w-2/5"
                              htmlFor={`category-${index}`}
                            >
                              Category
                            </Label>
                            <Select
                              value={subField.state.value}
                              onValueChange={(value) =>
                                subField.handleChange(value)
                              }
                            >
                              <SelectTrigger
                                id={`category-${index}`}
                                className="w-full"
                              >
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                              <SelectContent className="bg-white">
                                {CATEGORIES.map((category) => (
                                  <SelectItem
                                    key={category}
                                    value={category.toLowerCase()}
                                  >
                                    {category}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        );
                      }}
                    </form.Field>
                  </div>

                  <div>
                    {field.state.value.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => field.removeValue(index)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>

                  {/* Camera details */}
                  <div className="w-full flex flex-col gap-2">
                    <div className="w-full flex flex-col gap-4">
                      <form.Field name={`photos[${index}].camera`}>
                        {(subField) => {
                          return (
                            <div className="flex flex-row w-3/5 justify-between items-center gap-2">
                              <Label
                                className="w-2/5"
                                htmlFor={`camera-${index}}`}
                              >
                                Camera Model
                              </Label>
                              <Input
                                id={`camera-${index}}`}
                                value={subField.state.value}
                                onChange={(e) =>
                                  subField.handleChange(e.target.value)
                                }
                                placeholder="e.g., Nikon D5500"
                                className="w-full"
                              />
                            </div>
                          );
                        }}
                      </form.Field>

                      <form.Field name={`photos[${index}].lens`}>
                        {(subField) => {
                          return (
                            <div className="flex flex-row w-3/5 justify-between items-center gap-2">
                              <Label
                                className="w-2/5"
                                htmlFor={`lens-${index}`}
                              >
                                Lens
                              </Label>
                              <Select
                                value={subField.state.value}
                                onValueChange={(value) =>
                                  subField.handleChange(value)
                                }
                              >
                                <SelectTrigger
                                  id={`lens-${index}`}
                                  className="w-full"
                                >
                                  <SelectValue placeholder="Select lens" />
                                  <SelectContent className="bg-white">
                                    {LENSES.map((lens) => (
                                      <SelectItem
                                        key={lens}
                                        value={lens.toLowerCase()}
                                      >
                                        {lens}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </SelectTrigger>
                              </Select>
                            </div>
                          );
                        }}
                      </form.Field>

                      <form.Field name={`photos[${index}].iso`}>
                        {(subField) => {
                          return (
                            <div className="flex flex-row w-3/5 justify-between items-center gap-2">
                              <Label className="w-2/5" htmlFor={`iso-${index}`}>
                                ISO
                              </Label>
                              <Input
                                id={`iso-${index}`}
                                value={subField.state.value}
                                onChange={(e) =>
                                  subField.handleChange(e.target.value)
                                }
                                placeholder="e.g., 100"
                                className="w-full"
                              />
                            </div>
                          );
                        }}
                      </form.Field>

                      <form.Field name={`photos[${index}].aperture`}>
                        {(subField) => {
                          return (
                            <div className="flex flex-row w-3/5 justify-between items-center gap-2">
                              <Label
                                className="w-2/5"
                                htmlFor={`aperture-${index}}`}
                              >
                                Aperture
                              </Label>
                              <Input
                                id={`aperture-${index}`}
                                value={subField.state.value}
                                onChange={(e) =>
                                  subField.handleChange(e.target.value)
                                }
                                placeholder="e.g., f/2.8"
                                className="w-full"
                              />
                            </div>
                          );
                        }}
                      </form.Field>

                      <form.Field name={`photos[${index}].shutterSpeed`}>
                        {(subField) => {
                          return (
                            <div className="flex flex-row w-3/5 justify-between items-center gap-2">
                              <Label
                                className="w-2/5"
                                htmlFor={`shutterSpeed-${index}`}
                              >
                                Shutter Speed
                              </Label>
                              <Input
                                id={`shutterSpeed-${index}`}
                                value={subField.state.value}
                                onChange={(e) =>
                                  subField.handleChange(e.target.value)
                                }
                                placeholder="e.g.,1/125"
                                className="w-full"
                              />
                            </div>
                          );
                        }}
                      </form.Field>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </form.Field>
      </div>

      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
      >
        {([canSubmit, isSubmitting]) => (
          <div className="flex flex-row items-center gap-2">
            <Button type="submit" disabled={!canSubmit}>
              {isSubmitting ? "..." : "Submit"}
            </Button>
            <Button
              // variant="destructive"
              type="reset"
              onClick={() => {
                form.reset();
                setFiles([]);
              }}
              className="bg-red-400"
            >
              Reset
            </Button>
          </div>
        )}
      </form.Subscribe>

      <form.Subscribe selector={(state) => state.values}>
        {(values) => (
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-2">Current Form Values:</h3>
            <pre className="text-sm text-gray-600">
              {JSON.stringify(values, null, 2)}
            </pre>
          </div>
        )}
      </form.Subscribe>
    </form>
  );
}
