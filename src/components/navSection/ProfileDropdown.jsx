import React, { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { useNavigate } from 'react-router-dom';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const ProfileDropdown = () => {
  const navigate = useNavigate();

  // Handler for sign out: clear localStorage and redirect to login
  const handleSignOut = () => {
    localStorage.removeItem("user");
    navigate('/login');
  };

  return (
    <Menu as="div" className="ml-3 relative">
      <div>
        <Menu.Button className="bg-darkGrey flex text-sm rounded-full focus:outline-none">
          <span className="sr-only">Open user menu</span>
          <img
            className="h-8 w-8 rounded-full"
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            alt="User avatar"
          />
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={() => navigate('/profile')}
                className={classNames(
                  active ? 'bg-lightGrey text-white' : '',
                  'block w-full text-left px-4 py-2 text-sm text-darkGrey'
                )}
              >
                Your Profile
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={() => navigate('/settings')}
                className={classNames(
                  active ? 'bg-lightGrey text-white' : '',
                  'block w-full text-left px-4 py-2 text-sm text-darkGrey'
                )}
              >
                Settings
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={handleSignOut}
                className={classNames(
                  active ? 'bg-lightGrey text-white' : '',
                  'block w-full text-left px-4 py-2 text-sm text-darkGrey'
                )}
              >
                Sign out
              </button>
            )}
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default ProfileDropdown;
