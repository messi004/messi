import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useMessages, useDeleteMessage } from "@/hooks/use-contact";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Loader2, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function MessagesPage() {
  const { data: messages, isLoading } = useMessages();
  const deleteMessage = useDeleteMessage();
  const { toast } = useToast();

  const [deleteId, setDeleteId] = useState<number | null>(null);

  const confirmDelete = async () => {
    if (deleteId) {
      await deleteMessage.mutateAsync(deleteId);
      toast({ title: "Message deleted" });
      setDeleteId(null);
    }
  };

  return (
    <AdminLayout title="Contact Messages">
      <Card>
        <CardHeader>
          <CardTitle>Contact Form Submissions</CardTitle>
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
                      <Button variant="destructive" size="icon" onClick={() => setDeleteId(msg.id)}>
                        <Trash2 size={16} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
        <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Message</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this message? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
              <Button variant="destructive" onClick={confirmDelete} disabled={deleteMessage.isPending}>
                {deleteMessage.isPending ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
                Delete Message
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Card>
    </AdminLayout>
  );
}
