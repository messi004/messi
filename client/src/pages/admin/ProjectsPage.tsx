import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useProjects, useDeleteProject, useCreateProject, useUpdateProject } from "@/hooks/use-projects";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Plus, Trash2, Pencil } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertProjectSchema, type InsertProject, type Project } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export default function ProjectsPage() {
  const { data: projects, isLoading } = useProjects();
  const deleteProject = useDeleteProject();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this project?")) {
      await deleteProject.mutateAsync(id);
      toast({ title: "Project deleted" });
    }
  };

  return (
    <AdminLayout title="Projects">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4 flex-wrap">
          <CardTitle>Manage Projects</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) setEditingProject(null); }}>
            <DialogTrigger asChild>
              <Button className="gap-2" data-testid="button-add-project"><Plus size={16} /> Add Project</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>{editingProject ? "Edit Project" : "Add New Project"}</DialogTitle>
              </DialogHeader>
              <ProjectForm project={editingProject} onSuccess={() => { setIsDialogOpen(false); setEditingProject(null); }} />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects?.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell>
                      <img src={project.image} alt={project.title} className="w-16 h-10 object-cover rounded" />
                    </TableCell>
                    <TableCell className="font-medium">{project.title}</TableCell>
                    <TableCell className="max-w-[300px] truncate">{project.description}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="icon" onClick={() => { setEditingProject(project); setIsDialogOpen(true); }}>
                        <Pencil size={16} />
                      </Button>
                      <Button variant="destructive" size="icon" onClick={() => handleDelete(project.id)}>
                        <Trash2 size={16} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
}

function ProjectForm({ project, onSuccess }: { project?: Project | null; onSuccess: () => void }) {
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);

  const form = useForm<InsertProject>({
    resolver: zodResolver(insertProjectSchema),
    defaultValues: {
      title: project?.title || "",
      description: project?.description || "",
      image: project?.image || "",
      link: project?.link || ""
    }
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    setUploading(true);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData, credentials: "include" });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      form.setValue("image", data.url);
      toast({ title: "Image uploaded to Supabase!" });
    } catch (error) {
      toast({ title: "Upload failed", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  async function onSubmit(data: InsertProject) {
    try {
      if (project) {
        await updateProject.mutateAsync({ id: project.id, data });
        toast({ title: "Project updated!" });
      } else {
        await createProject.mutateAsync(data);
        toast({ title: "Project created!" });
      }
      onSuccess();
    } catch (error) {
      toast({ title: "Failed to save project", variant: "destructive" });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField control={form.control} name="title" render={({ field }) => (
          <FormItem>
            <FormLabel>Title</FormLabel>
            <FormControl><Input placeholder="Project Name" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        
        <FormField control={form.control} name="description" render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl><Textarea placeholder="Brief description..." {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormItem>
          <FormLabel>Project Image (Supabase Storage)</FormLabel>
          <FormControl>
            <div className="flex gap-4 items-center">
              <Input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
              {uploading && <Loader2 className="animate-spin" />}
            </div>
          </FormControl>
          {form.watch("image") && <img src={form.watch("image")} alt="Preview" className="h-20 rounded border mt-2" />}
        </FormItem>

        <FormField control={form.control} name="link" render={({ field }) => (
          <FormItem>
            <FormLabel>Project Link</FormLabel>
            <FormControl><Input placeholder="https://..." {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <Button type="submit" className="w-full" disabled={createProject.isPending || updateProject.isPending || uploading}>
          {(createProject.isPending || updateProject.isPending) ? "Saving..." : (project ? "Update Project" : "Create Project")}
        </Button>
      </form>
    </Form>
  );
}
