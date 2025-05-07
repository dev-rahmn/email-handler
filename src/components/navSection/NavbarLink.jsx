import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const NavbarLink = ({ onLinkClick, user }) => {
  const location = useLocation();

  // Define links with an optional 'roles' property
  const links = [
    { link: "Home", path: "home" },
    { link: "UserManagement", path: "usermanagement", roles: ["admin"] },
    { link: "List", path: "list" },
    { link: "Mail Handler", path: "mailhandler" }
  ];

  // Filter links based on user type
  const filteredLinks = links.filter((item) => {
    if (item.roles) {
      return item.roles.includes(user);
    }
    return true;
  });

  return (
    <ul className="flex lg:flex-row sm:flex-col gap-8
      text-white font-body lg:relative sm:absolute sm:top-[120%]
      text-center left-[50%] -translate-x-[50%] lg:text-md sm:text-md
      sm:bg-cyan/30 backdrop-blur-lg lg:bg-brown sm:w-full py-4"
    >
      {filteredLinks.map((item, index) => {
        const isActive = location.pathname === `/${item.path}`;
        return (
          <li key={index} className="group">
            <Link
              to={`/${item.path}`}
              onClick={onLinkClick}
              className={`${isActive ? "text-cyan" : "text-gray-800 hover:text-gray-600"} cursor-pointer`}
            >
              {item.link}
            </Link>
            <div
              className={`mx-auto ${isActive ? "w-full bg-cyan" : "w-0 group-hover:w-full group-hover:bg-orange"} h-[2px] transition-all duration-500`}
            ></div>
          </li>
        );
      })}
    </ul>
  );
};

export default NavbarLink;
