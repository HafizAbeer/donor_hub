import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserPlus, Calendar, Droplet, MapPin, Mail, Phone, User, AlertCircle, CheckCircle, FileText, Heart } from 'lucide-react';
import ReactCountryFlag from 'react-country-flag';

export default function AddUser() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bloodGroup: '',
    dateOfBirth: '',
    address: '',
    city: '',
    province: '',
    gender: '',
    cnic: '',
    emergencyContact: '',
    emergencyPhone: '',
    medicalConditions: '',
    allergies: '',
    lastDonation: '',
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Phone must be 10 digits';
    if (!formData.bloodGroup) newErrors.bloodGroup = 'Blood group is required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Adding user:', formData);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setFormData({
          name: '', email: '', phone: '', bloodGroup: '', dateOfBirth: '',
          address: '', city: '', province: '', gender: '', cnic: '',
          emergencyContact: '', emergencyPhone: '', medicalConditions: '',
          allergies: '', lastDonation: '',
        });
      }, 2000);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const provinces = ['Punjab', 'Sindh', 'Khyber Pakhtunkhwa', 'Balochistan', 'Gilgit-Baltistan', 'Azad Kashmir'];
  const genders = ['Male', 'Female', 'Other'];

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-red-900 dark:text-red-100 mb-2 flex items-center gap-2">
          <UserPlus className="w-6 h-6 md:w-8 md:h-8 text-red-600" />
          Add User
        </h2>
        <p className="text-red-700 dark:text-red-300 text-sm md:text-base">Register a new donor with comprehensive information</p>
      </div>

      <Card className="p-4 md:p-6 bg-white/80 dark:bg-red-950/50 backdrop-blur-sm border-red-200 dark:border-red-900">
        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            <div>
              <Label htmlFor="name" className="text-red-900 dark:text-red-100 flex items-center gap-2">
                <User className="w-4 h-4 text-red-600" />
                Full Name *
              </Label>
              <Input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className={`mt-2 bg-white dark:bg-red-900/30 border-red-300 dark:border-red-800 text-red-900 dark:text-red-100 focus:border-red-500 focus:ring-red-500 ${errors.name ? 'border-red-500' : ''}`}
                required
              />
              {errors.name && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.name}</p>}
            </div>

            <div>
              <Label htmlFor="email" className="text-red-900 dark:text-red-100 flex items-center gap-2">
                <Mail className="w-4 h-4 text-red-600" />
                Email *
              </Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="user@example.com"
                className={`mt-2 bg-white dark:bg-red-900/30 border-red-300 dark:border-red-800 text-red-900 dark:text-red-100 focus:border-red-500 focus:ring-red-500 ${errors.email ? 'border-red-500' : ''}`}
                required
              />
              {errors.email && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.email}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            <div>
              <Label htmlFor="phone" className="text-red-900 dark:text-red-100 flex items-center gap-2">
                <Phone className="w-4 h-4 text-red-600" />
                Phone Number *
              </Label>
              <div className={`mt-2 flex items-center bg-white dark:bg-red-900/30 border border-red-300 dark:border-red-800 rounded-md focus-within:border-red-500 focus-within:ring-1 focus-within:ring-red-500 ${errors.phone ? 'border-red-500' : ''}`}>
                <div className="flex items-center gap-2 px-3 py-2 border-r border-red-300 dark:border-red-800">
                  <ReactCountryFlag countryCode="PK" svg style={{ width: "20px", height: "20px", borderRadius: "3px" }} />
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
              {errors.phone && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.phone}</p>}
            </div>

            <div>
              <Label htmlFor="cnic" className="text-red-900 dark:text-red-100 flex items-center gap-2">
                <FileText className="w-4 h-4 text-red-600" />
                CNIC
              </Label>
              <Input
                type="text"
                id="cnic"
                name="cnic"
                value={formData.cnic}
                onChange={handleChange}
                placeholder="35202-1234567-8"
                className="mt-2 bg-white dark:bg-red-900/30 border-red-300 dark:border-red-800 text-red-900 dark:text-red-100 focus:border-red-500 focus:ring-red-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
            <div>
              <Label htmlFor="bloodGroup" className="text-red-900 dark:text-red-100 flex items-center gap-2">
                <Droplet className="w-4 h-4 text-red-600" />
                Blood Group *
              </Label>
              <select
                id="bloodGroup"
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                className={`mt-2 w-full px-3 py-2 bg-white dark:bg-red-900/30 border border-red-300 dark:border-red-800 rounded-md text-red-900 dark:text-red-100 focus:border-red-500 focus:ring-red-500 focus:outline-none ${errors.bloodGroup ? 'border-red-500' : ''}`}
                required
              >
                <option value="">Select</option>
                {bloodGroups.map((bg) => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
              {errors.bloodGroup && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.bloodGroup}</p>}
            </div>

            <div>
              <Label htmlFor="gender" className="text-red-900 dark:text-red-100">Gender</Label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="mt-2 w-full px-3 py-2 bg-white dark:bg-red-900/30 border border-red-300 dark:border-red-800 rounded-md text-red-900 dark:text-red-100 focus:border-red-500 focus:ring-red-500 focus:outline-none"
              >
                <option value="">Select</option>
                {genders.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="dateOfBirth" className="text-red-900 dark:text-red-100 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-red-600" />
                Date of Birth *
              </Label>
              <Input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className={`mt-2 bg-white dark:bg-red-900/30 border-red-300 dark:border-red-800 text-red-900 dark:text-red-100 focus:border-red-500 focus:ring-red-500 ${errors.dateOfBirth ? 'border-red-500' : ''}`}
                required
              />
              {errors.dateOfBirth && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.dateOfBirth}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            <div>
              <Label htmlFor="province" className="text-red-900 dark:text-red-100 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-600" />
                Province
              </Label>
              <select
                id="province"
                name="province"
                value={formData.province}
                onChange={handleChange}
                className="mt-2 w-full px-3 py-2 bg-white dark:bg-red-900/30 border border-red-300 dark:border-red-800 rounded-md text-red-900 dark:text-red-100 focus:border-red-500 focus:ring-red-500 focus:outline-none"
              >
                <option value="">Select Province</option>
                {provinces.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="city" className="text-red-900 dark:text-red-100">City *</Label>
              <Input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Lahore"
                className="mt-2 bg-white dark:bg-red-900/30 border-red-300 dark:border-red-800 text-red-900 dark:text-red-100 focus:border-red-500 focus:ring-red-500"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="address" className="text-red-900 dark:text-red-100 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-red-600" />
              Address *
            </Label>
            <Input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="123 Main Street"
              className="mt-2 bg-white dark:bg-red-900/30 border-red-300 dark:border-red-800 text-red-900 dark:text-red-100 focus:border-red-500 focus:ring-red-500"
              required
            />
          </div>

          <div className="border-t border-red-200 dark:border-red-800 pt-4">
            <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-600" />
              Medical Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
              <div>
                <Label htmlFor="medicalConditions" className="text-red-900 dark:text-red-100">Medical Conditions</Label>
                <Input
                  type="text"
                  id="medicalConditions"
                  name="medicalConditions"
                  value={formData.medicalConditions}
                  onChange={handleChange}
                  placeholder="None"
                  className="mt-2 bg-white dark:bg-red-900/30 border-red-300 dark:border-red-800 text-red-900 dark:text-red-100 focus:border-red-500 focus:ring-red-500"
                />
              </div>

              <div>
                <Label htmlFor="allergies" className="text-red-900 dark:text-red-100">Allergies</Label>
                <Input
                  type="text"
                  id="allergies"
                  name="allergies"
                  value={formData.allergies}
                  onChange={handleChange}
                  placeholder="None"
                  className="mt-2 bg-white dark:bg-red-900/30 border-red-300 dark:border-red-800 text-red-900 dark:text-red-100 focus:border-red-500 focus:ring-red-500"
                />
              </div>
            </div>

            <div className="mt-4">
              <Label htmlFor="lastDonation" className="text-red-900 dark:text-red-100">Last Donation Date</Label>
              <Input
                type="date"
                id="lastDonation"
                name="lastDonation"
                value={formData.lastDonation}
                onChange={handleChange}
                className="mt-2 bg-white dark:bg-red-900/30 border-red-300 dark:border-red-800 text-red-900 dark:text-red-100 focus:border-red-500 focus:ring-red-500"
              />
            </div>
          </div>

          <div className="border-t border-red-200 dark:border-red-800 pt-4">
            <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-4">Emergency Contact</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
              <div>
                <Label htmlFor="emergencyContact" className="text-red-900 dark:text-red-100">Contact Name</Label>
                <Input
                  type="text"
                  id="emergencyContact"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleChange}
                  placeholder="Emergency contact name"
                  className="mt-2 bg-white dark:bg-red-900/30 border-red-300 dark:border-red-800 text-red-900 dark:text-red-100 focus:border-red-500 focus:ring-red-500"
                />
              </div>

              <div>
                <Label htmlFor="emergencyPhone" className="text-red-900 dark:text-red-100">Contact Phone</Label>
                <div className="mt-2 flex items-center bg-white dark:bg-red-900/30 border border-red-300 dark:border-red-800 rounded-md focus-within:border-red-500 focus-within:ring-1 focus-within:ring-red-500">
                  <div className="flex items-center gap-2 px-3 py-2 border-r border-red-300 dark:border-red-800">
                    <ReactCountryFlag countryCode="PK" svg style={{ width: "20px", height: "20px", borderRadius: "3px" }} />
                    <span className="text-red-900 dark:text-red-100 text-sm">+92</span>
                  </div>
                  <Input
                    type="tel"
                    id="emergencyPhone"
                    name="emergencyPhone"
                    value={formData.emergencyPhone}
                    onChange={handleChange}
                    placeholder="3000000000"
                    className="flex-1 bg-transparent border-0 focus:ring-0 focus:border-0 text-red-900 dark:text-red-100"
                  />
                </div>
              </div>
            </div>
          </div>

          {success && (
            <div className="p-3 bg-green-50 dark:bg-green-900/30 border border-green-300 dark:border-green-800 rounded-lg flex items-center gap-2 text-green-700 dark:text-green-300">
              <CheckCircle className="w-5 h-5" />
              <span>User added successfully!</span>
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </form>
      </Card>
    </div>
  );
}

