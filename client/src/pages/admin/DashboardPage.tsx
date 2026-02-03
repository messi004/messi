import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Loader2, FolderKanban, MessageSquare, Eye, FileText } from "lucide-react";

export default function DashboardPage() {
  const { data: projects } = useQuery({ queryKey: ['/api/projects'] });
  const { data: messages } = useQuery({ queryKey: ['/api/contact'] });
  const { data: pageViews } = useQuery({ queryKey: ['/api/analytics/views'] });
  const { data: pages } = useQuery({ queryKey: ['/api/seo/pages'] });

  const totalViews = (pageViews as any[])?.reduce((sum: number, p: any) => sum + (p.viewCount || 0), 0) || 0;

  const stats = [
    { label: "Total Projects", value: (projects as any[])?.length || 0, icon: FolderKanban, color: "text-blue-500" },
    { label: "Messages", value: (messages as any[])?.length || 0, icon: MessageSquare, color: "text-green-500" },
    { label: "Page Views", value: totalViews, icon: Eye, color: "text-purple-500" },
    { label: "SEO Pages", value: (pages as any[])?.length || 0, icon: FileText, color: "text-orange-500" },
  ];

  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Page Views</CardTitle>
            </CardHeader>
            <CardContent>
              {!pageViews ? (
                <Loader2 className="animate-spin mx-auto" />
              ) : (pageViews as any[])?.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No page views yet</p>
              ) : (
                <div className="space-y-3">
                  {(pageViews as any[])?.slice(0, 5).map((view: any) => (
                    <div key={view.pageSlug} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <span className="font-medium capitalize">{view.pageSlug}</span>
                      <span className="text-muted-foreground">{view.viewCount} views</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Links</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              <a href="/sitemap.xml" target="_blank" className="p-3 bg-muted/50 rounded-lg text-center hover:bg-muted transition-colors">
                sitemap.xml
              </a>
              <a href="/robots.txt" target="_blank" className="p-3 bg-muted/50 rounded-lg text-center hover:bg-muted transition-colors">
                robots.txt
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
