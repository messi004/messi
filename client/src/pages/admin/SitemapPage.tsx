import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function SitemapPage() {
  const { data: configs, isLoading } = useQuery({ queryKey: ['/api/seo/sitemap'] });
  const { toast } = useToast();

  const updateConfig = useMutation({
    mutationFn: (data: any) => apiRequest('/api/seo/sitemap', { method: 'POST', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['/api/seo/sitemap'] }); toast({ title: "Sitemap updated!" }); }
  });

  return (
    <AdminLayout title="Sitemap Manager">
      <Card>
        <CardHeader>
          <CardTitle>XML Sitemap Configuration</CardTitle>
          <CardDescription>Control which pages appear in your sitemap.xml and their properties</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? <Loader2 className="animate-spin mx-auto" /> : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Page</TableHead>
                    <TableHead>Include</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Change Frequency</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(configs as any[])?.map((c: any) => (
                    <TableRow key={c.pageSlug}>
                      <TableCell className="font-medium capitalize">{c.pageSlug}</TableCell>
                      <TableCell>
                        <Switch 
                          checked={c.includeInSitemap} 
                          onCheckedChange={(v) => updateConfig.mutate({ ...c, includeInSitemap: v })} 
                        />
                      </TableCell>
                      <TableCell>
                        <Select value={c.priority} onValueChange={(v) => updateConfig.mutate({ ...c, priority: v })}>
                          <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1.0">1.0</SelectItem>
                            <SelectItem value="0.8">0.8</SelectItem>
                            <SelectItem value="0.6">0.6</SelectItem>
                            <SelectItem value="0.5">0.5</SelectItem>
                            <SelectItem value="0.3">0.3</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Select value={c.changeFrequency} onValueChange={(v) => updateConfig.mutate({ ...c, changeFrequency: v })}>
                          <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="always">Always</SelectItem>
                            <SelectItem value="hourly">Hourly</SelectItem>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="yearly">Yearly</SelectItem>
                            <SelectItem value="never">Never</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <p className="text-sm font-medium mb-2">Your Sitemap</p>
                <a href="/sitemap.xml" target="_blank" className="text-primary underline text-sm">/sitemap.xml</a>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
