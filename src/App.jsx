import React, { useState, useEffect, useRef } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion';

import Home from "./components/pages/Home";
import List from "./components/pages/List";
import MailHandler from "./components/pages/MailHandler";
import UserManagement from "./components/pages/UserManagement";
import Profile from "./components/Profile";
import Login from "./components/pages/Login";
import NavbarMain from "./components/navSection/NavbarMain";
import Settings from "./components/pages/Settings";

// Enhanced variants for a more dynamic navbar animation
const navVariants = {
  hidden: {
    y: -100,
    opacity: 0,
    scale: 0.8,
    boxShadow: '0px 0px 0px rgba(0,0,0,0)',
    transition: { duration: 0.3, ease: 'easeIn' }
  },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    boxShadow: '0px 8px 20px rgba(0,0,0,0.2)',
    transition: { type: 'spring', stiffness: 280, damping: 20 }
  }
};

export default function App() {
  const [user, setUser] = useState(null);
  const [showNav, setShowNav] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const currY = window.scrollY;
      setShowNav(currY <= lastScrollY.current || currY < 50);
      lastScrollY.current = currY;
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogin = (u) => {
    setUser(u);
    localStorage.setItem("user", JSON.stringify(u));
  };
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <>
      {user && (
        <AnimatePresence>
          <motion.div
            variants={navVariants}
            initial="hidden"
            animate={showNav ? 'visible' : 'hidden'}
            exit="hidden"
            className="fixed top-0 left-0 right-0 z-50 bg-white bg-opacity-80 backdrop-blur-md"
            style={{ originY: 0 }}
          >
            <NavbarMain onLogout={handleLogout} />
          </motion.div>
        </AnimatePresence>
      )}

      <main className={`relative overflow-x-hidden pt-0`}>
        {user ? (
          <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<Home />} />
            <Route path="/list" element={<List />} />
            <Route path="/mailhandler" element={<MailHandler />} />
            <Route path="/usermanagement" element={<UserManagement />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile onLogout={handleLogout} />} />
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        ) : (
          <Routes>
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        )}
      </main>
    </>
  );
}
