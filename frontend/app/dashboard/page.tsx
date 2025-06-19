"use client";
import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, UserPlus, Activity, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import UserGrowthChart from "@/components/UserGrowthChart";

const stats = [
  {
    title: "Total Users",
    value: "2,350",
    description: "+20.1% from last month",
    icon: Users,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    title: "New Users",
    value: "+180",
    description: "+180.1% from last month",
    icon: UserPlus,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    title: "Total Admin",
    value: "1,890",
    description: "+19% from last month",
    icon: Activity,
    color: "text-orange-600",
    bgColor: "bg-orange-100",
  },
  {
    title: "Total Users",
    value: "12.5%",
    description: "+2.5% from last month",
    icon: TrendingUp,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
];

export default function DashboardPage() {
  const [dashboardStats, setDashboardStats] = useState({
    totalUsers: 0,
    newUsers: 0,
    growthRate: "0.00",
    totalAdmins: 0,
    totalUsersOnly: 0,
    adminGrowthRate: 0,
    userGrowthRate: 0
  });
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const canAdd = user?.permissions.includes('add');


  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const response = await fetch(`${apiUrl}/api/dashboard-stats`);
        const data = await response.json();
        setDashboardStats(data);
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
      }
    };

    const fetchRecentUsers = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const response = await fetch(`${apiUrl}/api/dashboard-LastCreatedUsers`);
        const data = await response.json();
        setRecentUsers(data);
      } catch (err) {
        console.error("Error fetching recent users:", err);
      }
    };

    fetchRecentUsers();
    fetchDashboardStats();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back! Here's what’s happening with your users today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-0 shadow-sm hover:-translate-y-2 transition-transform duration-300 ease-in-out">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{stats[0].title}</CardTitle>
              <div className={`p-2 rounded-lg ${stats[0].bgColor}`}>
                {React.createElement(stats[0].icon, { className: `h-4 w-4 ${stats[0].color}` })}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{dashboardStats.totalUsers}</div>
              <p className="text-xs text-gray-600 mt-1">+{dashboardStats.growthRate}% from last month</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm hover:-translate-y-2 transition-transform duration-300 ease-in-out">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{stats[1].title}</CardTitle>
              <div className={`p-2 rounded-lg ${stats[1].bgColor}`}>
                {React.createElement(stats[1].icon, { className: `h-4 w-4 ${stats[1].color}` })}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{dashboardStats.newUsers}</div>
              <p className="text-xs text-gray-600 mt-1">+{dashboardStats.growthRate}% from last month</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm hover:-translate-y-2 transition-transform duration-300 ease-in-out">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{stats[2].title}</CardTitle>
              <div className={`p-2 rounded-lg ${stats[2].bgColor}`}>
                {React.createElement(stats[2].icon, { className: `h-4 w-4 ${stats[2].color}` })}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{dashboardStats.totalAdmins}</div>
              <p className="text-xs text-gray-600 mt-1">+{dashboardStats.adminGrowthRate}% from last month</p>

            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm hover:-translate-y-2 transition-transform duration-300 ease-in-out">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{stats[3].title}</CardTitle>
              <div className={`p-2 rounded-lg ${stats[3].bgColor}`}>
                {React.createElement(stats[3].icon, { className: `h-4 w-4 ${stats[3].color}` })}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{dashboardStats.totalUsersOnly}</div>
              <p className="text-xs text-gray-600 mt-1">+{dashboardStats.userGrowthRate}% from last month</p>
            </CardContent>
          </Card>
        </div>


        {/* Recent Activity */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-0 shadow-sm">
            <CardHeader className="flex justify-between">
              <div>
                <CardTitle className="text-lg font-semibold text-gray-900">Last User Created</CardTitle>
                <p className="text-sm text-gray-600">Latest user activities in the system</p>
              </div>
              {canAdd && (
                <Button
                  variant="outline"
                  className="text-gray-600 hover:bg-gray-50 hover:cursor-pointer"
                  onClick={() => router.push("/users/add")}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentUsers.length > 0 ? (
                  recentUsers.map((user: any, index: number) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-600">{user.email}</p>
                      </div>
                      <span className="text-xs text-gray-500">{new Date(user.createdAt).toLocaleString()}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600">No recent users found.</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">User Growth</CardTitle>
              <CardDescription>Growth of users over the past few months</CardDescription>
            </CardHeader>
            <CardContent>
              <UserGrowthChart />
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
