import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Plus, Trash2, Pencil } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const defaultSchema = `{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Messi Portfolio",
  "url": "https://yoursite.com"
}`;

export default function SchemaPage() {
  const { data: schemas, isLoading } = useQuery({ queryKey: ['/api/seo/schema'] });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [jsonInput, setJsonInput] = useState(defaultSchema);
  const [schemaName, setSchemaName] = useState('');
  const [pageSlug, setPageSlug] = useState('home');
  const [editingSchema, setEditingSchema] = useState<any>(null);
  const { toast } = useToast();

  const createSchema = useMutation({
    mutationFn: (data: any) => apiRequest('POST', '/api/seo/schema', data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['/api/seo/schema'] }); toast({ title: "Schema created!" }); setIsDialogOpen(false); resetForm(); }
  });

  const updateSchema = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => apiRequest('PATCH', `/api/seo/schema/${id}`, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['/api/seo/schema'] }); toast({ title: "Schema updated!" }); setIsDialogOpen(false); resetForm(); }
  });

  const deleteSchema = useMutation({
    mutationFn: (id: number) => apiRequest('DELETE', `/api/seo/schema/${id}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['/api/seo/schema'] }); toast({ title: "Schema deleted" }); }
  });

  const resetForm = () => {
    setJsonInput(defaultSchema);
    setSchemaName('');
    setPageSlug('home');
    setEditingSchema(null);
  };

  const handleSubmit = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      if (!schemaName.trim()) {
        toast({ title: "Please enter a schema name", variant: "destructive" });
        return;
      }
      if (editingSchema) {
        updateSchema.mutate({ id: editingSchema.id, data: { schemaName, schemaData: parsed, pageSlug } });
      } else {
        createSchema.mutate({ pageSlug, schemaName, schemaData: parsed });
      }
    } catch {
      toast({ title: "Invalid JSON-LD format", variant: "destructive" });
    }
  };

  const handleEdit = (schema: any) => {
    setEditingSchema(schema);
    setSchemaName(schema.schemaName);
    setPageSlug(schema.pageSlug);
    setJsonInput(JSON.stringify(schema.schemaData, null, 2));
    setIsDialogOpen(true);
  };

  return (
    <AdminLayout title="Schema Markup">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4 flex-wrap">
          <div>
            <CardTitle>JSON-LD Schema Markup</CardTitle>
            <CardDescription>Add structured data for rich search results</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild><Button className="gap-2"><Plus size={16} /> Add Schema</Button></DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
              <DialogHeader><DialogTitle>{editingSchema ? "Edit Schema" : "Add JSON-LD Schema"}</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Page</label>
                    <Select value={pageSlug} onValueChange={setPageSlug}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="home">Home</SelectItem>
                        <SelectItem value="projects">Projects</SelectItem>
                        <SelectItem value="services">Services</SelectItem>
                        <SelectItem value="skills">Skills</SelectItem>
                        <SelectItem value="contact">Contact</SelectItem>
                        <SelectItem value="global">Global (All Pages)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Schema Name</label>
                    <Input value={schemaName} onChange={(e) => setSchemaName(e.target.value)} placeholder="e.g., Organization, Person, FAQ" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">JSON-LD Data</label>
                  <Textarea value={jsonInput} onChange={(e) => setJsonInput(e.target.value)} className="font-mono min-h-[250px] text-sm" />
                  <p className="text-xs text-muted-foreground mt-1">Must be valid JSON following schema.org standards</p>
                </div>
                <Button onClick={handleSubmit} disabled={createSchema.isPending || updateSchema.isPending} className="w-full">
                  {(createSchema.isPending || updateSchema.isPending) ? "Saving..." : (editingSchema ? "Update Schema" : "Create Schema")}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {isLoading ? <Loader2 className="animate-spin mx-auto" /> : (schemas as any[])?.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No schemas added yet</p>
          ) : (
            <Table>
              <TableHeader><TableRow><TableHead>Page</TableHead><TableHead>Name</TableHead><TableHead>Preview</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
              <TableBody>
                {(schemas as any[])?.map((s: any) => (
                  <TableRow key={s.id}>
                    <TableCell className="capitalize">{s.pageSlug}</TableCell>
                    <TableCell className="font-medium">{s.schemaName}</TableCell>
                    <TableCell className="max-w-[200px] truncate text-xs font-mono text-muted-foreground">{JSON.stringify(s.schemaData).slice(0, 50)}...</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="icon" onClick={() => handleEdit(s)}><Pencil size={14} /></Button>
                      <Button variant="destructive" size="icon" onClick={() => deleteSchema.mutate(s.id)}><Trash2 size={14} /></Button>
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
