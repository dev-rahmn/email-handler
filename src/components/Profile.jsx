import React from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    onLogout(); // clears user & localStorage
    navigate('/'); // redirect to login
  };

  return (
    <div className="pt-20 pb-16 text-center text-xl px-4">
      <h1>Profile Page</h1>
      <p>Welcome to your profile!</p>
      <button 
        className="mt-4 px-4 py-2 bg-red text-white rounded-md hover:bg-red-600" 
        onClick={handleLogoutClick}
      >
        Logout
      </button>
    </div>
  );
};

export default Profile;
