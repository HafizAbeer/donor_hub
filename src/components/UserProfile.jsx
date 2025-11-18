import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserCircle, Droplet, Calendar, MapPin, Phone, Mail, Save, Heart, Award, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import ReactCountryFlag from 'react-country-flag';
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

export default function UserProfile() {
  const { user } = useAuth();
  
  // Initialize form data from user, with fallbacks
  const [formData, setFormData] = useState(() => ({
    name: user?.name || 'John Doe',
    email: user?.email || 'user@example.com',
    phone: user?.phone || '+92 300 1234567',
    bloodGroup: user?.bloodGroup || 'O+',
    dateOfBirth: user?.dateOfBirth || '1990-01-01',
    address: user?.address || '123 Main Street',
    city: user?.city || 'Lahore',
  }));
  
  // Update form data when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || 'John Doe',
        email: user.email || 'user@example.com',
        phone: user.phone || '+92 300 1234567',
        bloodGroup: user.bloodGroup || 'O+',
        dateOfBirth: user.dateOfBirth || '1990-01-01',
        address: user.address || '123 Main Street',
        city: user.city || 'Lahore',
      });
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle profile update
    console.log('Updating profile:', formData);
    alert('Profile updated successfully!');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-red-900 dark:text-red-100 mb-2 flex items-center gap-2">
          <UserCircle className="w-8 h-8 text-red-600" />
          My Profile
        </h2>
        <p className="text-red-700 dark:text-red-300">Update your personal information and donation details</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 bg-white/80 dark:bg-red-950/50 backdrop-blur-sm border-red-200 dark:border-red-900 lg:col-span-1">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center text-white text-3xl font-bold">
              {formData.name.charAt(0).toUpperCase()}
            </div>
            <h3 className="text-xl font-semibold text-red-900 dark:text-red-100 mb-1">{formData.name}</h3>
            <p className="text-red-700 dark:text-red-400 mb-4">{formData.email}</p>
            <div className="flex items-center justify-center gap-2 text-red-600 dark:text-red-400">
              <Droplet className="w-5 h-5" />
              <span className="text-lg font-semibold">{formData.bloodGroup}</span>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <div className="p-3 bg-red-50 dark:bg-red-900/30 rounded-lg">
              <p className="text-xs text-red-600 dark:text-red-400 mb-1">Total Donations</p>
              <p className="text-2xl font-bold text-red-900 dark:text-red-100">5</p>
            </div>
            <div className="p-3 bg-red-50 dark:bg-red-900/30 rounded-lg">
              <p className="text-xs text-red-600 dark:text-red-400 mb-1">Last Donation</p>
              <p className="text-lg font-semibold text-red-900 dark:text-red-100">3 months ago</p>
            </div>
            <div className="p-3 bg-red-50 dark:bg-red-900/30 rounded-lg">
              <p className="text-xs text-red-600 dark:text-red-400 mb-1">Points Earned</p>
              <p className="text-2xl font-bold text-red-900 dark:text-red-100 flex items-center gap-1">
                <Award className="w-5 h-5 text-pink-600" />
                250
              </p>
            </div>
          </div>
        </Card>

        <div className="lg:col-span-2 space-y-4 md:space-y-6">
        <Card className="p-4 md:p-6 bg-white/80 dark:bg-red-950/50 backdrop-blur-sm border-red-200 dark:border-red-900">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <Label htmlFor="name" className="text-red-900 dark:text-red-100">Full Name</Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-2 bg-white dark:bg-red-900/30 border-red-300 dark:border-red-800 text-red-900 dark:text-red-100 focus:border-red-500 focus:ring-red-500"
                  required
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-red-900 dark:text-red-100">Email</Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-2 bg-white dark:bg-red-900/30 border-red-300 dark:border-red-800 text-red-900 dark:text-red-100 focus:border-red-500 focus:ring-red-500"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="phone" className="text-red-900 dark:text-red-100">Phone Number</Label>
              <div className="mt-2 flex items-center bg-white dark:bg-red-900/30 border border-red-300 dark:border-red-800 rounded-md focus-within:border-red-500 focus-within:ring-1 focus-within:ring-red-500">
                <div className="flex items-center gap-2 px-3 py-2 border-r border-red-300 dark:border-red-800">
                  <ReactCountryFlag
                    countryCode="PK"
                    svg
                    style={{ width: "20px", height: "20px", borderRadius: "3px" }}
                  />
                  <span className="text-red-900 dark:text-red-100 text-sm">+92</span>
                </div>
                <Input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="3000000000"
                  className="flex-1 bg-transparent border-0 focus:ring-0 focus:border-0 text-red-900 dark:text-red-100"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <Label htmlFor="bloodGroup" className="text-red-900 dark:text-red-100 flex items-center gap-2">
                  <Droplet className="w-4 h-4 text-red-600" />
                  Blood Group
                </Label>
                <select
                  id="bloodGroup"
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  className="mt-2 w-full px-3 py-2 bg-white dark:bg-red-900/30 border border-red-300 dark:border-red-800 rounded-md text-red-900 dark:text-red-100 focus:border-red-500 focus:ring-red-500 focus:outline-none"
                  required
                >
                  {bloodGroups.map((bg) => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="dateOfBirth" className="text-red-900 dark:text-red-100 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-red-600" />
                  Date of Birth
                </Label>
                <Input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="mt-2 bg-white dark:bg-red-900/30 border-red-300 dark:border-red-800 text-red-900 dark:text-red-100 focus:border-red-500 focus:ring-red-500"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address" className="text-red-900 dark:text-red-100 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-600" />
                Address
              </Label>
              <Input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="mt-2 bg-white dark:bg-red-900/30 border-red-300 dark:border-red-800 text-red-900 dark:text-red-100 focus:border-red-500 focus:ring-red-500"
                required
              />
            </div>

            <div>
              <Label htmlFor="city" className="text-red-900 dark:text-red-100">City</Label>
              <Input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="mt-2 bg-white dark:bg-red-900/30 border-red-300 dark:border-red-800 text-red-900 dark:text-red-100 focus:border-red-500 focus:ring-red-500"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </form>
        </Card>

        <Card className="p-4 md:p-6 bg-white/80 dark:bg-red-950/50 backdrop-blur-sm border-red-200 dark:border-red-900">
          <h3 className="text-lg md:text-xl font-semibold text-red-900 dark:text-red-100 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-red-600" />
            Donation History Chart
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={[
              { month: 'Jan', donations: 0 },
              { month: 'Feb', donations: 1 },
              { month: 'Mar', donations: 0 },
              { month: 'Apr', donations: 1 },
              { month: 'May', donations: 1 },
              { month: 'Jun', donations: 1 },
              { month: 'Jul', donations: 1 },
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#fecdd3" />
              <XAxis dataKey="month" stroke="#991b1b" />
              <YAxis stroke="#991b1b" />
              <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #fecdd3', borderRadius: '8px' }} />
              <Area type="monotone" dataKey="donations" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} name="Donations" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-4 md:p-6 bg-white/80 dark:bg-red-950/50 backdrop-blur-sm border-red-200 dark:border-red-900">
          <h3 className="text-lg md:text-xl font-semibold text-red-900 dark:text-red-100 mb-4 flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-600" />
            Recent Donations
          </h3>
          <div className="space-y-3">
            {[
              { id: 1, date: 'June 15, 2024', location: 'Lahore Medical Center', points: 50, status: 'completed' },
              { id: 2, date: 'April 10, 2024', location: 'Karachi Blood Bank', points: 50, status: 'completed' },
              { id: 3, date: 'February 5, 2024', location: 'Islamabad Hospital', points: 50, status: 'completed' },
            ].map((donation) => (
              <div key={donation.id} className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/30 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center text-white flex-shrink-0">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-red-900 dark:text-red-100">{donation.location}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-red-600 dark:text-red-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {donation.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Award className="w-3 h-3" />
                      +{donation.points} pts
                    </span>
                  </div>
                </div>
                <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded text-xs font-medium">
                  {donation.status}
                </span>
              </div>
            ))}
          </div>
        </Card>
        </div>
      </div>
    </div>
  );
}

