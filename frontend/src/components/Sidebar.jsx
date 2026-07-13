import React from "react";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const menu = [
    {
      name: "Dashboard",
      path: "/dashboard",
    },
    {
      name: "Documents",
      path: "/documents",
    },
    {
      name: "AI Tutor",
      path: "/chat",
    },
    {
      name: "Learning",
      path: "/learning",
    },
    {
      name: "Profile",
      path: "/profile",
    },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white h-screen shrink-0 flex flex-col">
      <div className="p-6 text-2xl font-bold border-b border-slate-800">
        MentorAI
      </div>
      <nav className="flex-1 py-6 space-y-1">
        {menu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `block px-6 py-3.5 text-sm font-semibold hover:bg-slate-800/60 transition ${
                isActive
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "text-slate-300"
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}