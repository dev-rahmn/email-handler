
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline';
import NavLogo from './NavLogo';
import ProfileDropdown from './ProfileDropdown';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function NavbarMain() {
  const user = 'admin';
  const location = useLocation();

  const links = [
    { name: "Home", path: "/home" },
    { name: "UserManagement", path: "/usermanagement", roles: ["admin"] },
    { name: "List", path: "/list" },
    { name: "Mail Handler", path: "/mailhandler" }
  ];
  
  
  // Filter links based on user type
  const filteredLinks = links.filter((item) => {
    if (item.roles) {
      return item.roles.includes(user);
    }
    return true;
  });
  
  return (
    <Disclosure as="nav"
    className="bg-darkGrey fixed w-full max-w-[1300px] left-1/2 transform -translate-x-1/2 z-20 top-[-6px] rounded-t-lg rounded-b-2xl border-y border-lightOrange"
>

      {({ open }) => (
        <>
          <div className="w-full mx-auto px-2 sm:px-6 lg:px-6">
            <div className="relative flex items-center justify-between h-16">
              {/* Mobile menu button */}
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block text-white h-8 w-8" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block text-white h-8 w-8" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>

              {/* Logo and Desktop Navigation */}
              <div className="flex flex-1 items-center justify-center sm:items-stretch  sm:justify-start">
                <NavLogo />
                  <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
                  {filteredLinks.map((item) => {
                // Check if the current path matches the link's href
                const isActive = location.pathname === item.path;
                
                return (
                  <Link
                        key={item.name}
                        to={item.path}
                        className={classNames(
                          isActive
                            ? 'bg-darkGrey text-white shadow-inner shadow-cyan'
                            : 'text-white hover:bg-lightGrey hover:text-black hover:shadow-inner hover:shadow-lightOrange',
                          'px-3 py-2 rounded-md text-sm font-medium'
                        )}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        {item.name}
                      </Link>
                      );
                    })}
                </div>
              </div>

              {/* Notification and Profile dropdown */}
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                {/* Notification button */}
                <button
                  type="button"
                  className="bg-gray-800 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none"
                >
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-6 w-6 text-white" aria-hidden="true" />
                </button>

                {/* Profile dropdown */}
                <ProfileDropdown />
              </div>
            </div>
          </div>

          {/* Mobile Menu Panel */}
          <Disclosure.Panel className="sm:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
            {filteredLinks.map((item,index) => {
              // Check if the current path matches the link's href
              const isActive = location.pathname === item.path;
              return (
                <Disclosure.Button
                  key={index}
                  as={Link}
                  to={item.path}
                  className={classNames(
                    isActive
                      ? 'bg-darkGrey text-lightOrange shadow-inner shadow-lightOrange'
                      : 'text-white hover:bg-darkGrey hover:text-white',
                    'block px-3 py-2 rounded-md text-base font-medium'
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              );
            })}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}

