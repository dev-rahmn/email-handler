import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = ({ onLogin }) => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userId === "admin" && password === "admin") {
      const userData = { userId }; // can add more info
      onLogin(userData); // call parent to update login state
      navigate("/home");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-lightGrey  via-grey to-darkGrey">
      <div className="mx-4">

     
      <form
        onSubmit={handleSubmit}
        className="bg-lightBrown bg-opacity-60 backdrop-blur-lg border border-darkBrown shadow-cyanShadow sm:p-4 sm:mx-4 lg:p-10 rounded-2xl w-full max-w-md "
      >
        <h1 className="text-4xl font-extrabold text-center text-black my-8 tracking-wide drop-shadow-lg">
          Welcome Back
        </h1>

        <div className="mb-6">
          <label
            htmlFor="userId"
            className="block text-white text-lg font-medium mb-2"
          >
            User ID
          </label>
          <input
            type="text"
            id="userId"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Enter your User ID"
            className="w-full p-3 rounded-lg bg-white bg-opacity-90 text-darkBrown font-semibold shadow-inner focus:ring-2 focus:ring-lightCyan focus:outline-none"
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="password"
            className="block text-white text-lg font-medium mb-2"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full p-3 rounded-lg bg-white bg-opacity-90 text-darkBrown font-semibold shadow-inner focus:ring-2 focus:ring-orange focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="bg-gradient-to-r from-cyan to-lightCyan text-darkBrown font-bold py-3 px-4 rounded-lg w-full hover:from-lightCyan hover:to-cyan transition-all duration-300 shadow-cyanShadow"
        >
          Login
        </button>

        <p className="text-center mt-6 text-white">
          <span className="lg:inline hidden">
            Don't have an account?{" "}
            <span className="text-orange font-semibold">
              Contact your admin.
            </span>
          </span>
          <span className="lg:hidden inline">
            Don't have an account?{" "}
            <span className="text-orange font-semibold">
              Contact your admin at
              <a
                href="tel:+911234567890"
                className="underline hover:text-lightOrange"
              >
                +91 12345 67890
              </a>
              .
            </span>
          </span>
        </p>
      </form>
 </div>
    </div>
  );
};

export default Login;
