import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import logo from "@/assets/logo.png";
import ReactCountryFlag from "react-country-flag";

export default function Signup() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Demo signup - always creates user role
    const userData = {
      email: formData.email,
      name: formData.email.split("@")[0],
      phone: formData.phone,
      role: "user",
    };

    login(userData);
    navigate("/dashboard");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-tr from-red-500 via-red-400 to-pink-500">
      <div className="bg-white/10 backdrop-blur-md border border-red-300 rounded-2xl p-8 w-full max-w-md shadow-lg mx-4 sm:mx-6">
        <div className="w-full flex justify-center mt-5">
          <img
            src={logo}
            alt="Donor Hub Logo"
            className="w-44 h-auto drop-shadow-md"
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label htmlFor="email" className="text-white">
              Email
            </Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@mail.com"
              className="mt-2 bg-white/20 text-white placeholder-white/70 border-red-300 focus:border-red-400 focus:ring-red-400"
              required
            />
          </div>

          <div>
            <Label htmlFor="phone" className="text-white">
              Phone Number
            </Label>
            <div className="mt-2 flex items-center bg-white/20 border border-red-300 rounded-md focus-within:border-red-400 focus-within:ring-1 focus-within:ring-red-400">
              <div className="flex items-center gap-2 px-3 py-2 border-r border-white/30">
                <ReactCountryFlag
                  countryCode="PK"
                  svg
                  style={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "3px",
                  }}
                />
                <span className="text-white text-sm">+92</span>
              </div>
              <Input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="3000000000"
                className="flex-1 bg-transparent text-white placeholder-white/70 border-0 focus:ring-0 focus:border-0"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="password" className="text-white">
              Set Password
            </Label>
            <Input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="********"
              className="mt-2 bg-white/20 text-white placeholder-white/70 border-red-300 focus:border-red-400 focus:ring-red-400"
              required
            />
          </div>

          <div>
            <Label htmlFor="confirmPassword" className="text-white">
              Confirm Password
            </Label>
            <Input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="********"
              className="mt-2 bg-white/20 text-white placeholder-white/70 border-red-300 focus:border-red-400 focus:ring-red-400"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white mt-4"
          >
            Sign up
          </Button>
        </form>

        <p className="text-center text-white/80 mt-4">
          Have an account?{" "}
          <Link to="/login" className="text-white hover:underline">
            Sign in
          </Link>
        </p>
        <p className="text-center text-white/80 mt-4">
          <Link to="/forgot-password" className="text-white hover:underline">
            Forgot password?
          </Link>
        </p>
      </div>
    </div>
  );
}
