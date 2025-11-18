import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { HARDCODED_USERS } from "@/data/users";
import logo from "@/assets/logo.png";
import { AlertCircle } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Find user by email
    const user = HARDCODED_USERS.find(u => u.email.toLowerCase() === formData.email.toLowerCase());

    if (!user) {
      setError("Invalid email or password");
      return;
    }

    // Check password
    if (user.password !== formData.password) {
      setError("Invalid email or password");
      return;
    }

    // Login successful - create user data object without password
    const userData = {
      email: user.email,
      name: user.name,
      role: user.role,
      phone: user.phone,
      bloodGroup: user.bloodGroup,
      city: user.city,
    };

    login(userData);
    navigate("/dashboard");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
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
            <Label htmlFor="password" className="text-white">
              Password
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

          {error && (
            <div className="p-3 bg-red-500/20 border border-red-400 rounded-lg flex items-center gap-2 text-red-100">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white mt-4"
          >
            Login
          </Button>
        </form>

        <div className="mt-6 p-3 bg-white/10 rounded-lg border border-white/20">
          <p className="text-xs text-white/80 font-semibold mb-2">Test Accounts:</p>
          <div className="space-y-1 text-xs text-white/70">
            <p>Super Admin: superadmin@donorhub.com / superadmin123</p>
            <p>Admin: admin@donorhub.com / admin123</p>
            <p>User: user@donorhub.com / user123</p>
          </div>
        </div>

        <p className="text-center text-white/80 mt-4">
          Don't have an account?{" "}
          <Link to="/signup" className="text-white hover:underline">
            Sign up
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
