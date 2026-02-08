import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Trash2, CheckCircle, XCircle, Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

interface Faq {
  id: string;
  question: string;
  answer: string;
  isActive: boolean;
}

const ManageFAQs = () => {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<Faq | null>(null);
  
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    isActive: true,
  });

  const fetchFaqs = useCallback(async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || "/api";
      const res = await fetch(`${API_URL}/faqs?admin=true`);
      const data = await res.json();
      setFaqs(data);
    } catch (err) {
      toast({ variant: "destructive", title: "Failed to fetch FAQs" });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchFaqs();
  }, [fetchFaqs]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const API_URL = import.meta.env.VITE_API_URL || "/api";
      const url = editingFaq 
        ? `${API_URL}/faqs/${editingFaq.id}`
        : `${API_URL}/faqs`;
        
      const method = editingFaq ? "PATCH" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast({ title: editingFaq ? "FAQ Updated" : "FAQ Created" });
        setIsDialogOpen(false);
        setEditingFaq(null);
        setFormData({ question: "", answer: "", isActive: true });
        fetchFaqs();
      } else {
        toast({ variant: "destructive", title: "Operation failed" });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (faq: Faq) => {
    setEditingFaq(faq);
    setFormData({
      question: faq.question,
      answer: faq.answer,
      isActive: faq.isActive,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      const API_URL = import.meta.env.VITE_API_URL || "/api";
      await fetch(`${API_URL}/faqs/${id}`, { method: "DELETE" });
      toast({ title: "FAQ deleted" });
      fetchFaqs();
    } catch (error) {
      console.error(error);
    }
  };

  const toggleActive = async (faq: Faq) => {
    try {
        const API_URL = import.meta.env.VITE_API_URL || "/api";
      const res = await fetch(`${API_URL}/faqs/${faq.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isActive: !faq.isActive }),
        });

        if (res.ok) {
            toast({ title: `FAQ ${!faq.isActive ? "Activated" : "Deactivated"}` });
            fetchFaqs();
        }
    } catch (error) {
        console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-heading font-bold text-eaten-charcoal">
          Manage FAQs
        </h1>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setEditingFaq(null);
            setFormData({ question: "", answer: "", isActive: true });
          }
        }}>
          <DialogTrigger asChild>
            <Button className="bg-eaten-dark hover:bg-eaten-charcoal">
              <Plus className="w-4 h-4 mr-2" /> Add FAQ
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingFaq ? "Edit FAQ" : "Add FAQ"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Question</Label>
                <Input
                  value={formData.question}
                  onChange={(e) => setFormData({...formData, question: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label>Answer</Label>
                <Textarea
                  value={formData.answer}
                  onChange={(e) => setFormData({...formData, answer: e.target.value})}
                  required
                  rows={4}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({...formData, isActive: checked})}
                />
                <Label>Active</Label>
              </div>
              <Button type="submit" className="w-full">
                Save
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-lg shadow border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Question</TableHead>
              <TableHead>Answer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center h-24">
                  Loading...
                </TableCell>
              </TableRow>
            ) : (
              faqs.map((faq) => (
                <TableRow key={faq.id}>
                  <TableCell className="font-medium">{faq.question}</TableCell>
                  <TableCell className="max-w-md truncate">{faq.answer}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                       {faq.isActive ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                       ) : (
                        <XCircle className="w-4 h-4 text-gray-400" />
                       )}
                       <Switch 
                         checked={faq.isActive}
                         onCheckedChange={() => toggleActive(faq)}
                       />
                    </div>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(faq)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDelete(faq.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ManageFAQs;
