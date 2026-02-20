import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function RedirectsPage() {
  const { data: redirects, isLoading } = useQuery({ queryKey: ['/api/redirects'] });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [fromPath, setFromPath] = useState('');
  const [toPath, setToPath] = useState('');
  const [statusCode, setStatusCode] = useState('301');
  const { toast } = useToast();

  const createRedirect = useMutation({
    mutationFn: (data: any) => apiRequest('POST', '/api/redirects', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/redirects'] });
      toast({ title: "Redirect created!" });
      setIsDialogOpen(false);
      setFromPath('');
      setToPath('');
      setStatusCode('301');
    },
    onError: () => toast({ title: "Failed to create redirect", variant: "destructive" })
  });

  const updateRedirect = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => apiRequest('PATCH', `/api/redirects/${id}`, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['/api/redirects'] }); toast({ title: "Redirect updated!" }); }
  });

  const deleteRedirect = useMutation({
    mutationFn: (id: number) => apiRequest('DELETE', `/api/redirects/${id}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['/api/redirects'] }); toast({ title: "Redirect deleted" }); }
  });

  return (
    <AdminLayout title="URL Redirects">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4 flex-wrap">
          <div>
            <CardTitle>301 & 302 Redirects</CardTitle>
            <CardDescription>Manage URL redirects for SEO and user experience</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild><Button className="gap-2"><Plus size={16} /> Add Redirect</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Create Redirect</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">From Path</label>
                  <Input value={fromPath} onChange={(e) => setFromPath(e.target.value)} placeholder="/old-page" />
                </div>
                <div>
                  <label className="text-sm font-medium">To Path</label>
                  <Input value={toPath} onChange={(e) => setToPath(e.target.value)} placeholder="/new-page or https://..." />
                </div>
                <div>
                  <label className="text-sm font-medium">Status Code</label>
                  <Select value={statusCode} onValueChange={setStatusCode}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="301">301 - Permanent Redirect</SelectItem>
                      <SelectItem value="302">302 - Temporary Redirect</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={() => createRedirect.mutate({ fromPath, toPath, statusCode: parseInt(statusCode), isActive: true })}
                  disabled={createRedirect.isPending || !fromPath || !toPath}
                  className="w-full"
                >
                  {createRedirect.isPending ? "Creating..." : "Create Redirect"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {isLoading ? <Loader2 className="animate-spin mx-auto" /> : (redirects as any[])?.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No redirects configured</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>From</TableHead>
                  <TableHead>To</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Active</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(redirects as any[])?.map((r: any) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-mono text-sm">{r.fromPath}</TableCell>
                    <TableCell className="font-mono text-sm max-w-[200px] truncate">{r.toPath}</TableCell>
                    <TableCell>{r.statusCode}</TableCell>
                    <TableCell>
                      <Switch
                        checked={r.isActive}
                        onCheckedChange={(v) => updateRedirect.mutate({ id: r.id, data: { isActive: v } })}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="destructive" size="icon" onClick={() => deleteRedirect.mutate(r.id)}>
                        <Trash2 size={14} />
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
