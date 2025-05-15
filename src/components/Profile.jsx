import React, { useState, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaSignOutAlt,
  FaUser,
  FaProjectDiagram,
  FaStar,
  FaCalendarAlt,
  FaCogs,
  FaHistory,
  FaBell,
  FaPalette,
} from 'react-icons/fa';
import { Menu, Transition } from '@headlessui/react';

const Profile = ({ onLogout, user }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  const tabs = [
    { key: 'overview', label: 'Overview', icon: <FaUser /> },
    { key: 'activity', label: 'Activity', icon: <FaHistory /> },
    { key: 'projects', label: 'Projects', icon: <FaProjectDiagram /> },
    { key: 'settings', label: 'Settings', icon: <FaCogs /> },
    { key: 'preferences', label: 'Preferences', icon: <FaPalette /> },
  ];

  return (
    <div className="min-h-screen bg-lightGrey pt-16 px-4 md:px-8">
      {/* Header with user info */}
      <div className="flex flex-col items-center md:flex-row md:justify-between bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-lightCyan flex items-center justify-center text-3xl text-white">
            {user?.initials || 'U'}
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-darkBrown">{user?.name || 'User Name'}</h2>
            <p className="text-sm text-lightGrey">{user?.role || 'Role'}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="mt-4 md:mt-0 flex items-center gap-2 px-4 py-2 bg-red text-white rounded-md hover:bg-darkOrange transition"
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>

      {/* Tabs navigation */}
     <div className="flex justify-center mb-6 space-x-4 overflow-x-auto py-3">
  {tabs.map((t) => (
    <button
      key={t.key}
      onClick={() => setActiveTab(t.key)}
      className={`flex items-center gap-2 px-5 py-2 rounded-full transition-shadow duration-200 focus:outline-none focus:ring-2 focus:ring-cyan ${
        activeTab === t.key
          ? 'bg-cyan text-white shadow-md'
          : 'bg-white text-grey hover:bg-lightCyan hover:text-darkCyan'
      }`}
    >
      {t.icon}
      <span className="font-medium">{t.label}</span>
    </button>
  ))}
</div>

      <div className="bg-white rounded-lg shadow p-6">
        {/* Tab panels */}
        {activeTab === 'overview' && (
          <div>
            <h1 className="text-2xl font-bold text-darkBrown mb-4">Overview</h1>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              {[
                { label: 'Projects', value: user?.projects || 0, icon: <FaProjectDiagram /> },
                { label: 'Rating', value: user?.rating || '0.0', icon: <FaStar /> },
                { label: 'Experience', value: user?.experience || '0 yrs', icon: <FaCalendarAlt /> },
              ].map((card) => (
                <div key={card.label} className="flex items-center p-4 bg-lightGrey rounded-lg">
                  <div className="p-3 bg-cyan text-white rounded-full mr-4">{card.icon}</div>
                  <div>
                    <p className="text-lg font-semibold text-darkBrown">{card.value}</p>
                    <p className="text-sm text-grey">{card.label}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-lightGrey p-4 rounded-lg">
              <h2 className="font-semibold text-darkBrown mb-2">Bio</h2>
              <p className="text-grey">{user?.bio || 'No bio available.'}</p>
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div>
            <h1 className="text-2xl font-bold text-darkBrown mb-4">Recent Activity</h1>
            <ul className="space-y-3">
              {user?.recentActivity?.length ? (
                user.recentActivity.map((act, i) => (
                  <li key={i} className="flex items-start gap-3 p-3 bg-lightGrey rounded-lg">
                    <FaBell className="text-cyan mt-1" />
                    <span className="text-grey">{act}</span>
                  </li>
                ))
              ) : (
                <p className="text-grey">No recent activity.</p>
              )}
            </ul>
          </div>
        )}

        {activeTab === 'projects' && (
          <div>
            <h1 className="text-2xl font-bold text-darkBrown mb-4">Projects</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {user?.projectsList?.length ? (
                user.projectsList.map((proj, idx) => (
                  <div key={idx} className="bg-lightGrey p-4 rounded-lg">
                    <h3 className="font-semibold text-darkBrown">{proj.name}</h3>
                    <p className="text-sm text-grey mt-1">{proj.description}</p>
                  </div>
                ))
              ) : (
                [...Array(6)].map((_, i) => (
                  <div key={i} className="bg-lightGrey p-4 rounded-lg animate-pulse">
                    <div className="h-6 bg-grey rounded mb-2"></div>
                    <div className="h-4 bg-grey rounded w-3/4"></div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div>
            <h1 className="text-2xl font-bold text-darkBrown mb-4">Settings</h1>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-grey mb-1">Email</label>
                <input type="email" defaultValue={user?.email} className="w-full p-2 border border-grey rounded" />
              </div>
              <div>
                <label className="block text-sm text-grey mb-1">Username</label>
                <input type="text" defaultValue={user?.username} className="w-full p-2 border border-grey rounded" />
              </div>
              <button className="px-4 py-2 bg-cyan text-darkBrown rounded hover:bg-lightCyan transition">Save</button>
            </div>
          </div>
        )}

        {activeTab === 'preferences' && (
          <div>
            <h1 className="text-2xl font-bold text-darkBrown mb-4">Preferences</h1>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-grey">Enable Notifications</span>
                <input type="checkbox" className="form-checkbox h-5 w-5 text-cyan" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-grey">Dark Mode</span>
                <input type="checkbox" className="form-checkbox h-5 w-5 text-cyan" />
              </div>
              <button className="px-4 py-2 bg-cyan text-darkBrown rounded hover:bg-lightCyan transition">Save</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
