import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const defaultRobots = `User-agent: *
Allow: /

# Disallow admin pages
Disallow: /admin/

# Sitemap
Sitemap: https://yoursite.com/sitemap.xml`;

export default function RobotsPage() {
  const { data: config, isLoading } = useQuery({ queryKey: ['/api/seo/robots'] });
  const [content, setContent] = useState(defaultRobots);
  const { toast } = useToast();

  useEffect(() => {
    if (config && (config as any).content) {
      setContent((config as any).content);
    }
  }, [config]);

  const saveRobots = useMutation({
    mutationFn: (data: any) => apiRequest('POST', '/api/seo/robots', data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['/api/seo/robots'] }); toast({ title: "Robots.txt saved!" }); }
  });

  return (
    <AdminLayout title="Robots.txt Manager">
      <Card>
        <CardHeader>
          <CardTitle>Robots.txt Editor</CardTitle>
          <CardDescription>Control how search engine crawlers access your site</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? <Loader2 className="animate-spin mx-auto" /> : (
            <>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="font-mono min-h-[300px] text-sm"
                placeholder="User-agent: *&#10;Allow: /"
              />
              <div className="flex gap-4">
                <Button
                  onClick={() => saveRobots.mutate({ environment: 'production', content })}
                  disabled={saveRobots.isPending}
                >
                  {saveRobots.isPending ? "Saving..." : "Save Robots.txt"}
                </Button>
                <Button variant="outline" onClick={() => setContent(defaultRobots)}>
                  Reset to Default
                </Button>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm font-medium mb-2">Your Robots.txt</p>
                <a href="/robots.txt" target="_blank" className="text-primary underline text-sm">/robots.txt</a>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
