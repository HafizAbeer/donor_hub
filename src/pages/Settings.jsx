import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings as SettingsIcon, Bell, Lock, Shield, User, Mail, Moon, Sun, CheckCircle, AlertCircle } from 'lucide-react';

export default function Settings() {
  const [settings, setSettings] = useState({
    theme: 'light',
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    donationReminders: true,
    weeklyReports: false,
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSettingChange = (key, value) => {
    setSettings({ ...settings, [key]: value });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    if (!passwordData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }, 2000);
    }
  };

  const handleSaveSettings = () => {
    console.log('Saving settings:', settings);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-red-900 dark:text-red-100 mb-2 flex items-center gap-2">
          <SettingsIcon className="w-6 h-6 md:w-8 md:h-8 text-red-600" />
          Settings
        </h2>
        <p className="text-red-700 dark:text-red-300 text-sm md:text-base">Manage your account and application settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <Card className="p-4 md:p-6 bg-white/80 dark:bg-red-950/50 backdrop-blur-sm border-red-200 dark:border-red-900">
          <h3 className="text-lg md:text-xl font-semibold text-red-900 dark:text-red-100 mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-red-600" />
            General Settings
          </h3>
          <div className="space-y-4">
            <div>
              <Label className="block text-sm font-medium text-red-900 dark:text-red-100 mb-2 flex items-center gap-2">
                <Moon className="w-4 h-4 text-red-600" />
                Theme
              </Label>
              <select
                value={settings.theme}
                onChange={(e) => handleSettingChange('theme', e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-red-900/30 border border-red-300 dark:border-red-800 rounded-md text-red-900 dark:text-red-100 focus:border-red-500 focus:ring-red-500 focus:outline-none"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </select>
            </div>

            <div>
              <Label className="block text-sm font-medium text-red-900 dark:text-red-100 mb-2">Language</Label>
              <select
                defaultValue="en"
                className="w-full px-3 py-2 bg-white dark:bg-red-900/30 border border-red-300 dark:border-red-800 rounded-md text-red-900 dark:text-red-100 focus:border-red-500 focus:ring-red-500 focus:outline-none"
              >
                <option value="en">English</option>
                <option value="ur">Urdu</option>
              </select>
            </div>

            <Button
              onClick={handleSaveSettings}
              className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white"
            >
              Save General Settings
            </Button>
          </div>
        </Card>

        <Card className="p-4 md:p-6 bg-white/80 dark:bg-red-950/50 backdrop-blur-sm border-red-200 dark:border-red-900">
          <h3 className="text-lg md:text-xl font-semibold text-red-900 dark:text-red-100 mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5 text-red-600" />
            Notifications
          </h3>
          <div className="space-y-3">
            <label className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/30 rounded-lg cursor-pointer hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors">
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                className="rounded border-red-300 text-red-600 focus:ring-red-500"
              />
              <div className="flex-1">
                <span className="text-sm font-medium text-red-900 dark:text-red-100">Email Notifications</span>
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">Receive updates via email</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/30 rounded-lg cursor-pointer hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors">
              <input
                type="checkbox"
                checked={settings.smsNotifications}
                onChange={(e) => handleSettingChange('smsNotifications', e.target.checked)}
                className="rounded border-red-300 text-red-600 focus:ring-red-500"
              />
              <div className="flex-1">
                <span className="text-sm font-medium text-red-900 dark:text-red-100">SMS Notifications</span>
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">Receive updates via SMS</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/30 rounded-lg cursor-pointer hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors">
              <input
                type="checkbox"
                checked={settings.pushNotifications}
                onChange={(e) => handleSettingChange('pushNotifications', e.target.checked)}
                className="rounded border-red-300 text-red-600 focus:ring-red-500"
              />
              <div className="flex-1">
                <span className="text-sm font-medium text-red-900 dark:text-red-100">Push Notifications</span>
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">Receive browser notifications</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/30 rounded-lg cursor-pointer hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors">
              <input
                type="checkbox"
                checked={settings.donationReminders}
                onChange={(e) => handleSettingChange('donationReminders', e.target.checked)}
                className="rounded border-red-300 text-red-600 focus:ring-red-500"
              />
              <div className="flex-1">
                <span className="text-sm font-medium text-red-900 dark:text-red-100">Donation Reminders</span>
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">Get reminded when you can donate again</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/30 rounded-lg cursor-pointer hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors">
              <input
                type="checkbox"
                checked={settings.weeklyReports}
                onChange={(e) => handleSettingChange('weeklyReports', e.target.checked)}
                className="rounded border-red-300 text-red-600 focus:ring-red-500"
              />
              <div className="flex-1">
                <span className="text-sm font-medium text-red-900 dark:text-red-100">Weekly Reports</span>
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">Receive weekly donation summaries</p>
              </div>
            </label>

            <Button
              onClick={handleSaveSettings}
              className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white"
            >
              Save Notification Settings
            </Button>
          </div>
        </Card>

        <Card className="p-4 md:p-6 bg-white/80 dark:bg-red-950/50 backdrop-blur-sm border-red-200 dark:border-red-900 lg:col-span-2">
          <h3 className="text-lg md:text-xl font-semibold text-red-900 dark:text-red-100 mb-4 flex items-center gap-2">
            <Lock className="w-5 h-5 text-red-600" />
            Change Password
          </h3>
          <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-2xl">
            <div>
              <Label htmlFor="currentPassword" className="text-red-900 dark:text-red-100">Current Password</Label>
              <Input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                className={`mt-2 bg-white dark:bg-red-900/30 border-red-300 dark:border-red-800 text-red-900 dark:text-red-100 focus:border-red-500 focus:ring-red-500 ${errors.currentPassword ? 'border-red-500' : ''}`}
                required
              />
              {errors.currentPassword && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.currentPassword}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="newPassword" className="text-red-900 dark:text-red-100">New Password</Label>
                <Input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Min. 8 characters"
                  className={`mt-2 bg-white dark:bg-red-900/30 border-red-300 dark:border-red-800 text-red-900 dark:text-red-100 focus:border-red-500 focus:ring-red-500 ${errors.newPassword ? 'border-red-500' : ''}`}
                  required
                />
                {errors.newPassword && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.newPassword}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="confirmPassword" className="text-red-900 dark:text-red-100">Confirm New Password</Label>
                <Input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="********"
                  className={`mt-2 bg-white dark:bg-red-900/30 border-red-300 dark:border-red-800 text-red-900 dark:text-red-100 focus:border-red-500 focus:ring-red-500 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                  required
                />
                {errors.confirmPassword && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            {success && (
              <div className="p-3 bg-green-50 dark:bg-green-900/30 border border-green-300 dark:border-green-800 rounded-lg flex items-center gap-2 text-green-700 dark:text-green-300">
                <CheckCircle className="w-5 h-5" />
                <span>Password changed successfully!</span>
              </div>
            )}

            <Button
              type="submit"
              className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white"
            >
              Change Password
            </Button>
          </form>
        </Card>

        <Card className="p-4 md:p-6 bg-white/80 dark:bg-red-950/50 backdrop-blur-sm border-red-200 dark:border-red-900 lg:col-span-2">
          <h3 className="text-lg md:text-xl font-semibold text-red-900 dark:text-red-100 mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-red-600" />
            Privacy & Security
          </h3>
          <div className="space-y-4">
            <label className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/30 rounded-lg cursor-pointer hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors">
              <input
                type="checkbox"
                defaultChecked
                className="rounded border-red-300 text-red-600 focus:ring-red-500"
              />
              <div className="flex-1">
                <span className="text-sm font-medium text-red-900 dark:text-red-100">Profile Visibility</span>
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">Allow other donors to find your profile</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/30 rounded-lg cursor-pointer hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors">
              <input
                type="checkbox"
                defaultChecked
                className="rounded border-red-300 text-red-600 focus:ring-red-500"
              />
              <div className="flex-1">
                <span className="text-sm font-medium text-red-900 dark:text-red-100">Share Donation History</span>
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">Allow public viewing of your donation history</p>
              </div>
            </label>

            <div className="pt-4 border-t border-red-200 dark:border-red-800">
              <Button variant="outline" className="border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/50">
                Export My Data
              </Button>
              <Button variant="outline" className="ml-3 border-red-500 text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/50">
                Delete Account
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
