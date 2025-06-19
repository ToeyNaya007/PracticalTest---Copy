"use client";
import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin-layout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search, Lock } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Permission {
  id: number;
  name: string;
  createdAt: string;
  permission: {
    id: number;
    name: string;
  }; // Adjusted to match the structure of permissions
}

interface Role {
  id: number;
  name: string;
  createdAt: string;
  permissions: Permission[];
  _count: {
    users: number;
  };
}

export default function RolesPage() {
  const { user } = useAuth();
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]); // State for permissions
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Add state for dialog
  const [newRoleName, setNewRoleName] = useState(""); // State for new role name
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]); // Store selected permissions
  const router = useRouter();
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRolesAndPermissions = async () => {
      setIsLoading(true);
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        // Fetch roles
        const rolesResponse = await fetch(`${apiUrl}/api/roles`, { method: "GET" });
        const rolesData = await rolesResponse.json();
        setRoles(rolesData);

        // Fetch permissions
        const permissionsResponse = await fetch(`${apiUrl}/api/permissions`, { method: "GET" });
        const permissionsData = await permissionsResponse.json();
        setPermissions(permissionsData);
      } catch (err) {
        console.error("Error fetching roles or permissions:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRolesAndPermissions();
  }, []);

  const handleAddRole = async () => {
    if (!newRoleName.trim()) {
      setError("Role name cannot be empty.");
      return;
    }

    if (selectedPermissions.length === 0) {
      setError("Please select at least one permission.");
      return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${apiUrl}/api/roles`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newRoleName,
          permissions: selectedPermissions,
        }),
      });

      if (response.ok) {
        const newRole = await response.json();
        setRoles([...roles, newRole]); // Update roles list
        setNewRoleName(""); // Reset role name input
        setSelectedPermissions([]); // Reset selected permissions
        setIsDialogOpen(false); // Close the dialog
        alert("Role added successfully.");
      } else {
        alert("Failed to add role.");
      }
    } catch (err) {
      console.error("Error adding role:", err);
      alert("Error adding role.");
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Roles</h1>
            <p className="text-gray-600 mt-2">Manage roles and their permissions</p>
          </div>
          {(user?.permissions.includes('add')) && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setIsDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Role
                </Button>
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Role</DialogTitle>
                  <DialogDescription>
                    Enter the name of the new role and select permissions.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  <Label htmlFor="roleName">Role Name</Label>
                  <Input
                    id="roleName"
                    type="text"
                    value={newRoleName}
                    onChange={(e) => setNewRoleName(e.target.value)}
                    className="w-full"
                    placeholder="Enter role name"
                  />
                </div>

                <div className="space-y-4 mt-4">
                  <Label htmlFor="permissions">Permissions</Label>
                  <div className="space-y-2">
                    {permissions.map(permission => (
                      <div key={permission.id} className="flex items-center">
                        {/* Custom styled checkbox */}
                        <label className="flex items-center cursor-pointer relative">
                          <input
                            type="checkbox"
                            checked={selectedPermissions.includes(permission.id)}
                            id={`permission-${permission.id}`}
                            onChange={() => {
                              if (selectedPermissions.includes(permission.id)) {
                                setSelectedPermissions(selectedPermissions.filter(id => id !== permission.id));
                              } else {
                                setSelectedPermissions([...selectedPermissions, permission.id]);
                              }
                            }}
                            className="peer h-5 w-5 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-blue-600 checked:border-blue-600"
                          />
                          <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" strokeWidth="1">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                            </svg>
                          </span>
                        </label>
                        <label htmlFor={`permission-${permission.id}`} className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                          {permission.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                {error && <p className="text-red-500 mt-2">{error}</p>}
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddRole} className="bg-blue-600 hover:bg-blue-700">
                    Add Role
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">All Roles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-cyan-100">
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Role Name</TableHead>
                    <TableHead className="text-center">Users Count</TableHead>
                    <TableHead className="text-center">Permissions</TableHead>
                    <TableHead className="text-center">Created</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {roles.map((role) => (
                    <TableRow key={role.id}>
                      <TableCell>{role.id}</TableCell>
                      <TableCell>{role.name}</TableCell>
                      <TableCell className="text-center">{role._count.users}</TableCell>
                      <TableCell className="text-center">
                        {role.permissions.length > 0 ? (
                          <div className="flex flex-wrap gap-2 justify-center">
                            {role.permissions.map(permission => (
                              <span
                                key={permission.id}
                                className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-md"
                              >
                                {permission.permission.name}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span>No permissions</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">{formatDate(role.createdAt)}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center space-x-1">
                          <Button
                            className=""
                            variant="ghost"
                            size="sm"
                          >
                            <Lock className="h-4 w-4 text-slate-400" />
                          </Button>
                          <p className="text-slate-400">Not Authorized</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

function formatDate(isoDate: string) {
  const date = new Date(isoDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
