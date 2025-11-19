import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  Heart,
  UserPlus,
  Activity,
  TrendingUp,
  Calendar,
  MapPin,
  Filter,
} from "lucide-react";
import { DUMMY_DONORS } from "@/data/users";
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

export default function AdminDashboard() {
  const [dateFilter, setDateFilter] = useState("month");

  const totalDonors = DUMMY_DONORS.length;
  const activeDonors = DUMMY_DONORS.filter((d) => {
    const lastDonation = d.lastDonation;
    return (
      lastDonation.includes("week") ||
      (lastDonation.includes("month") && parseInt(lastDonation) <= 3)
    );
  }).length;
  const newThisMonth = DUMMY_DONORS.filter(
    (d) => d.lastDonation.includes("week") || d.lastDonation.includes("month")
  ).length;
  const totalDonations = DUMMY_DONORS.reduce((sum, d) => sum + d.donations, 0);

  const stats = [
    {
      title: "Total Donors",
      value: totalDonors.toString(),
      change: "+5",
      icon: Heart,
      color: "text-red-600",
      bgColor: "bg-red-100 dark:bg-red-900/30",
    },
    {
      title: "Active Donors",
      value: activeDonors.toString(),
      change: `+${activeDonors}`,
      icon: Users,
      color: "text-pink-600",
      bgColor: "bg-pink-100 dark:bg-pink-900/30",
    },
    {
      title: "New This Month",
      value: newThisMonth.toString(),
      change: `+${newThisMonth}`,
      icon: UserPlus,
      color: "text-red-500",
      bgColor: "bg-red-100 dark:bg-red-900/30",
    },
    {
      title: "Total Donations",
      value: totalDonations.toString(),
      change: "+45",
      icon: Activity,
      color: "text-pink-500",
      bgColor: "bg-pink-100 dark:bg-pink-900/30",
    },
  ];

  const donationData = [
    { week: "Week 1", donations: 120, newDonors: 18 },
    { week: "Week 2", donations: 145, newDonors: 22 },
    { week: "Week 3", donations: 138, newDonors: 20 },
    { week: "Week 4", donations: 165, newDonors: 25 },
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

  // Get recent donations from dummy data
  const recentDonations = DUMMY_DONORS.sort((a, b) => {
    const aDays = a.lastDonation.includes("week")
      ? 7
      : a.lastDonation.includes("month")
      ? parseInt(a.lastDonation) * 30
      : 0;
    const bDays = b.lastDonation.includes("week")
      ? 7
      : b.lastDonation.includes("month")
      ? parseInt(b.lastDonation) * 30
      : 0;
    return aDays - bDays;
  })
    .slice(0, 5)
    .map((donor, index) => ({
      id: donor.id,
      donor: donor.name,
      bloodGroup: donor.bloodGroup,
      date: donor.lastDonation,
      location: donor.city,
    }));

  const monthlyTrend = [
    { month: "Jan", donations: 180, donors: 45 },
    { month: "Feb", donations: 210, donors: 52 },
    { month: "Mar", donations: 195, donors: 48 },
    { month: "Apr", donations: 240, donors: 60 },
    { month: "May", donations: 225, donors: 56 },
    { month: "Jun", donations: 280, donors: 70 },
  ];

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-red-900 dark:text-red-100 mb-2">
            Admin Dashboard
          </h2>
          <p className="text-red-700 dark:text-red-300 text-sm md:text-base">
            Manage donors and monitor donation activities
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
              Monthly Trends
            </h3>
            <Filter className="w-4 h-4 text-red-600" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyTrend}>
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
              <Bar
                dataKey="donations"
                fill="#ef4444"
                name="Donations"
                radius={[8, 8, 0, 0]}
              />
              <Bar
                dataKey="donors"
                fill="#ec4899"
                name="New Donors"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
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
            <Activity className="w-5 h-5 text-red-600" />
            Weekly Donation Activity
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={donationData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#fecdd3" />
              <XAxis dataKey="week" stroke="#991b1b" />
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
                dataKey="newDonors"
                stroke="#ec4899"
                strokeWidth={2}
                name="New Donors"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-4 md:p-6 bg-white/80 dark:bg-red-950/50 backdrop-blur-sm border-red-200 dark:border-red-900">
          <h3 className="text-lg md:text-xl font-semibold text-red-900 dark:text-red-100 mb-4">
            Recent Donations
          </h3>
          <div className="space-y-3 max-h-[250px] overflow-y-auto">
            {recentDonations.map((donation) => (
              <div
                key={donation.id}
                className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/30 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                  {donation.donor.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-red-900 dark:text-red-100">
                    {donation.donor}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-red-600 dark:text-red-400 font-medium">
                      {donation.bloodGroup}
                    </span>
                    <span className="text-xs text-red-500 dark:text-red-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {donation.location}
                    </span>
                  </div>
                  <p className="text-xs text-red-500 dark:text-red-500 mt-1">
                    {donation.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4 md:p-6 bg-gradient-to-br from-red-500 to-pink-500 text-white">
          <UserPlus className="w-8 h-8 mb-3" />
          <h3 className="text-lg font-semibold mb-2">Add New User</h3>
          <p className="text-sm opacity-90 mb-4">
            Register new donors to the platform
          </p>
          <Button className="bg-white text-red-600 hover:bg-red-50 w-full">
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
