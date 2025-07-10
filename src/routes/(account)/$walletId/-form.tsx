import type { AnyFieldApi } from "@tanstack/react-form";
import {
  createFormHook,
  createFormHookContexts,
  useForm,
} from "@tanstack/react-form";
import { UploadCloud, X } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
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

interface UploadFormProps {
  mode: "single" | "group";
}

const photoMetadataSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  camera: z.string().optional(),
  lens: z.string().optional(),
  iso: z.string().optional(),
  aperture: z.string().optional(),
  shutterSpeed: z.string().optional(),
  createNewGroup: z.boolean().default(false),
  groupId: z.string().optional(),
  groupName: z.string().optional(),
});

const { fieldContext, formContext } = createFormHookContexts();
const { useAppForm } = createFormHook({
  fieldComponents: {
    Input,
    Switch,
    Select,
  },
  formComponents: {},
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

// TODO: Fetch groups
const GROUPS = [
  { id: "group1", name: "Nature Collection" },
  { id: "group2", name: "Urban Scenes" },
  { id: "group3", name: "Black & White" },
];

export function UploadForm({ mode }: UploadFormProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [previewURLs, setPreviewURLs] = useState<string[]>([]);
  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      category: "",
      camera: "",
      lens: "",
      iso: "",
      aperture: "",
      shutterSpeed: "",
      createNewGroup: false,
      groupId: "",
      groupName: "",
    },
    validators: {
      onChange: photoMetadataSchema,
    },
    onSubmit: ({ value }) => {
      console.log(JSON.stringify(value));
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileList = Array.from(e.target.files);
      setFiles(fileList);

      //create preview urls
      const urls = fileList.map((file: File) => URL.createObjectURL(file));
      setPreviewURLs(urls);

      // use file name as photo name in single mode
      if (mode === "single" && fileList.length === 1) {
        const fileName = fileList[0].name.split(".")[0];
        form.setFieldValue("title", fileName);
      }
    }
  };

  const removeFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);

    const newURLs = [...previewURLs];
    URL.revokeObjectURL(newURLs[index]);
    newURLs.splice(index, 1);
    setPreviewURLs(newURLs);
  };

  console.log("here", form.getFieldValue("createNewGroup"));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="space-y-6"
    >
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <input
          type="file"
          id="photo-upload"
          className="hidden"
          onChange={handleFileChange}
          multiple={mode === "group"}
          accept="image/*"
        />
        <label
          htmlFor="photo-upload"
          className="cursor-pointer flex flex-col items-center"
        >
          <UploadCloud className="h-12 w-12 text-gray-400 mb-2" />
          <span className="text-sm font-medium text-gray-600">
            {mode === "single" ? "Upload a photo" : "Upload multiple photos"}
          </span>
          <span className="text-xs text-gray-500 mt-1">
            Click to browse or drag and drop
          </span>
        </label>
      </div>

      {/* Preview area */}
      {previewURLs.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {previewURLs.map((url, index) => (
            <div key={index} className="relative group">
              <img
                src={url}
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

      {/* Group creation */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <form.Field
            name="createNewGroup"
            validators={{}}
            children={(field) => {
              return (
                <>
                  <Label htmlFor={field.name}>Create new group</Label>
                  <Switch
                    id={field.name}
                    checked={field.state.value}
                    onCheckedChange={(checked) => field.handleChange(checked)}
                  />
                  <FieldInfo field={field} />
                </>
              );
            }}
          />
        </div>

        <form.Subscribe
          selector={(state) => state.values.createNewGroup}
          children={(createNewGroup) => {
            if (createNewGroup) {
              return (
                <form.Field name="createNewGroup">
                  {(field) => (
                    <>
                      <Label htmlFor={field.name}>New Group Name here</Label>
                      <Input
                        id={field.name}
                        name={field.name}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="Enter collection name"
                      />
                      <FieldInfo field={field} />
                    </>
                  )}
                </form.Field>
              );
            } else {
              return (
                <form.Field name="groupId">
                  {(field) => (
                    <>
                      <Select
                        value={field.state.value}
                        onValueChange={(value) =>
                          form.setFieldValue("groupId", value)
                        }
                      >
                        <SelectTrigger id="group-id">
                          <SelectValue placeholder="Select a group" />
                        </SelectTrigger>
                        <SelectContent>
                          {GROUPS.map((group) => (
                            <SelectItem key={group.id} value={group.id}>
                              {group.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </>
                  )}
                </form.Field>
              );
            }
          }}
        />
      </div>
    </form>
  );
}
