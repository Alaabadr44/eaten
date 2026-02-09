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
import { Plus, Pencil, Trash2, Loader2, Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { adminService } from "../../services/adminService";
import { permissionService } from "../../services/permissionService";
import { Checkbox } from "@/components/ui/checkbox";

interface Permission {
  id: string;
  name: string;
}

interface AdminUser {
  id: string;
  email: string;
  permissions: Permission[];
  createdAt: string;
}

const ManageUsers = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<Partial<AdminUser> & { password?: string, permissionIds?: string[] }>({});
  const [isEditing, setIsEditing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [usersData, permissionsData] = await Promise.all([
        adminService.findAll(),
        permissionService.findAll()
      ]);
      setUsers(usersData);
      setAllPermissions(permissionsData);
    } catch (err) {
      toast({ variant: "destructive", title: "Failed to fetch data" });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
          email: currentUser.email,
          ...(currentUser.password ? { password: currentUser.password } : {}),
          permissionIds: currentUser.permissionIds
      };

      if (isEditing && currentUser.id) {
        await adminService.update(currentUser.id, payload);
        toast({ title: "User updated" });
      } else {
        await adminService.create(payload);
        toast({ title: "User created" });
      }
      setIsDialogOpen(false);
      fetchData();
    } catch (error) {
      toast({ variant: "destructive", title: "Operation failed" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await adminService.remove(id);
      toast({ title: "User deleted" });
      fetchData();
    } catch (error) {
      toast({ variant: "destructive", title: "Failed to delete" });
    }
  };

  const openEdit = (user: AdminUser) => {
    setCurrentUser({
        ...user,
        permissionIds: user.permissions.map(p => p.id),
        password: "" // Don't show hash, allow empty to keep current
    });
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const openAdd = () => {
    setCurrentUser({ permissionIds: [] });
    setIsEditing(false);
    setIsDialogOpen(true);
  };

  const togglePermission = (permissionId: string) => {
      const currentIds = currentUser.permissionIds || [];
      if (currentIds.includes(permissionId)) {
          setCurrentUser({ ...currentUser, permissionIds: currentIds.filter(id => id !== permissionId) });
      } else {
          setCurrentUser({ ...currentUser, permissionIds: [...currentIds, permissionId] });
      }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-heading font-bold text-eaten-charcoal flex items-center gap-2">
          <Users className="w-8 h-8" /> Admin Users
        </h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAdd} className="bg-eaten-dark hover:bg-eaten-charcoal">
              <Plus className="w-4 h-4 mr-2" /> Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>{isEditing ? "Edit User" : "Add User"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={currentUser.email || ""}
                  onChange={(e) =>
                    setCurrentUser({ ...currentUser, email: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label>Password {isEditing && "(Leave empty to keep current)"}</Label>
                <Input
                  type="password"
                  value={currentUser.password || ""}
                  onChange={(e) =>
                    setCurrentUser({ ...currentUser, password: e.target.value })
                  }
                  required={!isEditing}
                  minLength={6}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Permissions</Label>
                <div className="grid grid-cols-2 gap-2 border p-3 rounded-md max-h-48 overflow-y-auto">
                    {allPermissions.map(perm => (
                        <div key={perm.id} className="flex items-center space-x-2">
                            <Checkbox 
                                id={`perm-${perm.id}`} 
                                checked={(currentUser.permissionIds || []).includes(perm.id)}
                                onCheckedChange={() => togglePermission(perm.id)}
                            />
                            <Label htmlFor={`perm-${perm.id}`} className="cursor-pointer text-sm font-normal">
                                {perm.name}
                            </Label>
                        </div>
                    ))}
                    {allPermissions.length === 0 && <span className="text-sm text-gray-500">No permissions available.</span>}
                </div>
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
              <TableHead>Email</TableHead>
              <TableHead>Permissions</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center h-24">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
                 <TableRow>
                <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.email}</TableCell>
                  <TableCell>
                      <div className="flex flex-wrap gap-1">
                          {user.permissions.length > 0 ? user.permissions.map(p => (
                              <span key={p.id} className="text-xs bg-gray-100 px-2 py-1 rounded border">
                                  {p.name}
                              </span>
                          )) : <span className="text-xs text-gray-400">None</span>}
                      </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEdit(user)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDelete(user.id)}
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

export default ManageUsers;
