import React from 'react'
import { useNavigate } from 'react-router-dom'

const ProfileBtn = () => {
  const navigate = useNavigate()
  return (
    <div  className='cursor-pointer' onClick={() => navigate('/profile')}>
      <img
        src="https://avatar.iran.liara.run/public/42"
        alt="Profile"
        className="w-10 h-10 rounded-full object-cover"
      />
    </div>
  )
}

export default ProfileBtn