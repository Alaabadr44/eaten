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
import { Plus, Trash2, CheckCircle, XCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface Zone {
  id: string;
  name: string;
  isActive: boolean;
}

const ZonesManager = () => {
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newZoneName, setNewZoneName] = useState("");

  const fetchZones = useCallback(async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || "/api";
      const res = await fetch(`${API_URL}/zones`);
      const data = await res.json();
      setZones(data.data);
    } catch (err) {
      toast({ variant: "destructive", title: "Failed to fetch zones" });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchZones();
  }, [fetchZones]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const API_URL = import.meta.env.VITE_API_URL || "/api";
      const res = await fetch(`${API_URL}/zones`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newZoneName, isActive: true }),
      });

      if (res.ok) {
        toast({ title: "Zone Created" });
        setIsDialogOpen(false);
        setNewZoneName("");
        fetchZones();
      } else {
        toast({ variant: "destructive", title: "Operation failed" });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const toggleActive = async (zone: Zone) => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || "/api";
      const res = await fetch(`${API_URL}/zones/${zone.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !zone.isActive }),
      });

      if (res.ok) {
        toast({ title: `Zone ${!zone.isActive ? "Activated" : "Deactivated"}` });
        fetchZones();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      const API_URL = import.meta.env.VITE_API_URL || "/api";
      await fetch(`${API_URL}/zones/${id}`, { method: "DELETE" });
      toast({ title: "Zone deleted" });
      fetchZones();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-heading font-bold text-eaten-charcoal">
          Zones
        </h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-eaten-dark hover:bg-eaten-charcoal">
              <Plus className="w-4 h-4 mr-2" /> Add Zone
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Zone</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input
                  value={newZoneName}
                  onChange={(e) => setNewZoneName(e.target.value)}
                  required
                />
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
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center h-24">
                  Loading...
                </TableCell>
              </TableRow>
            ) : (
              zones.map((zone) => (
                <TableRow key={zone.id}>
                  <TableCell className="font-medium">{zone.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                       {zone.isActive ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                       ) : (
                        <XCircle className="w-4 h-4 text-gray-400" />
                       )}
                       <Switch 
                         checked={zone.isActive}
                         onCheckedChange={() => toggleActive(zone)}
                       />
                    </div>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDelete(zone.id)}
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

export default ZonesManager;
