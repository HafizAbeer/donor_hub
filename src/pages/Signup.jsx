import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import logo from "@/assets/logo.png";
import ReactCountryFlag from "react-country-flag";


export default function Signup() {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-tr from-red-500 via-red-400 to-pink-500">
      <div className="bg-white/10 backdrop-blur-md border border-red-300 rounded-2xl p-8 w-full max-w-md shadow-lg mx-4 sm:mx-6">
        <div class="w-full flex justify-center mt-5">
            <img 
                src={logo}
                alt="Donor Hub Logo" 
                class="w-44 h-auto drop-shadow-md"
            />
        </div>
        
        <form className="space-y-5">
          <div>
            <Label htmlFor="email" className="text-white">Email</Label>
            <Input
              type="email"
              id="email"
              placeholder="example@mail.com"
              className="mt-2 bg-white/20 text-white placeholder-white/70 border-red-300 focus:border-red-400 focus:ring-red-400"
            />
          </div>

          <div>
            <Label htmlFor="phone" className="text-white">Phone Number</Label>

            <div class="mt-2 flex items-center bg-white/20 border border-red-300 rounded-md focus-within:border-red-400 focus-within:ring-1 focus-within:ring-red-400">
                
                <div class="flex items-center gap-2 px-3 py-2 border-r border-white/30">
                <ReactCountryFlag
                    countryCode="PK"
                    svg
                    style={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "3px"
                    }}
                />
                <span class="text-white text-sm">+92</span>
                </div>

                <Input
                type="tel"
                id="phone"
                placeholder="3000000000"
                className="flex-1 bg-transparent text-white placeholder-white/70 border-0 focus:ring-0 focus:border-0"
                />

            </div>
            </div>

          
          <div>
            <Label htmlFor="password" className="text-white">Set Password</Label>
            <Input
              type="password"
              id="password"
              placeholder="********"
              className="mt-2 bg-white/20 text-white placeholder-white/70 border-red-300 focus:border-red-400 focus:ring-red-400"
            />
          </div>

          <div>
            <Label htmlFor="password" className="text-white">Confirm Password</Label>
            <Input
              type="password"
              id="password"
              placeholder="********"
              className="mt-2 bg-white/20 text-white placeholder-white/70 border-red-300 focus:border-red-400 focus:ring-red-400"
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
          Have an account? <a href="#" className="text-white hover:underline">Sign in</a>
        </p>
        <p className="text-center text-white/80 mt-4"><a href="#" className="text-white hover:underline">Forgot password?</a>
        </p>
      </div>
    </div>
  );
}
