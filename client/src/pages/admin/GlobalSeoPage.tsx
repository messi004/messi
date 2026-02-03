import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function GlobalSeoPage() {
  const { data: config, isLoading } = useQuery({ queryKey: ['/api/seo/global'] });
  const [siteName, setSiteName] = useState('');
  const [siteDescription, setSiteDescription] = useState('');
  const [defaultOgImage, setDefaultOgImage] = useState('');
  const [favicon, setFavicon] = useState('');
  const [uploading, setUploading] = useState(false);
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'og' | 'favicon') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    setUploading(true);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData, credentials: "include" });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      if (field === 'og') setDefaultOgImage(data.url);
      else setFavicon(data.url);
      toast({ title: "Image uploaded!" });
    } catch (error) {
      toast({ title: "Upload failed", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  return (
    <AdminLayout title="Global SEO Settings">
      <Card>
        <CardHeader>
          <CardTitle>Site-Wide SEO Defaults</CardTitle>
          <CardDescription>Configure default settings that apply across all pages</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {isLoading ? <Loader2 className="animate-spin mx-auto" /> : (
            <>
              <div className="grid gap-4">
                <div>
                  <label className="text-sm font-medium">Site Name</label>
                  <Input value={siteName} onChange={(e) => setSiteName(e.target.value)} placeholder="Messi Portfolio" />
                  <p className="text-xs text-muted-foreground mt-1">Used in title tags and schema markup</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Site Description</label>
                  <Textarea value={siteDescription} onChange={(e) => setSiteDescription(e.target.value)} placeholder="Professional portfolio of a Full Stack Developer..." />
                  <p className="text-xs text-muted-foreground mt-1">Default meta description when page-specific is not set</p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">Default OG Image</label>
                  <div className="space-y-2">
                    <Input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'og')} disabled={uploading} />
                    {defaultOgImage && <img src={defaultOgImage} alt="OG Preview" className="h-24 rounded border" />}
                    <Input value={defaultOgImage} onChange={(e) => setDefaultOgImage(e.target.value)} placeholder="Or enter URL directly..." />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Favicon</label>
                  <div className="space-y-2">
                    <Input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'favicon')} disabled={uploading} />
                    {favicon && <img src={favicon} alt="Favicon Preview" className="h-12 rounded border" />}
                    <Input value={favicon} onChange={(e) => setFavicon(e.target.value)} placeholder="Or enter URL directly..." />
                  </div>
                </div>
              </div>

              <Button 
                onClick={() => saveGlobal.mutate({ siteName, siteDescription, defaultOgImage, favicon })} 
                disabled={saveGlobal.isPending || uploading}
                className="w-full"
              >
                {saveGlobal.isPending ? "Saving..." : "Save Global Settings"}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
