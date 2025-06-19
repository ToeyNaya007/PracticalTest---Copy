"use client";

import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Search, Edit, Trash2, Mail, Phone, AlertCircle, Lock, Download } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { useRouter } from "next/navigation";
import { DeleteUserConfirmation } from "@/components/ui/DeleteUserConfirmation";

const exportToCSV = (users: any[]) => {
  const headers = ["ID", "FullName", "Email", "Role", "Created"];
  const rows = users.map((user) => [
    user.id,
    user.name,
    user.email,
    user.role.name,
    user.createdAt,
  ]);
  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "users_data.csv"; // ชื่อไฟล์ CSV
  link.click();
};

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
  role: Role; // role เป็น object
  status: "active" | "inactive";
  createdAt: string;
}

export default function UsersPage() {
  const { user, isLoading } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // หน้าปัจจุบัน
  const [totalPages, setTotalPages] = useState(1); // จำนวนหน้าทั้งหมด
  const [totalItems, setTotalItems] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const router = useRouter();
  const { permissions } = useAuth().user || {};

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const response = await fetch(`${apiUrl}/api/users?page=${currentPage}&limit=${itemsPerPage}`, {
          method: "GET",
        });
        const data = await response.json();
        setUsers(data.data); // นำข้อมูลผู้ใช้มาเก็บใน state
        setTotalPages(data.totalPages); // กำหนดจำนวนหน้าทั้งหมด
        setTotalItems(data.total);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    fetchUsers();
  }, [currentPage, itemsPerPage]);

  const filteredUsers = users && users.length > 0 ? users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Users</h1>
            <p className="text-gray-600 mt-2">Manage your system users and their permissions</p>
          </div>
          {/* ปุ่ม Add User */}
          {(permissions?.includes("add")) && (
            <Button
              className="bg-blue-600 hover:bg-blue-700 hover:cursor-pointer"
              onClick={() => router.push(`/users/add`)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          )}
        </div>

        <Card className="border-0 shadow-sm">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle className="text-lg font-semibold text-gray-900">All Users ({totalItems})</CardTitle>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full sm:w-80"
                  />
                </div>
                <Button
                  variant="outline"
                  className="text-gray-600 hover:bg-gray-50 hover:cursor-pointer"
                  onClick={() => exportToCSV(filteredUsers)}
                >
                  <Download className="h-4 w-4" />
                  EXPORT CSV
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-cyan-100">
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>FullName</TableHead>
                    <TableHead className="hidden sm:table-cell">Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="hidden md:table-cell text-center">Created</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((tableUser) => (
                    <TableRow key={tableUser.id}>
                      <TableCell>{tableUser.id}</TableCell>
                      <TableCell>{tableUser.name}</TableCell>
                      <TableCell className="hidden sm:table-cell">{tableUser.email}</TableCell>
                      <TableCell>
                        <Badge
                          variant={tableUser.role.name === "admin" ? "default" : "secondary"}
                          className={
                            tableUser.role.name === "admin"
                              ? "bg-blue-100 text-blue-800"
                              : tableUser.role.name === "moderator"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-gray-100 text-gray-800"
                          }
                        >
                          {tableUser.role.name}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-center">{formatDate(tableUser.createdAt)}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => router.push(`/users/${tableUser.id}`)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <DeleteUserConfirmation
                            userId={tableUser.id}
                            onDelete={() => { /* handle delete */ }}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-y-2 items-center justify-between">
            <div className="flex items-center space-x-4">
              <Label htmlFor="itemsPerPage" className="text-right">
                Showing
              </Label>
              <Select
                value={String(itemsPerPage)}
                onValueChange={(value) => setItemsPerPage(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select items per page" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-3">
              <div className="mt-1">
                Page {currentPage} of {totalPages}
              </div>
              <Button
                variant="outline"
                onClick={() => setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>

              <Button
                variant="outline"
                onClick={() => setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </CardFooter>
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

