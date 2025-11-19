import React, { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Users,
  Search,
  Droplet,
  Phone,
  Mail,
  MapPin,
  Filter,
  Download,
  BarChart3,
  Edit2,
  Trash2,
  Clock,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { DUMMY_DONORS } from "@/data/users";
import {
  BarChart,
  Bar,
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

const MS_IN_DAY = 1000 * 60 * 60 * 24;
const DAYS_UNAVAILABLE = 90;

const safeISODate = (value) => {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }
  return parsed.toISOString();
};

const evaluateAvailability = (isoDate) => {
  if (!isoDate) {
    return { isAvailable: true, daysSince: Infinity };
  }
  const diffMs = Date.now() - new Date(isoDate).getTime();
  const diffDays = Math.max(0, Math.floor(diffMs / MS_IN_DAY));
  return {
    isAvailable: diffDays >= DAYS_UNAVAILABLE,
    daysSince: diffDays,
  };
};

const formatRelativeDonation = (isoDate) => {
  if (!isoDate) return "No donation yet";

  const diffMs = Date.now() - new Date(isoDate).getTime();
  const diffDays = Math.max(0, Math.floor(diffMs / MS_IN_DAY));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "1 day ago";
  if (diffDays < 30) return `${diffDays} days ago`;

  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) {
    return `${diffMonths} month${diffMonths > 1 ? "s" : ""} ago`;
  }

  const diffYears = Math.floor(diffMonths / 12);
  return `${diffYears} year${diffYears > 1 ? "s" : ""} ago`;
};

const enrichDonorRecord = (donor) => {
  const isoDate = safeISODate(donor.lastDonationDate);
  const { isAvailable, daysSince } = evaluateAvailability(isoDate);
  return {
    ...donor,
    lastDonationDate: isoDate,
    lastDonationDisplay: formatRelativeDonation(isoDate),
    isAvailable,
    availabilityLabel: isAvailable ? "Available" : "Not Available",
    daysSinceDonation: daysSince,
    hostelite: Boolean(donor.hostelite),
  };
};

export default function DonorsList() {
  const { isUser, isAdmin, isSuperAdmin } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBloodGroup, setFilterBloodGroup] = useState("");
  const [filterCity, setFilterCity] = useState("");
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [donors, setDonors] = useState(() =>
    DUMMY_DONORS.map((donor) => enrichDonorRecord(donor))
  );

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const cities = useMemo(
    () => [...new Set(donors.map((d) => d.city))].sort(),
    [donors]
  );

  const restrictToAvailable = showAvailableOnly || Boolean(filterBloodGroup);

  const filteredDonors = donors.filter((donor) => {
    const matchesSearch =
      donor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donor.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donor.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBloodGroup =
      !filterBloodGroup || donor.bloodGroup === filterBloodGroup;
    const matchesCity = !filterCity || donor.city === filterCity;
    const matchesAvailability =
      !restrictToAvailable || (restrictToAvailable && donor.isAvailable);

    return (
      matchesSearch && matchesBloodGroup && matchesCity && matchesAvailability
    );
  });

  // Chart data
  const bloodGroupStats = useMemo(
    () =>
      bloodGroups
        .map((bg) => ({
          name: bg,
          value: donors.filter((d) => d.bloodGroup === bg).length,
        }))
        .filter((item) => item.value > 0),
    [bloodGroups, donors]
  );

  const cityStats = useMemo(
    () =>
      cities.map((city) => ({
        city: city,
        donors: donors.filter((d) => d.city === city).length,
      })),
    [cities, donors]
  );

  const handleToggleAvailabilityFilter = () => {
    setShowAvailableOnly((prev) => !prev);
  };

  const handleEditDonor = (donor) => {
    const updatedPhone = window.prompt(
      `Update phone number for ${donor.name}`,
      donor.phone
    );
    if (updatedPhone === null) return;

    const updatedCity = window.prompt(
      `Update city for ${donor.name}`,
      donor.city
    );
    if (updatedCity === null) return;

    setDonors((prev) =>
      prev.map((item) =>
        item.id === donor.id
          ? enrichDonorRecord({
              ...item,
              phone: updatedPhone.trim() || item.phone,
              city: updatedCity.trim() || item.city,
            })
          : item
      )
    );
  };

  const handleDeleteDonor = (donorId) => {
    const shouldDelete = window.confirm("Delete this donor record?");
    if (!shouldDelete) return;
    setDonors((prev) => prev.filter((donor) => donor.id !== donorId));
  };

  const handleMarkDonatedToday = (donorId) => {
    const todayISO = new Date().toISOString();
    setDonors((prev) =>
      prev.map((donor) =>
        donor.id === donorId
          ? enrichDonorRecord({
              ...donor,
              lastDonationDate: todayISO,
            })
          : donor
      )
    );
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-red-900 dark:text-red-100 mb-2 flex items-center gap-2">
            <Users className="w-6 h-6 md:w-8 md:h-8 text-red-600" />
            {isUser ? "Find Donors" : "All Donors"}
          </h2>
          <p className="text-red-700 dark:text-red-300 text-sm md:text-base">
            {isUser
              ? "Search and connect with available donors"
              : "Manage and view all registered donors"}
          </p>
        </div>
        {!isUser && (
          <Button
            variant="outline"
            className="border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/50"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        )}
      </div>

      {!isUser && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <Card className="p-4 md:p-6 bg-white/80 dark:bg-red-950/50 backdrop-blur-sm border-red-200 dark:border-red-900">
            <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-red-600" />
              Blood Group Distribution
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={bloodGroupStats}
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
                  {bloodGroupStats.map((entry, index) => (
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

          <Card className="p-4 md:p-6 bg-white/80 dark:bg-red-950/50 backdrop-blur-sm border-red-200 dark:border-red-900">
            <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-red-600" />
              Donors by City
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={cityStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#fecdd3" />
                <XAxis dataKey="city" stroke="#991b1b" />
                <YAxis stroke="#991b1b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #fecdd3",
                    borderRadius: "8px",
                  }}
                />
                <Bar
                  dataKey="donors"
                  fill="#ef4444"
                  radius={[8, 8, 0, 0]}
                  name="Donors"
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}

      <Card className="p-4 md:p-6 bg-white/80 dark:bg-red-950/50 backdrop-blur-sm border-red-200 dark:border-red-900">
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-600 w-4 h-4 md:w-5 md:h-5" />
            <Input
              type="text"
              placeholder="Search by name, email, or city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 md:pl-10 bg-white dark:bg-red-900/30 border-red-300 dark:border-red-800 text-red-900 dark:text-red-100 focus:border-red-500 focus:ring-red-500"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Droplet className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-600 w-4 h-4" />
              <select
                value={filterBloodGroup}
                onChange={(e) => setFilterBloodGroup(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white dark:bg-red-900/30 border border-red-300 dark:border-red-800 rounded-md text-red-900 dark:text-red-100 text-sm focus:border-red-500 focus:ring-red-500 focus:outline-none"
              >
                <option value="">All Blood Groups</option>
                {bloodGroups.map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-600 w-4 h-4" />
              <select
                value={filterCity}
                onChange={(e) => setFilterCity(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white dark:bg-red-900/30 border border-red-300 dark:border-red-800 rounded-md text-red-900 dark:text-red-100 text-sm focus:border-red-500 focus:ring-red-500 focus:outline-none"
              >
                <option value="">All Cities</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
            <label className="flex items-center gap-2 text-sm text-red-700 dark:text-red-300">
              <input
                type="checkbox"
                checked={showAvailableOnly}
                onChange={handleToggleAvailabilityFilter}
                className="h-4 w-4 accent-red-600"
              />
              Show available only
            </label>
            {(filterBloodGroup || filterCity || searchTerm) && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setFilterBloodGroup("");
                  setFilterCity("");
                  setShowAvailableOnly(false);
                }}
                className="border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/50"
              >
                <Filter className="w-4 h-4 mr-2" />
                Clear
              </Button>
            )}
          </div>
        </div>

        <div className="mb-4 text-sm text-red-700 dark:text-red-300">
          Showing <span className="font-semibold">{filteredDonors.length}</span>{" "}
          of <span className="font-semibold">{donors.length}</span> donors
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDonors.map((donor) => (
            <Card
              key={donor.id}
              className="p-4 md:p-5 bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-900 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-3 gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-base md:text-lg font-semibold text-red-900 dark:text-red-100 truncate">
                    {donor.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <Droplet className="w-4 h-4 text-red-600 shrink-0" />
                    <span className="text-red-700 dark:text-red-300 font-medium">
                      {donor.bloodGroup}
                    </span>
                    {!isUser && (
                      <span className="text-xs text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/50 px-2 py-1 rounded">
                        {donor.donations} donations
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      donor.hostelite
                        ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200"
                        : "bg-slate-100 text-slate-700 dark:bg-slate-900/40 dark:text-slate-200"
                    }`}
                  >
                    {donor.hostelite ? "Hostelite" : "Non-Hostelite"}
                  </span>
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      donor.isAvailable
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200"
                        : "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-200"
                    }`}
                  >
                    {donor.availabilityLabel}
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
                  <Mail className="w-4 h-4 shrink-0" />
                  <span className="truncate">{donor.email}</span>
                </div>
                <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
                  <Phone className="w-4 h-4 shrink-0" />
                  <span>{donor.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
                  <MapPin className="w-4 h-4 shrink-0" />
                  <span>{donor.city}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-red-200 dark:border-red-800">
                <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                  <Clock className="w-4 h-4 shrink-0" />
                  Last donation: {donor.lastDonationDisplay}
                </p>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {(isAdmin || isSuperAdmin) && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditDonor(donor)}
                      className="border-red-300 dark:border-red-800 text-red-700 dark:text-red-200"
                    >
                      <Edit2 className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteDonor(donor.id)}
                      className="border-red-300 dark:border-red-800 text-red-700 dark:text-red-200"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </>
                )}
                <Button
                  size="sm"
                  onClick={() => handleMarkDonatedToday(donor.id)}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Mark as donated today
                </Button>
              </div>

              {!isUser && (
                <Button className="mt-3 w-full bg-linear-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white text-sm">
                  View Details
                </Button>
              )}
              {isUser && (
                <Button
                  variant="outline"
                  className="mt-3 w-full border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/50 text-sm"
                >
                  Contact
                </Button>
              )}
            </Card>
          ))}
        </div>

        {filteredDonors.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-red-300 mx-auto mb-4" />
            <p className="text-red-700 dark:text-red-300">No donors found</p>
            <p className="text-sm text-red-600 dark:text-red-400 mt-2">
              Try adjusting your filters
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
