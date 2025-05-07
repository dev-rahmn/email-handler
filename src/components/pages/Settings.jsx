import React, { useState } from 'react';
import { motion } from 'framer-motion';

// Animation variants for sections
const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

// Animation variants for list items
const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
};

export default function Settings() {
  // State for toggles
  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(false);
  const [profileVisibility, setProfileVisibility] = useState('public');
  const [theme, setTheme] = useState('light');

  return (
    <div className="p-6 pt-16 max-w-4xl mx-auto space-y-8">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-3xl font-bold text-darkGrey"
      >
        Settings
      </motion.h1>

      {/* Account Information */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className="bg-white shadow rounded-lg p-6"
      >
        <h2 className="text-xl font-semibold mb-4 text-darkGrey">Account Information</h2>
        <motion.div
          className="space-y-2 text-gray-600"
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.1 } },
          }}
        >
          <motion.p variants={itemVariants}>
            <span className="font-medium">Name:</span> Jane Doe
          </motion.p>
          <motion.p variants={itemVariants}>
            <span className="font-medium">Email:</span> jane.doe@example.com
          </motion.p>
          <motion.p variants={itemVariants}>
            <span className="font-medium">Role:</span> Administrator
          </motion.p>
          <motion.p variants={itemVariants}>
            <span className="font-medium">Phone Number:</span> +1 (555) 123-4567
          </motion.p>
          <motion.p variants={itemVariants}>
            <span className="font-medium">Address:</span> 123 Main St, Springfield, IL 62701
          </motion.p>
          <motion.p variants={itemVariants}>
            <span className="font-medium">Last Login:</span> April 16, 2025, 10:30 AM
          </motion.p>
        </motion.div>
      </motion.section>

      {/* Notifications */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className="bg-white shadow rounded-lg p-6"
      >
        <h2 className="text-xl font-semibold mb-4 text-grey">Notifications</h2>
        <div className="flex flex-col space-y-3">
          <motion.label
            className="flex items-center justify-between"
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <span className="text-grey">Email Notifications</span>
            <input
              type="checkbox"
              checked={emailNotif}
              onChange={() => setEmailNotif(!emailNotif)}
              className="form-checkbox h-5 w-5 text-blue"
            />
          </motion.label>
          <motion.label
            className="flex items-center justify-between"
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <span className="text-gray-600">SMS Notifications</span>
            <input
              type="checkbox"
              checked={smsNotif}
              onChange={() => setSmsNotif(!smsNotif)}
              className="form-checkbox h-5 w-5 text-blue"
            />
          </motion.label>
        </div>
      </motion.section>

      {/* Privacy */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className="bg-white shadow rounded-lg p-6"
      >
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Privacy Settings</h2>
        <motion.div
          className="space-y-2 text-gray-600"
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.1 } },
          }}
        >
          <motion.label
            className="flex items-center space-x-4"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
          >
            <input
              type="radio"
              name="visibility"
              value="public"
              checked={profileVisibility === 'public'}
              onChange={() => setProfileVisibility('public')}
              className="form-radio h-4 w-4 text-cyan"
            />
            <span>Public Profile</span>
          </motion.label>
          <motion.label
            className="flex items-center space-x-4"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
          >
            <input
              type="radio"
              name="visibility"
              value="friends"
              checked={profileVisibility === 'friends'}
              onChange={() => setProfileVisibility('friends')}
              className="form-radio h-4 w-4 text-cyan"
            />
            <span>Friends Only</span>
          </motion.label>
          <motion.label
            className="flex items-center space-x-4"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
          >
            <input
              type="radio"
              name="visibility"
              value="private"
              checked={profileVisibility === 'private'}
              onChange={() => setProfileVisibility('private')}
              className="form-radio h-4 w-4 text-cyan"
            />
            <span>Private</span>
          </motion.label>
        </motion.div>
      </motion.section>

      {/* Security Settings */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className="bg-white shadow rounded-lg p-6"
      >
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Security Settings</h2>
        <motion.div
          className="space-y-2 text-gray-600"
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.1 } },
          }}
        >
          <motion.p variants={itemVariants}>
            <span className="font-medium">Two-Factor Authentication:</span> Enabled
          </motion.p>
          <motion.p variants={itemVariants}>
            <span className="font-medium">Last Password Change:</span> March 10, 2025
          </motion.p>
          <motion.p variants={itemVariants}>
            <span className="font-medium">Trusted Devices:</span> 2 (Laptop, Mobile)
          </motion.p>
        </motion.div>
      </motion.section>

      {/* Theme */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className="bg-white shadow rounded-lg p-6"
      >
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Theme</h2>
        <div className="flex space-x-4">
          <motion.button
            onClick={() => setTheme('light')}
            className={`px-4 py-2 rounded ${
              theme === 'light' ? 'bg-cyan text-white' : 'bg-lightGrey text-darkGrey'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            Light
          </motion.button>
          <motion.button
            onClick={() => setTheme('dark')}
            className={`px-4 py-2 rounded ${
              theme === 'dark' ? 'bg-cyan text-white' : 'bg-lightGrey text-darkGrey'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            Dark
          </motion.button>
        </div>
      </motion.section>
    </div>
  );
}