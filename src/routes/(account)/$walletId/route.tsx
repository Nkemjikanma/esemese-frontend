import { createFileRoute } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UploadForm } from "./-form";

export const Route = createFileRoute("/(account)/$walletId")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="relative w-screen min-w-96 flex flex-col justify-center items-center gap-2 h-full mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upload">Upload Content</TabsTrigger>
          <TabsTrigger value="manage">Manage Photos</TabsTrigger>
          <TabsTrigger value="stats">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Upload Single Image</CardTitle>
                <CardDescription>
                  Upload a single image to an existing group or create a new
                  group
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UploadForm mode="single" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Batch Upload</CardTitle>
                <CardDescription>
                  Upload multiple images with shared metadata
                </CardDescription>
              </CardHeader>
              <CardContent>{/* <UploadForm mode="batch" /> */}</CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="manage" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Manage Photos</CardTitle>
              <CardDescription>
                View, edit, and manage your uploaded photos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Photo management will be implemented in a future update.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>
                View statistics about your photos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Analytics dashboard will be implemented in a future update.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// import { useForm } from "@tanstack/react-form";
// import { create } from "domain";
// import { Upload, UploadCloud, X } from "lucide-react";
// import { Component, useState } from "react";
// import { z } from "zod";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "./ui/select";
// import { Switch } from "./ui/switch";
// import { Textarea } from "./ui/textarea";

// // Define the form schema using Zod
// const photoMetadataSchema = z.object({
//   title: z.string().min(1, "Title is required"),
//   description: z.string().optional(),
//   category: z.string().min(1, "Category is required"),
//   camera: z.string().optional(),
//   lens: z.string().optional(),
//   iso: z.string().optional(),
//   aperture: z.string().optional(),
//   shutterSpeed: z.string().optional(),
//   location: z.string().optional(),
//   createNewGroup: z.boolean().default(false),
//   groupId: z.string().optional(),
//   groupName: z.string().optional(),
// });

// type PhotoMetadata = z.infer<typeof photoMetadataSchema>;

// // Sample categories (to be replaced with real data from API)
// const CATEGORIES = [
//   "Landscape",
//   "Portrait",
//   "Wildlife",
//   "Street",
//   "Architecture",
//   "Abstract",
//   "Macro",
//   "Night",
//   "Travel",
//   "Documentary",
// ];

// // Sample groups (to be replaced with real data from API)
// const GROUPS = [
//   { id: "group1", name: "Nature Collection" },
//   { id: "group2", name: "Urban Scenes" },
//   { id: "group3", name: "Black & White" },
// ];

// interface UploadFormProps {
//   mode: "single" | "batch";
// }

// export function UploadForm({ mode }: UploadFormProps) {
//   const [files, setFiles] = useState<File[]>([]);
//   const [previewUrls, setPreviewUrls] = useState<string[]>([]);

//   const form = useForm<PhotoMetadata>({
//     defaultValues: {
//       title: "",
//       description: "",
//       category: "",
//       camera: "",
//       lens: "",
//       iso: "",
//       aperture: "",
//       shutterSpeed: "",
//       location: "",
//       createNewGroup: false,
//       groupId: "",
//       groupName: "",
//     },
//     onSubmit: async ({ value }) => {
//       console.log("Form submitted:", value);
//       console.log("Files:", files);

//       // Here you would implement the actual API call to Pinata
//       // using the files and metadata

//       alert("Form submitted! Check console for details.");
//     },
//   });

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       const fileList = Array.from(e.target.files);
//       setFiles(fileList);

//       // Create preview URLs
//       const urls = fileList.map((file) => URL.createObjectURL(file));
//       setPreviewUrls(urls);

//       // If it's a single upload, use the file name as the title
//       if (mode === "single" && fileList.length === 1) {
//         const fileName = fileList[0].name.split(".")[0];
//         form.setFieldValue("title", fileName);
//       }
//     }
//   };

//   const removeFile = (index: number) => {
//     const newFiles = [...files];
//     newFiles.splice(index, 1);
//     setFiles(newFiles);

//     const newUrls = [...previewUrls];
//     URL.revokeObjectURL(newUrls[index]);
//     newUrls.splice(index, 1);
//     setPreviewUrls(newUrls);
//   };

//   return (
//     <form onSubmit={form.handleSubmit} className="space-y-6">
//       {/* File Upload Area */}
//       <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
//         <input
//           type="file"
//           id="file-upload"
//           className="hidden"
//           onChange={handleFileChange}
//           multiple={mode === "batch"}
//           accept="image/*"
//         />
//         <label
//           htmlFor="file-upload"
//           className="cursor-pointer flex flex-col items-center"
//         >
//           <UploadCloud className="h-12 w-12 text-gray-400 mb-2" />
//           <span className="text-sm font-medium text-gray-600">
//             {mode === "single" ? "Upload a photo" : "Upload multiple photos"}
//           </span>
//           <span className="text-xs text-gray-500 mt-1">
//             Click to browse or drag and drop
//           </span>
//         </label>
//       </div>

//       {/* Preview Area */}
//       {previewUrls.length > 0 && (
//         <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
//           {previewUrls.map((url, index) => (
//             <div key={index} className="relative group">
//               <img
//                 src={url}
//                 alt={`Preview ${index}`}
//                 className="h-24 w-full object-cover rounded-md"
//               />
//               <button
//                 type="button"
//                 onClick={() => removeFile(index)}
//                 className="absolute top-1 right-1 bg-black bg-opacity-50 rounded-full p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity"
//               >
//                 <X className="h-4 w-4" />
//               </button>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Group Selection / Creation */}
//       <div className="space-y-4">
//         <div className="flex items-center space-x-2">
//           <Switch
//             id="create-new-group"
//             onCheckedChange={(checked) =>
//               form.setFieldValue("createNewGroup", checked)
//             }
//           />
//           <Label htmlFor="create-new-group">Create new group</Label>
//         </div>

//         {form.getFieldValue("createNewGroup") ? (
//           <div>
//             <Label htmlFor="group-name">New Group Name</Label>
//             <Input
//               id="group-name"
//               {...form.getFieldProps("groupName")}
//               placeholder="Enter new group name"
//             />
//             {form.getFieldError("groupName") && (
//               <p className="text-sm text-red-500 mt-1">
//                 {form.getFieldError("groupName")}
//               </p>
//             )}
//           </div>
//         ) : (
//           <div>
//             <Label htmlFor="group-id">Select Group</Label>
//             <Select
//               value={form.getFieldValue("groupId")}
//               onValueChange={(value) => form.setFieldValue("groupId", value)}
//             >
//               <SelectTrigger id="group-id">
//                 <SelectValue placeholder="Select a group" />
//               </SelectTrigger>
//               <SelectContent>
//                 {GROUPS.map((group) => (
//                   <SelectItem key={group.id} value={group.id}>
//                     {group.name}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//             {form.getFieldError("groupId") && (
//               <p className="text-sm text-red-500 mt-1">
//                 {form.getFieldError("groupId")}
//               </p>
//             )}
//           </div>
//         )}
//       </div>

//       {/* Photo Metadata */}
//       <div className="space-y-4">
//         <div>
//           <Label htmlFor="title">Title</Label>
//           <Input
//             id="title"
//             {...form.getFieldProps("title")}
//             placeholder="Photo title"
//           />
//           {form.getFieldError("title") && (
//             <p className="text-sm text-red-500 mt-1">
//               {form.getFieldError("title")}
//             </p>
//           )}
//         </div>

//         <div>
//           <Label htmlFor="description">Description</Label>
//           <Textarea
//             id="description"
//             {...form.getFieldProps("description")}
//             placeholder="Describe your photo"
//           />
//         </div>

//         <div>
//           <Label htmlFor="category">Category</Label>
//           <Select
//             value={form.getFieldValue("category")}
//             onValueChange={(value) => form.setFieldValue("category", value)}
//           >
//             <SelectTrigger id="category">
//               <SelectValue placeholder="Select a category" />
//             </SelectTrigger>
//             <SelectContent>
//               {CATEGORIES.map((category) => (
//                 <SelectItem key={category} value={category.toLowerCase()}>
//                   {category}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//           {form.getFieldError("category") && (
//             <p className="text-sm text-red-500 mt-1">
//               {form.getFieldError("category")}
//             </p>
//           )}
//         </div>
//       </div>

//       {/* Technical Details - Camera Settings */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <div>
//           <Label htmlFor="camera">Camera Model</Label>
//           <Input
//             id="camera"
//             {...form.getFieldProps("camera")}
//             placeholder="e.g., Canon EOS R5"
//           />
//         </div>

//         <div>
//           <Label htmlFor="lens">Lens</Label>
//           <Input
//             id="lens"
//             {...form.getFieldProps("lens")}
//             placeholder="e.g., 24-70mm f/2.8"
//           />
//         </div>

//         <div>
//           <Label htmlFor="iso">ISO</Label>
//           <Input
//             id="iso"
//             {...form.getFieldProps("iso")}
//             placeholder="e.g., 100"
//           />
//         </div>

//         <div>
//           <Label htmlFor="aperture">Aperture</Label>
//           <Input
//             id="aperture"
//             {...form.getFieldProps("aperture")}
//             placeholder="e.g., f/2.8"
//           />
//         </div>

//         <div>
//           <Label htmlFor="shutterSpeed">Shutter Speed</Label>
//           <Input
//             id="shutterSpeed"
//             {...form.getFieldProps("shutterSpeed")}
//             placeholder="e.g., 1/125"
//           />
//         </div>

//         <div>
//           <Label htmlFor="location">Location</Label>
//           <Input
//             id="location"
//             {...form.getFieldProps("location")}
//             placeholder="e.g., Paris, France"
//           />
//         </div>
//       </div>

//       {/* Submit Button */}
//       <Button type="submit" className="w-full">
//         {mode === "single" ? "Upload Photo" : "Upload Photos"}
//       </Button>
//     </form>
//   );
// }
