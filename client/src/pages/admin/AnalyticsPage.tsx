import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Eye } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function AnalyticsPage() {
  const { data: config, isLoading: configLoading } = useQuery({ queryKey: ['/api/seo/analytics'] });
  const { data: pageViews, isLoading: viewsLoading } = useQuery({ queryKey: ['/api/analytics/views'] });
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
    mutationFn: (data: any) => apiRequest('POST', '/api/seo/analytics', data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['/api/seo/analytics'] }); toast({ title: "Analytics settings saved!" }); }
  });

  const totalViews = (pageViews as any[])?.reduce((sum: number, p: any) => sum + (p.viewCount || 0), 0) || 0;

  return (
    <AdminLayout title="Analytics & Tracking">
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Tracking Configuration</CardTitle>
              <CardDescription>Connect Google Analytics, Search Console, and Meta Pixel</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {configLoading ? <Loader2 className="animate-spin mx-auto" /> : (
                <>
                  <div>
                    <label className="text-sm font-medium">Google Analytics 4 Measurement ID</label>
                    <Input value={ga4Id} onChange={(e) => setGa4Id(e.target.value)} placeholder="G-XXXXXXXXXX" />
                    <p className="text-xs text-muted-foreground mt-1">Find this in your GA4 property settings</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Google Search Console Verification</label>
                    <Input value={searchConsole} onChange={(e) => setSearchConsole(e.target.value)} placeholder="google-site-verification=..." />
                    <p className="text-xs text-muted-foreground mt-1">Meta tag content for site verification</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Meta Pixel ID</label>
                    <Input value={metaPixel} onChange={(e) => setMetaPixel(e.target.value)} placeholder="1234567890" />
                    <p className="text-xs text-muted-foreground mt-1">Facebook/Meta Pixel identifier</p>
                  </div>
                  <Button
                    onClick={() => saveAnalytics.mutate({ ga4MeasurementId: ga4Id, searchConsoleVerification: searchConsole, metaPixelId: metaPixel })}
                    disabled={saveAnalytics.isPending}
                    className="w-full"
                  >
                    {saveAnalytics.isPending ? "Saving..." : "Save Tracking Settings"}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Eye size={20} /> Simple Page Analytics</CardTitle>
              <CardDescription>Internal page view tracking</CardDescription>
            </CardHeader>
            <CardContent>
              {viewsLoading ? <Loader2 className="animate-spin mx-auto" /> : (
                <>
                  <div className="p-4 bg-primary/10 rounded-lg mb-4">
                    <p className="text-sm text-muted-foreground">Total Page Views</p>
                    <p className="text-3xl font-bold">{totalViews}</p>
                  </div>
                  <div className="space-y-2">
                    {(pageViews as any[])?.map((view: any) => (
                      <div key={view.pageSlug} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                        <span className="font-medium capitalize">{view.pageSlug}</span>
                        <span className="text-muted-foreground">{view.viewCount} views</span>
                      </div>
                    ))}
                    {(!pageViews || (pageViews as any[])?.length === 0) && (
                      <p className="text-center text-muted-foreground py-4">No page views recorded yet</p>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
