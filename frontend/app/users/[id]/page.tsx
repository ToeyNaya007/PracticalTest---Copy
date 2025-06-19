"use client"
import { useState, useEffect } from "react"
import { AdminLayout } from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth-provider"
import { useParams } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2Icon } from "lucide-react"
import { useRouter } from "next/navigation";

interface Role {
    id: number;
    name: string;
    createdAt: string;
}

interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    roleId: number;
    role: Role;
    status: "active" | "inactive";
    createdAt: string;
}

export default function EditUserPage() {
    const { user, isLoading } = useAuth()
    const [userDetails, setUserDetails] = useState<User | null>(null)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        role: "1"
    })
    const { id } = useParams();
    const canEdit = user?.permissions.includes('edit');
    const router = useRouter();

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL;
                const response = await fetch(`${apiUrl}/api/users/${id}`, {
                    method: "GET",
                });
                if (!response.ok) {
                    alert("ไม่พบผู้ใช้ที่ระบุ");
                    router.push("/users");
                }
                const data = await response.json();
                setUserDetails(data); // Set the data in state
                setFormData({
                    name: data.name,
                    email: data.email,
                    phone: data.phone,
                    role: data.roleId.toString()
                });
            } catch (err) {
                console.error("Error fetching user details:", err);
            }
        };

        fetchUserDetails();
    }, [id]);

    const handleUpdateUser = async () => {
        if (!canEdit) {
            alert("You don't have permission to edit users.");
            return;
        }
        if (formData.name && formData.email) {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL;
                const response = await fetch(`${apiUrl}/api/users/${userDetails?.id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                });
                if (response.ok) {
                    alert("success updating user");
                } else {
                    alert("Error updating user");
                }
            } catch (err) {
                console.error("Error updating user:", err);
            }
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
                        <h1 className="text-3xl font-bold text-gray-900">Edit User</h1>
                        <p className="text-gray-600 mt-2">Modify the details of this user.</p>
                    </div>
                </div>

                <Card className="border-0 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold text-gray-900">User Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={`/placeholder.svg?height=50&width=50`} />
                            <AvatarFallback className="bg-blue-100 text-blue-700">{user?.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col gap-6 py-4">
                            <div className="flex flex-wrap items-center gap-2">
                                <Label htmlFor="name" className="w-full  text-right font-medium">
                                    Name
                                </Label>
                                <Input
                                    id="name"
                                    value={formData.name || ""}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full sm:w-[50%] lg:w-[30%]"
                                    placeholder="Enter full name"
                                />
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                                <Label htmlFor="email" className="w-full  text-right font-medium">
                                    Email
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email || ""}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full sm:w-[50%] lg:w-[30%]"
                                    placeholder="Enter email address"
                                />
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                                <Label htmlFor="role" className="w-full  text-right font-medium">
                                    Role
                                </Label>
                                <Select
                                    value={formData.role || "1"} // Ensure default value is set to "1"
                                    onValueChange={(value) => setFormData({ ...formData, role: value })}
                                >
                                    <SelectTrigger className="w-full sm:w-[50%] lg:w-[30%]">
                                        <SelectValue placeholder="Select role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="2">User</SelectItem>
                                        <SelectItem value="1">Admin</SelectItem>
                                    </SelectContent>
                                </Select>

                            </div>
                        </div>
                        {canEdit && (
                            <CardFooter className="flex justify-end gap-3">
                                <Button variant="outline" onClick={() => { }}>
                                    Cancel
                                </Button>
                                <Button onClick={handleUpdateUser} className="bg-blue-600 hover:bg-blue-700">
                                    Save Changes
                                </Button>
                            </CardFooter>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
