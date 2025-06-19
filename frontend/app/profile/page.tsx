"use client";

import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

interface Role {
    id: number;
    name: string;
}

interface User {
    id: string;
    name: string;
    email: string;
    roleId: number;
    role: Role;
    createdAt: string;
}

export default function ProfilePage() {
    const [userDetails, setUserDetails] = useState<User | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
    });
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // ดึง JWT จาก Cookie
    useEffect(() => {
        const token = Cookies.get("token");
        if (!token) {
            alert("Please log in.");
            router.push("/login");
            return;
        }

        const fetchUserDetails = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL;
                const response = await fetch(`${apiUrl}/me`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    alert("Error fetching user details");
                    router.push("/login");
                    return;
                }

                const data = await response.json();
                const user = {
                    id: data.user.userId,
                    name: data.user.name,
                    email: data.user.userEmail,
                    createdAt: data.user.createdAt || "",
                    roleId: data.user.roleId,
                    role: {
                        id: data.user.roleId,
                        name: data.user.roleName
                    },
                };
                setUserDetails(user);
                setFormData({
                    name: data.user.name,
                    email: data.user.userEmail,
                });
                setLoading(false);
            } catch (err) {
                console.error("Error fetching user details:", err);
                alert("Error fetching user details");
                router.push("/login");
            }
        };

        fetchUserDetails();
    }, [router]);

    const handleUpdateUser = async () => {
        if (!formData.name || !formData.email) {
            alert("Name and Email are required.");
            return;
        }

        try {
            const token = Cookies.get("token");
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;
            const response = await fetch(`${apiUrl}/api/users/${userDetails?.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...formData,
                    roleId: userDetails?.role.id,
                }),
            });

            if (response.ok) {
                const updatedUser = await response.json();
                setUserDetails(updatedUser.user);
                alert("Profile updated successfully");
                window.location.reload();
            } else {
                alert("Error updating profile");
            }
        } catch (err) {
            console.error("Error updating user:", err);
            alert("Error updating profile");
        }
    };

    if (loading) {
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
                        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
                        <p className="text-gray-600 mt-2">Modify your profile information.</p>
                    </div>
                </div>

                <Card className="border-0 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold text-gray-900">Profile Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Avatar className="h-16 w-16 mb-4">
                            <AvatarImage src={`/placeholder.svg?height=50&width=50`} />
                            <AvatarFallback className="bg-blue-100 text-blue-700">{userDetails?.name.charAt(0)}</AvatarFallback>
                        </Avatar>

                        <div className="flex flex-col gap-6 py-4">
                            <div className="flex flex-wrap items-center gap-2">
                                <Label htmlFor="name" className="w-full text-right font-medium">
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
                                <Label htmlFor="email" className="w-full text-right font-medium">
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
                                <Label htmlFor="role" className="w-full text-right font-medium">
                                    Role
                                </Label>
                                <Input
                                    id="role"
                                    value={userDetails?.role?.name || ""}
                                    disabled
                                    className="w-full sm:w-[50%] lg:w-[30%]"
                                    placeholder="Role"
                                />
                            </div>
                        </div>
                    </CardContent>

                    <CardFooter className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => router.push("/profile")}>
                            Cancel
                        </Button>
                        <Button onClick={handleUpdateUser} className="bg-blue-600 hover:bg-blue-700">
                            Save Changes
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </AdminLayout>
    );
}
