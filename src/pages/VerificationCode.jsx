import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

export default function OTPVerification() {
  const inputs = Array.from({ length: 6 }, () => useRef(null));

  const handleChange = (e, index) => {
    const value = e.target.value;

    if (/^\d$/.test(value)) {
      if (index < 5) {
        inputs[index + 1].current.focus();
      }
    } else {
      e.target.value = "";
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      inputs[index - 1].current.focus();
    }
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

        <h2 className="text-center text-white text-2xl font-semibold mt-6">
          Enter Verification Code
        </h2>

        <p className="text-center text-white/80 mt-2 text-sm">
          Enter the 6-digit code sent to your email.
        </p>

        <div className="flex justify-between mt-8 px-4">
          {inputs.map((ref, index) => (
            <input
              key={index}
              ref={ref}
              maxLength={1}
              className="w-12 h-12 text-center text-xl bg-white/20 text-white border border-red-300 rounded-lg focus:ring-red-400 focus:border-red-400 outline-none"
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
            />
          ))}
        </div>

        <Button
          type="submit"
          className="w-full bg-red-600 hover:bg-red-700 text-white mt-8"
        >
          Verify Code
        </Button>

        <p className="text-center text-white/80 mt-5">
          Didn’t receive the code?{" "}
          <a href="#" className="text-white hover:underline">
            Resend
          </a>
        </p>

        <p className="text-center text-white/80 mt-2">
          Change email?{" "}
          <a href="#" className="text-white hover:underline">
            Go back
          </a>
        </p>
      </div>
    </div>
  );
}
