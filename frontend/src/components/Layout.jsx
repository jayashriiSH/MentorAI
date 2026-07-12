import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function Layout({ children }) {

  return (
    <div className="flex">

      <Sidebar />

      <div className="flex-1">

        <Navbar />

        <div className="p-8 bg-slate-100 min-h-screen">

          {children}

        </div>

      </div>

    </div>
  );
}

export default Layout;