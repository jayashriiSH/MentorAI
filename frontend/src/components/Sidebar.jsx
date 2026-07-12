import { NavLink } from "react-router-dom";

function Sidebar() {

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
      name: "Analytics",
      path: "/analytics",
    },
    {
      name: "Memory",
      path: "/memory",
    },
    {
      name: "Profile",
      path: "/profile",
    },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white h-screen">

      <div className="p-6 text-2xl font-bold">

        MentorAI

      </div>

      {menu.map((item) => (

        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `block px-6 py-4 hover:bg-slate-700 ${
              isActive ? "bg-blue-600" : ""
            }`
          }
        >

          {item.name}

        </NavLink>

      ))}

    </div>
  );
}

export default Sidebar;