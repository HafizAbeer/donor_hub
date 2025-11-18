import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Users, Calendar, Award, TrendingUp, MapPin, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { DUMMY_DONORS } from '@/data/users';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function UserDashboard() {
  const { user } = useAuth();
  const [dateFilter, setDateFilter] = useState('year');
  
  // Get user's donation count from dummy data or default
  const userDonations = DUMMY_DONORS.find(d => d.email === user?.email)?.donations || 5;
  const availableDonors = DUMMY_DONORS.length - 1; // Exclude current user
  const pointsEarned = userDonations * 50;

  const stats = [
    { title: 'My Donations', value: userDonations.toString(), change: '+1', icon: Heart, color: 'text-red-600', bgColor: 'bg-red-100 dark:bg-red-900/30' },
    { title: 'Available Donors', value: availableDonors.toString(), change: `+${Math.floor(availableDonors / 2)}`, icon: Users, color: 'text-pink-600', bgColor: 'bg-pink-100 dark:bg-pink-900/30' },
    { title: 'Days Until Next', value: '30', change: 'On Track', icon: Calendar, color: 'text-red-500', bgColor: 'bg-red-100 dark:bg-red-900/30' },
    { title: 'Points Earned', value: pointsEarned.toString(), change: '+50', icon: Award, color: 'text-pink-500', bgColor: 'bg-pink-100 dark:bg-pink-900/30' },
  ];

  const donationHistory = [
    { date: 'Jan 2024', donations: 1 },
    { date: 'Feb 2024', donations: 0 },
    { date: 'Mar 2024', donations: 1 },
    { date: 'Apr 2024', donations: 1 },
    { date: 'May 2024', donations: 0 },
    { date: 'Jun 2024', donations: 1 },
    { date: 'Jul 2024', donations: 1 },
  ];

  const pointsHistory = [
    { month: 'Jan', points: 50 },
    { month: 'Feb', points: 50 },
    { month: 'Mar', points: 50 },
    { month: 'Apr', points: 50 },
    { month: 'May', points: 50 },
    { month: 'Jun', points: 50 },
  ];

  const myDonations = [
    { id: 1, date: 'June 15, 2024', bloodGroup: 'O+', location: 'Lahore Medical Center', points: 50 },
    { id: 2, date: 'April 10, 2024', bloodGroup: 'O+', location: 'Karachi Blood Bank', points: 50 },
    { id: 3, date: 'February 5, 2024', bloodGroup: 'O+', location: 'Islamabad Hospital', points: 50 },
    { id: 4, date: 'December 20, 2023', bloodGroup: 'O+', location: 'Lahore Medical Center', points: 50 },
    { id: 5, date: 'October 15, 2023', bloodGroup: 'O+', location: 'Rawalpindi Clinic', points: 50 },
  ];

  // Get nearby donors from dummy data (excluding current user)
  const nearbyDonors = DUMMY_DONORS
    .filter(d => d.email !== user?.email)
    .slice(0, 3)
    .map((donor, index) => ({
      name: donor.name,
      bloodGroup: donor.bloodGroup,
      distance: `${(index + 1) * 2.3} km`,
      lastDonation: donor.lastDonation,
    }));

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-red-900 dark:text-red-100 mb-2">Donor Dashboard</h2>
          <p className="text-red-700 dark:text-red-300 text-sm md:text-base">Welcome! Find donors and track your donation history</p>
        </div>
        <div className="flex gap-2">
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-3 py-2 bg-white dark:bg-red-900/50 border border-red-300 dark:border-red-800 rounded-md text-red-900 dark:text-red-100 text-sm focus:border-red-500 focus:ring-red-500 focus:outline-none"
          >
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="p-4 md:p-6 bg-white/80 dark:bg-red-950/50 backdrop-blur-sm border-red-200 dark:border-red-900 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-5 h-5 md:w-6 md:h-6 ${stat.color}`} />
              </div>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">{stat.change}</span>
            </div>
            <div>
              <p className="text-xs md:text-sm text-red-700 dark:text-red-400 mb-1">{stat.title}</p>
              <p className="text-xl md:text-2xl font-bold text-red-900 dark:text-red-100">{stat.value}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <Card className="p-4 md:p-6 bg-white/80 dark:bg-red-950/50 backdrop-blur-sm border-red-200 dark:border-red-900">
          <h3 className="text-lg md:text-xl font-semibold text-red-900 dark:text-red-100 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-red-600" />
            Donation History
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={donationHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#fecdd3" />
              <XAxis dataKey="date" stroke="#991b1b" />
              <YAxis stroke="#991b1b" />
              <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #fecdd3', borderRadius: '8px' }} />
              <Area type="monotone" dataKey="donations" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} name="Donations" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-4 md:p-6 bg-white/80 dark:bg-red-950/50 backdrop-blur-sm border-red-200 dark:border-red-900">
          <h3 className="text-lg md:text-xl font-semibold text-red-900 dark:text-red-100 mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-red-600" />
            Points Progress
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={pointsHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#fecdd3" />
              <XAxis dataKey="month" stroke="#991b1b" />
              <YAxis stroke="#991b1b" />
              <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #fecdd3', borderRadius: '8px' }} />
              <Line type="monotone" dataKey="points" stroke="#ec4899" strokeWidth={3} name="Points" />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <Card className="p-4 md:p-6 bg-white/80 dark:bg-red-950/50 backdrop-blur-sm border-red-200 dark:border-red-900">
          <h3 className="text-lg md:text-xl font-semibold text-red-900 dark:text-red-100 mb-4">My Donation History</h3>
          <div className="space-y-3 max-h-[300px] overflow-y-auto">
            {myDonations.map((donation) => (
              <div key={donation.id} className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-900/30 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
                  <Heart className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-red-900 dark:text-red-100">{donation.bloodGroup}</span>
                    <span className="text-xs text-red-600 dark:text-red-400">+{donation.points} pts</span>
                  </div>
                  <p className="text-sm text-red-900 dark:text-red-100 mb-1">{donation.location}</p>
                  <div className="flex items-center gap-3 text-xs text-red-600 dark:text-red-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {donation.date}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4 md:p-6 bg-white/80 dark:bg-red-950/50 backdrop-blur-sm border-red-200 dark:border-red-900">
          <h3 className="text-lg md:text-xl font-semibold text-red-900 dark:text-red-100 mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-red-600" />
            Nearby Donors
          </h3>
          <div className="space-y-3">
            {nearbyDonors.map((donor, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/30 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                  {donor.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-red-900 dark:text-red-100">{donor.name}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-red-600 dark:text-red-400 font-medium">{donor.bloodGroup}</span>
                    <span className="text-xs text-red-500 dark:text-red-500">{donor.distance} away</span>
                  </div>
                  <p className="text-xs text-red-500 dark:text-red-500 mt-1">Last donation: {donor.lastDonation}</p>
                </div>
                <Button size="sm" variant="outline" className="border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/50">
                  Contact
                </Button>
              </div>
            ))}
          </div>
          <Button className="w-full mt-4 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white">
            Find More Donors
          </Button>
        </Card>
      </div>
    </div>
  );
}
