import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Loader2, Pencil } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function PageSeoPage() {
  const { data: pages, isLoading } = useQuery({ queryKey: ['/api/seo/pages'] });
  const [editingPage, setEditingPage] = useState<any>(null);
  const { toast } = useToast();

  const saveSeo = useMutation({
    mutationFn: (data: any) => apiRequest('/api/seo/pages', { method: 'POST', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['/api/seo/pages'] }); toast({ title: "SEO saved!" }); setEditingPage(null); }
  });

  return (
    <AdminLayout title="Page SEO">
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Page-Level SEO Settings</CardTitle>
            <CardDescription>Configure meta tags, keywords, Open Graph, and robots directives for each page</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? <Loader2 className="animate-spin mx-auto" /> : (
              <div className="grid gap-4">
                {(pages as any[])?.map((page: any) => (
                  <div key={page.pageSlug} className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                    <div>
                      <h3 className="font-semibold">{page.pageName}</h3>
                      <p className="text-sm text-muted-foreground">{page.metaTitle || 'No title set'}</p>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => setEditingPage(page)}><Pencil size={14} className="mr-2" /> Edit</Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Dialog open={!!editingPage} onOpenChange={(open) => !open && setEditingPage(null)}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader><DialogTitle>Edit SEO: {editingPage?.pageName}</DialogTitle></DialogHeader>
            {editingPage && <PageSeoForm page={editingPage} onSave={(data) => saveSeo.mutate(data)} saving={saveSeo.isPending} />}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}

function PageSeoForm({ page, onSave, saving }: { page: any; onSave: (data: any) => void; saving: boolean }) {
  const [formData, setFormData] = useState(page);
  const update = (key: string, value: any) => setFormData({ ...formData, [key]: value });

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Basic Meta Tags</h4>
        <div className="grid gap-4">
          <div><label className="text-sm font-medium">Title Tag</label><Input value={formData.metaTitle || ''} onChange={(e) => update('metaTitle', e.target.value)} placeholder="Page Title | Site Name" /></div>
          <div><label className="text-sm font-medium">Meta Description</label><Textarea value={formData.metaDescription || ''} onChange={(e) => update('metaDescription', e.target.value)} placeholder="Page description for search engines..." /></div>
          <div><label className="text-sm font-medium">Meta Keywords</label><Input value={formData.metaKeywords || ''} onChange={(e) => update('metaKeywords', e.target.value)} placeholder="keyword1, keyword2, keyword3" /></div>
          <div><label className="text-sm font-medium">Canonical URL</label><Input value={formData.canonicalUrl || ''} onChange={(e) => update('canonicalUrl', e.target.value)} placeholder="https://yoursite.com/page" /></div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Robots Directives</h4>
        <div className="flex gap-6">
          <label className="flex items-center gap-2"><Switch checked={formData.robotsIndex ?? true} onCheckedChange={(v) => update('robotsIndex', v)} /> Index this page</label>
          <label className="flex items-center gap-2"><Switch checked={formData.robotsFollow ?? true} onCheckedChange={(v) => update('robotsFollow', v)} /> Follow links</label>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Open Graph (Social Sharing)</h4>
        <div className="grid gap-4">
          <div><label className="text-sm font-medium">OG Title</label><Input value={formData.ogTitle || ''} onChange={(e) => update('ogTitle', e.target.value)} /></div>
          <div><label className="text-sm font-medium">OG Description</label><Textarea value={formData.ogDescription || ''} onChange={(e) => update('ogDescription', e.target.value)} /></div>
          <div><label className="text-sm font-medium">OG Image URL</label><Input value={formData.ogImage || ''} onChange={(e) => update('ogImage', e.target.value)} placeholder="https://..." /></div>
        </div>
      </div>

      <Button onClick={() => onSave(formData)} disabled={saving} className="w-full">{saving ? "Saving..." : "Save SEO Settings"}</Button>
    </div>
  );
}
