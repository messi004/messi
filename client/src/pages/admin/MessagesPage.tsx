import AdminLayout from "@/components/admin/AdminLayout";
import { useMessages, useDeleteMessage } from "@/hooks/use-contact";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function MessagesPage() {
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
                      <Button variant="destructive" size="icon" onClick={() => handleDelete(msg.id)}>
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
    </AdminLayout>
  );
}
