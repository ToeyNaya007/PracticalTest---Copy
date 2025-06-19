"use client";
import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/components/auth-provider";
import { useRouter } from "next/navigation";

interface Role {
  id: number;
  name: string;
  createdAt: string;
}

export default function AddUserPage() {
  const { user, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "1",
  });
  const [error, setError] = useState("");
  const [roles, setRoles] = useState<Role[]>([]);
  const router = useRouter();
  const { permissions } = useAuth().user || {};

  // Fetch roles from API
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const response = await fetch(`${apiUrl}/api/roles`);
        const rolesData = await response.json();
        setRoles(rolesData); // Store roles in state
      } catch (err) {
        console.error("Error fetching roles:", err);
      }
    };

    fetchRoles();
  }, []);

  const handleAddUser = async () => {
    if (!permissions || !permissions.includes('add')) {
      alert("You don't have permission to add users.");
      return;
    }

    // Validate form fields
    if (!formData.name || !formData.email || !formData.password) {
      setError("Please fill in all fields.");
      return;
    }

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${apiUrl}/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          roleId: parseInt(formData.role), // Ensure role is sent as number
        }),
      });

      if (response.ok) {
        alert("User added successfully");
        router.push(`/users`);
        setFormData({ name: "", email: "", password: "", role: "1" });
        setError("");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to add user");
      }
    } catch (err) {
      console.error("Error adding user:", err);
      alert("Error adding user");
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
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Add User</h1>
            <p className="text-gray-600 mt-2">Add a new user to the system.</p>
          </div>
        </div>

        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">User Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-6 py-4">
              {error && <div className="text-red-500">{error}</div>}

              <div className="flex flex-wrap items-center gap-2">
                <Label htmlFor="name" className="w-full text-right font-medium">
                  Name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full sm:w-[50%] lg:w-[30%]"
                  placeholder="Enter full name"
                  required
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Label htmlFor="email" className="w-full text-right font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full sm:w-[50%] lg:w-[30%]"
                  placeholder="Enter email address"
                  required
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Label htmlFor="password" className="w-full text-right font-medium">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full sm:w-[50%] lg:w-[30%]"
                  placeholder="Enter password"
                  required
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Label htmlFor="role" className="w-full text-right font-medium">
                  Role
                </Label>
                <div className="w-full sm:w-[50%] lg:w-[30%]">
                  <Select
                    value={formData.role}
                    onValueChange={(value) => setFormData({ ...formData, role: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.id} value={role.id.toString()}>
                          {role.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {permissions?.includes("add") && (
              <CardFooter className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => { }}>
                  Cancel
                </Button>
                <Button onClick={handleAddUser} className="bg-blue-600 hover:bg-blue-700">
                  Add User
                </Button>
              </CardFooter>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
