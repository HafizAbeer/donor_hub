import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Users,
  Shield,
  UserPlus,
  Heart,
  TrendingUp,
  Calendar,
  MapPin,
  Filter,
} from "lucide-react";
import { DUMMY_DONORS, DUMMY_ADMINS } from "@/data/users";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#ef4444",
  "#F97316",
  "#EAB308",
  "#22C55E",
  "#3B82F6",
  "#8B5CF6",
  "#EC4899",
  "#6B7280",
];

export default function SuperAdminDashboard() {
  const [dateFilter, setDateFilter] = useState("month");

  // Calculate stats from dummy data
  const totalUsers = DUMMY_DONORS.length + DUMMY_ADMINS.length + 1; // +1 for superadmin
  const totalAdmins = DUMMY_ADMINS.length + 1; // +1 for superadmin
  const activeDonors = DUMMY_DONORS.filter((d) => {
    const lastDonation = d.lastDonation;
    return (
      lastDonation.includes("week") ||
      (lastDonation.includes("month") && parseInt(lastDonation) <= 3)
    );
  }).length;
  const totalDonations = DUMMY_DONORS.reduce((sum, d) => sum + d.donations, 0);

  const stats = [
    {
      title: "Total Users",
      value: totalUsers.toString(),
      change: "+5",
      icon: Users,
      color: "text-red-600",
      bgColor: "bg-red-100 dark:bg-red-900/30",
    },
    {
      title: "Admins",
      value: totalAdmins.toString(),
      change: "+2",
      icon: Shield,
      color: "text-pink-600",
      bgColor: "bg-pink-100 dark:bg-pink-900/30",
    },
    {
      title: "Active Donors",
      value: activeDonors.toString(),
      change: `+${activeDonors}`,
      icon: Heart,
      color: "text-red-500",
      bgColor: "bg-red-100 dark:bg-red-900/30",
    },
    {
      title: "Total Donations",
      value: totalDonations.toString(),
      change: "+45",
      icon: TrendingUp,
      color: "text-pink-500",
      bgColor: "bg-pink-100 dark:bg-pink-900/30",
    },
  ];

  const donationData = [
    { month: "Jan", donations: 450, users: 120 },
    { month: "Feb", donations: 520, users: 145 },
    { month: "Mar", donations: 480, users: 135 },
    { month: "Apr", donations: 610, users: 168 },
    { month: "May", donations: 580, users: 152 },
    { month: "Jun", donations: 690, users: 189 },
  ];

  // Calculate blood group distribution from dummy data
  const bloodGroupCounts = DUMMY_DONORS.reduce((acc, donor) => {
    acc[donor.bloodGroup] = (acc[donor.bloodGroup] || 0) + 1;
    return acc;
  }, {});

  const bloodGroupData = Object.entries(bloodGroupCounts).map(
    ([name, value]) => ({
      name,
      value,
      color:
        COLORS[Object.keys(bloodGroupCounts).indexOf(name) % COLORS.length],
    })
  );

  // Calculate city data from dummy data
  const cityCounts = DUMMY_DONORS.reduce((acc, donor) => {
    if (!acc[donor.city]) {
      acc[donor.city] = { donors: 0, donations: 0 };
    }
    acc[donor.city].donors += 1;
    acc[donor.city].donations += donor.donations;
    return acc;
  }, {});

  const cityData = Object.entries(cityCounts)
    .map(([city, data]) => ({ city, ...data }))
    .sort((a, b) => b.donors - a.donors)
    .slice(0, 5);

  const recentActivities = [
    {
      id: 1,
      action: "New admin created",
      user: "admin@example.com",
      time: "2 hours ago",
      type: "admin",
    },
    {
      id: 2,
      action: "User registered",
      user: "donor@example.com",
      time: "3 hours ago",
      type: "user",
    },
    {
      id: 3,
      action: "Blood donation recorded",
      user: "John Doe",
      time: "5 hours ago",
      type: "donation",
    },
    {
      id: 4,
      action: "Admin updated profile",
      user: "admin2@example.com",
      time: "1 day ago",
      type: "admin",
    },
    {
      id: 5,
      action: "Bulk users imported",
      user: "System",
      time: "2 days ago",
      type: "system",
    },
  ];

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-red-900 dark:text-red-100 mb-2">
            Super Admin Dashboard
          </h2>
          <p className="text-red-700 dark:text-red-300 text-sm md:text-base">
            Manage admins, users, and monitor the entire platform
          </p>
        </div>
        <div className="flex gap-2">
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-3 py-2 bg-white dark:bg-red-900/50 border border-red-300 dark:border-red-800 rounded-md text-red-900 dark:text-red-100 text-sm focus:border-red-500 focus:ring-red-500 focus:outline-none"
          >
            <option value="week">Last Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className="p-4 md:p-6 bg-white/80 dark:bg-red-950/50 backdrop-blur-sm border-red-200 dark:border-red-900 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-5 h-5 md:w-6 md:h-6 ${stat.color}`} />
              </div>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                {stat.change}
              </span>
            </div>
            <div>
              <p className="text-xs md:text-sm text-red-700 dark:text-red-400 mb-1">
                {stat.title}
              </p>
              <p className="text-xl md:text-2xl font-bold text-red-900 dark:text-red-100">
                {stat.value}
              </p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <Card className="p-4 md:p-6 bg-white/80 dark:bg-red-950/50 backdrop-blur-sm border-red-200 dark:border-red-900">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg md:text-xl font-semibold text-red-900 dark:text-red-100">
              Donation Trends
            </h3>
            <Filter className="w-4 h-4 text-red-600" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={donationData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#fecdd3" />
              <XAxis dataKey="month" stroke="#991b1b" />
              <YAxis stroke="#991b1b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #fecdd3",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="donations"
                stroke="#ef4444"
                strokeWidth={2}
                name="Donations"
              />
              <Line
                type="monotone"
                dataKey="users"
                stroke="#ec4899"
                strokeWidth={2}
                name="New Users"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-4 md:p-6 bg-white/80 dark:bg-red-950/50 backdrop-blur-sm border-red-200 dark:border-red-900">
          <h3 className="text-lg md:text-xl font-semibold text-red-900 dark:text-red-100 mb-4">
            Blood Group Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={bloodGroupData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {bloodGroupData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #fecdd3",
                  borderRadius: "8px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <Card className="p-4 md:p-6 bg-white/80 dark:bg-red-950/50 backdrop-blur-sm border-red-200 dark:border-red-900">
          <h3 className="text-lg md:text-xl font-semibold text-red-900 dark:text-red-100 mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-red-600" />
            Top Cities
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={cityData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#fecdd3" />
              <XAxis type="number" stroke="#991b1b" />
              <YAxis
                dataKey="city"
                type="category"
                width={80}
                stroke="#991b1b"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #fecdd3",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Bar
                dataKey="donors"
                fill="#ef4444"
                name="Donors"
                radius={[0, 8, 8, 0]}
              />
              <Bar
                dataKey="donations"
                fill="#ec4899"
                name="Donations"
                radius={[0, 8, 8, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-4 md:p-6 bg-white/80 dark:bg-red-950/50 backdrop-blur-sm border-red-200 dark:border-red-900">
          <h3 className="text-lg md:text-xl font-semibold text-red-900 dark:text-red-100 mb-4">
            Recent Activities
          </h3>
          <div className="space-y-3 max-h-[300px] overflow-y-auto">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-900/30 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
              >
                <div
                  className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === "admin"
                      ? "bg-pink-500"
                      : activity.type === "donation"
                      ? "bg-red-500"
                      : "bg-red-400"
                  }`}
                ></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-red-900 dark:text-red-100">
                    {activity.action}
                  </p>
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                    {activity.user}
                  </p>
                  <p className="text-xs text-red-500 dark:text-red-500 mt-1">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 md:p-6 bg-gradient-to-br from-red-500 to-pink-500 text-white">
          <UserPlus className="w-8 h-8 mb-3" />
          <h3 className="text-lg font-semibold mb-2">Create Admin</h3>
          <p className="text-sm opacity-90 mb-4">
            Add new admin accounts to manage the platform
          </p>
          <Button className="bg-white text-red-600 hover:bg-red-50 w-full">
            Create Now
          </Button>
        </Card>

        <Card className="p-4 md:p-6 bg-white/80 dark:bg-red-950/50 backdrop-blur-sm border-red-200 dark:border-red-900">
          <UserPlus className="w-8 h-8 text-red-600 mb-3" />
          <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-2">
            Add User
          </h3>
          <p className="text-sm text-red-700 dark:text-red-300 mb-4">
            Register new donors to the platform
          </p>
          <Button
            variant="outline"
            className="w-full border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/50"
          >
            Add User
          </Button>
        </Card>

        <Card className="p-4 md:p-6 bg-white/80 dark:bg-red-950/50 backdrop-blur-sm border-red-200 dark:border-red-900">
          <Users className="w-8 h-8 text-red-600 mb-3" />
          <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-2">
            View All Donors
          </h3>
          <p className="text-sm text-red-700 dark:text-red-300 mb-4">
            Browse and manage all registered donors
          </p>
          <Button
            variant="outline"
            className="w-full border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/50"
          >
            View Donors
          </Button>
        </Card>
      </div>
    </div>
  );
}
