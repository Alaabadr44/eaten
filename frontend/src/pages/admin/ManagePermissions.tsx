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
import { Plus, Pencil, Trash2, Loader2, Shield, Wand2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { permissionService } from "../../services/permissionService";

interface Permission {
  id: string;
  name: string;
  description: string;
}

const DEFAULT_PERMISSIONS = [
  { name: "MANAGE_USERS", description: "Create, edit, and delete admin users" },
  { name: "MANAGE_PERMISSIONS", description: "Manage system permissions" },
  { name: "VIEW_LOGS", description: "View system audit logs" },
  { name: "MANAGE_BOOKINGS", description: "Manage bookings" },
  { name: "MANAGE_SERVICES", description: "Manage services" },
  { name: "MANAGE_ZONES", description: "Manage zones" },
];

const ManagePermissions = () => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPermission, setCurrentPermission] = useState<Partial<Permission>>({});
  const [isEditing, setIsEditing] = useState(false);

  const fetchPermissions = useCallback(async () => {
    try {
      const data = await permissionService.findAll();
      // Ensure data is an array before setting
      if (Array.isArray(data)) {
        setPermissions(data);
      } else {
        console.error("Expected array but got:", data);
        setPermissions([]);
        toast({ variant: "destructive", title: "Invalid data received" });
      }
    } catch (err) {
      console.error(err);
      toast({ variant: "destructive", title: "Failed to fetch permissions" });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchPermissions();
  }, [fetchPermissions]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing && currentPermission.id) {
        await permissionService.update(currentPermission.id, currentPermission);
        toast({ title: "Permission updated" });
      } else {
        await permissionService.create(currentPermission);
        toast({ title: "Permission created" });
      }
      setIsDialogOpen(false);
      fetchPermissions();
    } catch (error) {
      toast({ variant: "destructive", title: "Operation failed" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await permissionService.remove(id);
      toast({ title: "Permission deleted" });
      fetchPermissions();
    } catch (error) {
      toast({ variant: "destructive", title: "Failed to delete" });
    }
  };

  const handleGenerateDefaults = async () => {
    if (!confirm("This will create standard permissions if they don't exist. Continue?")) return;
    try {
      let createdCount = 0;
      for (const perm of DEFAULT_PERMISSIONS) {
        const exists = permissions.some(p => p.name === perm.name);
        if (!exists) {
          await permissionService.create(perm);
          createdCount++;
        }
      }
      toast({ title: `Generated ${createdCount} new permissions` });
      fetchPermissions();
    } catch (error) {
      toast({ variant: "destructive", title: "Failed to generate defaults" });
    }
  };

  const openEdit = (permission: Permission) => {
    setCurrentPermission(permission);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const openAdd = () => {
    setCurrentPermission({});
    setIsEditing(false);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-heading font-bold text-eaten-charcoal flex items-center gap-2">
          <Shield className="w-8 h-8" /> Permissions
        </h1>
        <div className="flex gap-2">
           <Button variant="outline" onClick={handleGenerateDefaults}>
             <Wand2 className="w-4 h-4 mr-2" /> Generate Defaults
           </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={openAdd} className="bg-eaten-dark hover:bg-eaten-charcoal">
                  <Plus className="w-4 h-4 mr-2" /> Add Permission
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{isEditing ? "Edit Permission" : "Add Permission"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label>Name</Label>
                    <Input
                      value={currentPermission.name || ""}
                      onChange={(e) =>
                        setCurrentPermission({ ...currentPermission, name: e.target.value.toUpperCase().replace(/\s+/g, '_') })
                      }
                      placeholder="e.g. MANAGE_USERS"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Uppercase, distinct name for system checks.</p>
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Input
                      value={currentPermission.description || ""}
                      onChange={(e) =>
                        setCurrentPermission({ ...currentPermission, description: e.target.value })
                      }
                      placeholder="e.g. Can manage system users"
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Save
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center h-24">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                </TableCell>
              </TableRow>
            ) : !Array.isArray(permissions) || permissions.length === 0 ? (
                 <TableRow>
                <TableCell colSpan={3} className="text-center h-24 text-muted-foreground">
                  No permissions found.
                </TableCell>
              </TableRow>
            ) : (
              permissions.map((perm) => (
                <TableRow key={perm.id}>
                  <TableCell className="font-mono font-medium">{perm.name}</TableCell>
                  <TableCell>{perm.description}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEdit(perm)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDelete(perm.id)}
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

export default ManagePermissions;
