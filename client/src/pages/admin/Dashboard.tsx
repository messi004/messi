import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useProjects, useDeleteProject, useCreateProject, useUpdateProject } from "@/hooks/use-projects";
import { useMessages, useDeleteMessage } from "@/hooks/use-contact";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Plus, Trash2, LogOut, Pencil, Settings, FileCode, Map, Bot, BarChart } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertProjectSchema, type InsertProject, type Project } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function AdminDashboard() {
  const { isAuthenticated, isLoading, logout } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation("/admin/login");
    }
  }, [isLoading, isAuthenticated, setLocation]);

  if (isLoading || !isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-background p-4 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold font-heading">Admin Dashboard</h1>
          <Button variant="outline" onClick={() => logout()} className="gap-2" data-testid="button-logout">
            <LogOut size={16} /> Logout
          </Button>
        </div>

        <Tabs defaultValue="projects" className="w-full">
          <TabsList className="flex flex-wrap h-auto gap-1">
            <TabsTrigger value="projects" data-testid="tab-projects">Projects</TabsTrigger>
            <TabsTrigger value="messages" data-testid="tab-messages">Messages</TabsTrigger>
            <TabsTrigger value="page-seo" data-testid="tab-page-seo">Page SEO</TabsTrigger>
            <TabsTrigger value="schema" data-testid="tab-schema">Schema Markup</TabsTrigger>
            <TabsTrigger value="sitemap" data-testid="tab-sitemap">Sitemap</TabsTrigger>
            <TabsTrigger value="robots" data-testid="tab-robots">Robots.txt</TabsTrigger>
            <TabsTrigger value="analytics" data-testid="tab-analytics">Analytics</TabsTrigger>
            <TabsTrigger value="global-seo" data-testid="tab-global-seo">Global SEO</TabsTrigger>
          </TabsList>
          
          <TabsContent value="projects" className="mt-6"><ProjectsManager /></TabsContent>
          <TabsContent value="messages" className="mt-6"><MessagesManager /></TabsContent>
          <TabsContent value="page-seo" className="mt-6"><PageSeoManager /></TabsContent>
          <TabsContent value="schema" className="mt-6"><SchemaMarkupManager /></TabsContent>
          <TabsContent value="sitemap" className="mt-6"><SitemapManager /></TabsContent>
          <TabsContent value="robots" className="mt-6"><RobotsManager /></TabsContent>
          <TabsContent value="analytics" className="mt-6"><AnalyticsManager /></TabsContent>
          <TabsContent value="global-seo" className="mt-6"><GlobalSeoManager /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function ProjectsManager() {
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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4 flex-wrap">
        <div>
          <CardTitle>Projects</CardTitle>
          <CardDescription>Manage your portfolio projects</CardDescription>
        </div>
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
                <TableRow key={project.id} data-testid={`row-project-${project.id}`}>
                  <TableCell>
                    <img src={project.image} alt={project.title} className="w-16 h-10 object-cover rounded" />
                  </TableCell>
                  <TableCell className="font-medium">{project.title}</TableCell>
                  <TableCell className="max-w-[300px] truncate">{project.description}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="icon" onClick={() => { setEditingProject(project); setIsDialogOpen(true); }} data-testid={`button-edit-project-${project.id}`}>
                      <Pencil size={16} />
                    </Button>
                    <Button variant="destructive" size="icon" onClick={() => handleDelete(project.id)} data-testid={`button-delete-project-${project.id}`}>
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
  );
}

function MessagesManager() {
  const { data: messages, isLoading } = useMessages();
  const deleteMessage = useDeleteMessage();
  const { toast } = useToast();

  const handleDelete = async (id: number) => {
    if (confirm("Delete this message?")) {
      await deleteMessage.mutateAsync(id);
      toast({ title: "Message deleted" });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Messages</CardTitle>
        <CardDescription>View contact form submissions</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>
        ) : messages?.length === 0 ? (
          <div className="text-center text-muted-foreground p-8">No messages yet</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Message</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {messages?.map((msg) => (
                <TableRow key={msg.id}>
                  <TableCell className="whitespace-nowrap">{new Date(msg.createdAt!).toLocaleDateString()}</TableCell>
                  <TableCell className="font-medium">{msg.name}</TableCell>
                  <TableCell>{msg.email}</TableCell>
                  <TableCell className="max-w-[300px]">{msg.message}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="destructive" size="icon" onClick={() => handleDelete(msg.id)} data-testid={`button-delete-message-${msg.id}`}>
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
      toast({ title: "Image uploaded successfully" });
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
            <FormControl><Input placeholder="Project Name" {...field} data-testid="input-project-title" /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        
        <FormField control={form.control} name="description" render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl><Textarea placeholder="Brief description..." {...field} data-testid="input-project-description" /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormItem>
          <FormLabel>Project Image</FormLabel>
          <FormControl>
            <div className="flex gap-4 items-center">
              <Input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} data-testid="input-project-image" />
              {uploading && <Loader2 className="animate-spin" />}
            </div>
          </FormControl>
          {form.watch("image") && <img src={form.watch("image")} alt="Preview" className="h-20 rounded border mt-2" />}
        </FormItem>

        <FormField control={form.control} name="link" render={({ field }) => (
          <FormItem>
            <FormLabel>Project Link</FormLabel>
            <FormControl><Input placeholder="https://..." {...field} data-testid="input-project-link" /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <Button type="submit" className="w-full" disabled={createProject.isPending || updateProject.isPending || uploading} data-testid="button-submit-project">
          {(createProject.isPending || updateProject.isPending) ? "Saving..." : (project ? "Update Project" : "Create Project")}
        </Button>
      </form>
    </Form>
  );
}

function PageSeoManager() {
  const { data: pages, isLoading } = useQuery({ queryKey: ['/api/seo/pages'] });
  const [editingPage, setEditingPage] = useState<any>(null);
  const { toast } = useToast();

  const saveSeo = useMutation({
    mutationFn: (data: any) => apiRequest('/api/seo/pages', { method: 'POST', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['/api/seo/pages'] }); toast({ title: "SEO saved!" }); setEditingPage(null); }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Settings size={20} /> Page-Level SEO</CardTitle>
        <CardDescription>Configure meta tags, Open Graph, and robots directives per page</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? <Loader2 className="animate-spin mx-auto" /> : (
          <div className="space-y-4">
            {(pages as any[])?.map((page: any) => (
              <Card key={page.pageSlug} className="p-4">
                <div className="flex justify-between items-start gap-4 flex-wrap">
                  <div>
                    <h3 className="font-bold">{page.pageName} ({page.pageSlug})</h3>
                    <p className="text-sm text-muted-foreground">{page.metaTitle}</p>
                  </div>
                  <Button size="sm" onClick={() => setEditingPage(page)} data-testid={`button-edit-seo-${page.pageSlug}`}><Pencil size={14} /></Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        <Dialog open={!!editingPage} onOpenChange={(open) => !open && setEditingPage(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader><DialogTitle>Edit SEO: {editingPage?.pageName}</DialogTitle></DialogHeader>
            {editingPage && <PageSeoForm page={editingPage} onSave={(data) => saveSeo.mutate(data)} saving={saveSeo.isPending} />}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

function PageSeoForm({ page, onSave, saving }: { page: any; onSave: (data: any) => void; saving: boolean }) {
  const [formData, setFormData] = useState(page);
  const update = (key: string, value: any) => setFormData({ ...formData, [key]: value });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><label className="text-sm font-medium">Meta Title</label><Input value={formData.metaTitle || ''} onChange={(e) => update('metaTitle', e.target.value)} data-testid="input-meta-title" /></div>
        <div><label className="text-sm font-medium">Canonical URL</label><Input value={formData.canonicalUrl || ''} onChange={(e) => update('canonicalUrl', e.target.value)} data-testid="input-canonical-url" /></div>
      </div>
      <div><label className="text-sm font-medium">Meta Description</label><Textarea value={formData.metaDescription || ''} onChange={(e) => update('metaDescription', e.target.value)} data-testid="input-meta-description" /></div>
      <div className="flex gap-6">
        <label className="flex items-center gap-2"><Switch checked={formData.robotsIndex} onCheckedChange={(v) => update('robotsIndex', v)} /> Index</label>
        <label className="flex items-center gap-2"><Switch checked={formData.robotsFollow} onCheckedChange={(v) => update('robotsFollow', v)} /> Follow</label>
      </div>
      <h4 className="font-semibold mt-4">Open Graph</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><label className="text-sm font-medium">OG Title</label><Input value={formData.ogTitle || ''} onChange={(e) => update('ogTitle', e.target.value)} /></div>
        <div><label className="text-sm font-medium">OG Image URL</label><Input value={formData.ogImage || ''} onChange={(e) => update('ogImage', e.target.value)} /></div>
      </div>
      <div><label className="text-sm font-medium">OG Description</label><Textarea value={formData.ogDescription || ''} onChange={(e) => update('ogDescription', e.target.value)} /></div>
      <Button onClick={() => onSave(formData)} disabled={saving} className="w-full" data-testid="button-save-seo">{saving ? "Saving..." : "Save SEO Settings"}</Button>
    </div>
  );
}

function SchemaMarkupManager() {
  const { data: schemas, isLoading } = useQuery({ queryKey: ['/api/seo/schema'] });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [jsonInput, setJsonInput] = useState('{\n  "@context": "https://schema.org",\n  "@type": "Organization"\n}');
  const [pageSlug, setPageSlug] = useState('home');
  const [schemaType, setSchemaType] = useState('Organization');
  const { toast } = useToast();

  const createSchema = useMutation({
    mutationFn: (data: any) => apiRequest('/api/seo/schema', { method: 'POST', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['/api/seo/schema'] }); toast({ title: "Schema created!" }); setIsDialogOpen(false); }
  });

  const deleteSchema = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/seo/schema/${id}`, { method: 'DELETE' }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['/api/seo/schema'] }); toast({ title: "Schema deleted" }); }
  });

  const handleCreate = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      createSchema.mutate({ pageSlug, schemaType, schemaData: parsed });
    } catch {
      toast({ title: "Invalid JSON", variant: "destructive" });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4 flex-wrap">
        <div>
          <CardTitle className="flex items-center gap-2"><FileCode size={20} /> Schema Markup (JSON-LD)</CardTitle>
          <CardDescription>Add structured data for rich search results</CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild><Button className="gap-2" data-testid="button-add-schema"><Plus size={16} /> Add Schema</Button></DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader><DialogTitle>Add Schema Markup</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-sm font-medium">Page</label>
                  <Select value={pageSlug} onValueChange={setPageSlug}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="home">Home</SelectItem>
                      <SelectItem value="projects">Projects</SelectItem>
                      <SelectItem value="services">Services</SelectItem>
                      <SelectItem value="skills">Skills</SelectItem>
                      <SelectItem value="contact">Contact</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div><label className="text-sm font-medium">Schema Type</label>
                  <Select value={schemaType} onValueChange={setSchemaType}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Organization">Organization</SelectItem>
                      <SelectItem value="Person">Person</SelectItem>
                      <SelectItem value="Service">Service</SelectItem>
                      <SelectItem value="FAQ">FAQ</SelectItem>
                      <SelectItem value="Product">Product</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div><label className="text-sm font-medium">JSON-LD</label>
                <Textarea value={jsonInput} onChange={(e) => setJsonInput(e.target.value)} className="font-mono min-h-[200px]" data-testid="input-schema-json" />
              </div>
              <Button onClick={handleCreate} disabled={createSchema.isPending} className="w-full" data-testid="button-create-schema">{createSchema.isPending ? "Creating..." : "Create Schema"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {isLoading ? <Loader2 className="animate-spin mx-auto" /> : (
          <Table>
            <TableHeader><TableRow><TableHead>Page</TableHead><TableHead>Type</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {(schemas as any[])?.map((s: any) => (
                <TableRow key={s.id}>
                  <TableCell>{s.pageSlug}</TableCell>
                  <TableCell>{s.schemaType}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="destructive" size="icon" onClick={() => deleteSchema.mutate(s.id)} data-testid={`button-delete-schema-${s.id}`}><Trash2 size={16} /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

function SitemapManager() {
  const { data: configs, isLoading } = useQuery({ queryKey: ['/api/seo/sitemap'] });
  const { toast } = useToast();

  const updateConfig = useMutation({
    mutationFn: (data: any) => apiRequest('/api/seo/sitemap', { method: 'POST', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['/api/seo/sitemap'] }); toast({ title: "Sitemap updated!" }); }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Map size={20} /> XML Sitemap Manager</CardTitle>
        <CardDescription>Configure which pages appear in your sitemap.xml</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? <Loader2 className="animate-spin mx-auto" /> : (
          <Table>
            <TableHeader><TableRow><TableHead>Page</TableHead><TableHead>Include</TableHead><TableHead>Priority</TableHead><TableHead>Frequency</TableHead></TableRow></TableHeader>
            <TableBody>
              {(configs as any[])?.map((c: any) => (
                <TableRow key={c.pageSlug}>
                  <TableCell className="font-medium">{c.pageSlug}</TableCell>
                  <TableCell><Switch checked={c.includeInSitemap} onCheckedChange={(v) => updateConfig.mutate({ ...c, includeInSitemap: v })} /></TableCell>
                  <TableCell>
                    <Select value={c.priority} onValueChange={(v) => updateConfig.mutate({ ...c, priority: v })}>
                      <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1.0">1.0</SelectItem>
                        <SelectItem value="0.8">0.8</SelectItem>
                        <SelectItem value="0.5">0.5</SelectItem>
                        <SelectItem value="0.3">0.3</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Select value={c.changeFrequency} onValueChange={(v) => updateConfig.mutate({ ...c, changeFrequency: v })}>
                      <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        <p className="text-sm text-muted-foreground mt-4">Your sitemap is available at: <a href="/sitemap.xml" target="_blank" className="text-primary underline">/sitemap.xml</a></p>
      </CardContent>
    </Card>
  );
}

function RobotsManager() {
  const { data: config, isLoading } = useQuery({ queryKey: ['/api/seo/robots'] });
  const [content, setContent] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (config && (config as any).content) setContent((config as any).content);
  }, [config]);

  const saveRobots = useMutation({
    mutationFn: (data: any) => apiRequest('/api/seo/robots', { method: 'POST', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['/api/seo/robots'] }); toast({ title: "Robots.txt saved!" }); }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Bot size={20} /> Robots.txt Manager</CardTitle>
        <CardDescription>Control how search engines crawl your site</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? <Loader2 className="animate-spin mx-auto" /> : (
          <>
            <Textarea value={content} onChange={(e) => setContent(e.target.value)} className="font-mono min-h-[200px]" placeholder="User-agent: *&#10;Allow: /&#10;Sitemap: https://yoursite.com/sitemap.xml" data-testid="input-robots-content" />
            <Button onClick={() => saveRobots.mutate({ environment: 'production', content })} disabled={saveRobots.isPending} data-testid="button-save-robots">{saveRobots.isPending ? "Saving..." : "Save Robots.txt"}</Button>
            <p className="text-sm text-muted-foreground">Your robots.txt is available at: <a href="/robots.txt" target="_blank" className="text-primary underline">/robots.txt</a></p>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function AnalyticsManager() {
  const { data: config, isLoading } = useQuery({ queryKey: ['/api/seo/analytics'] });
  const [ga4Id, setGa4Id] = useState('');
  const [searchConsole, setSearchConsole] = useState('');
  const [metaPixel, setMetaPixel] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (config) {
      setGa4Id((config as any).ga4MeasurementId || '');
      setSearchConsole((config as any).searchConsoleVerification || '');
      setMetaPixel((config as any).metaPixelId || '');
    }
  }, [config]);

  const saveAnalytics = useMutation({
    mutationFn: (data: any) => apiRequest('/api/seo/analytics', { method: 'POST', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['/api/seo/analytics'] }); toast({ title: "Analytics settings saved!" }); }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><BarChart size={20} /> Analytics & Webmaster Integration</CardTitle>
        <CardDescription>Connect Google Analytics, Search Console, and Meta Pixel</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? <Loader2 className="animate-spin mx-auto" /> : (
          <>
            <div><label className="text-sm font-medium">Google Analytics 4 Measurement ID</label><Input value={ga4Id} onChange={(e) => setGa4Id(e.target.value)} placeholder="G-XXXXXXXXXX" data-testid="input-ga4-id" /></div>
            <div><label className="text-sm font-medium">Google Search Console Verification</label><Input value={searchConsole} onChange={(e) => setSearchConsole(e.target.value)} placeholder="google-site-verification=..." data-testid="input-search-console" /></div>
            <div><label className="text-sm font-medium">Meta Pixel ID</label><Input value={metaPixel} onChange={(e) => setMetaPixel(e.target.value)} placeholder="1234567890" data-testid="input-meta-pixel" /></div>
            <Button onClick={() => saveAnalytics.mutate({ ga4MeasurementId: ga4Id, searchConsoleVerification: searchConsole, metaPixelId: metaPixel })} disabled={saveAnalytics.isPending} data-testid="button-save-analytics">{saveAnalytics.isPending ? "Saving..." : "Save Analytics Settings"}</Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function GlobalSeoManager() {
  const { data: config, isLoading } = useQuery({ queryKey: ['/api/seo/global'] });
  const [siteName, setSiteName] = useState('');
  const [siteDescription, setSiteDescription] = useState('');
  const [defaultOgImage, setDefaultOgImage] = useState('');
  const [favicon, setFavicon] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (config) {
      setSiteName((config as any).siteName || '');
      setSiteDescription((config as any).siteDescription || '');
      setDefaultOgImage((config as any).defaultOgImage || '');
      setFavicon((config as any).favicon || '');
    }
  }, [config]);

  const saveGlobal = useMutation({
    mutationFn: (data: any) => apiRequest('/api/seo/global', { method: 'POST', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['/api/seo/global'] }); toast({ title: "Global SEO saved!" }); }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Settings size={20} /> Global SEO Settings</CardTitle>
        <CardDescription>Site-wide defaults and branding</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? <Loader2 className="animate-spin mx-auto" /> : (
          <>
            <div><label className="text-sm font-medium">Site Name</label><Input value={siteName} onChange={(e) => setSiteName(e.target.value)} placeholder="Messi Portfolio" data-testid="input-site-name" /></div>
            <div><label className="text-sm font-medium">Site Description</label><Textarea value={siteDescription} onChange={(e) => setSiteDescription(e.target.value)} placeholder="Full Stack Developer..." data-testid="input-site-description" /></div>
            <div><label className="text-sm font-medium">Default OG Image URL</label><Input value={defaultOgImage} onChange={(e) => setDefaultOgImage(e.target.value)} placeholder="https://..." data-testid="input-default-og-image" /></div>
            <div><label className="text-sm font-medium">Favicon URL</label><Input value={favicon} onChange={(e) => setFavicon(e.target.value)} placeholder="https://..." data-testid="input-favicon" /></div>
            <Button onClick={() => saveGlobal.mutate({ siteName, siteDescription, defaultOgImage, favicon })} disabled={saveGlobal.isPending} data-testid="button-save-global">{saveGlobal.isPending ? "Saving..." : "Save Global Settings"}</Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
