import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { FaLink, FaPlus, FaSignOutAlt, FaThLarge, FaChartLine, FaBars } from 'react-icons/fa';

const Dashboard = () => {
  const navigate = useNavigate();
  const [showSidebar, setShowSidebar] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const toggleSidebar = () => {
    setShowSidebar(prev => !prev);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-900 text-white relative">

      {/* Topbar (mobile only) */}
      <div className="flex items-center justify-between md:hidden px-4 py-3 bg-[#1f2937] shadow-md fixed z-20 w-full">
        <h2 className="text-xl font-bold text-violet-400 font-serif">Link Shortener Dashboard</h2>
        <button onClick={toggleSidebar} className="text-violet-400 text-2xl">
          <FaBars />
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed md:static z-30 w-64 bg-[#18283d] h-screen top-0 left-0 p-6 flex flex-col border-r border-gray-700 shadow-md transform ${showSidebar ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <h2 className="sm:mt-0 mt-1 z-21 text-2xl font-extrabold text-center text-sky-300 mb-10 tracking-wider uppercase">
          Link Shortener and Analytics DashBoard
        </h2>

        <nav className="flex flex-col font-serif gap-4 text-gray-300 font-medium">
          <NavLink
            to=""
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                ? 'bg-cyan-600 text-white shadow-md'
                : 'hover:bg-gray-700 hover:text-cyan-300 hover:translate-x-1'
              }`
            }
            onClick={() => setShowSidebar(false)}
          >
            <FaThLarge className="text-lg" />
            Dashboard
          </NavLink>

          <NavLink
            to="links"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                ? 'bg-cyan-600 text-white shadow-md'
                : 'hover:bg-gray-700 hover:text-cyan-300 hover:translate-x-1'
              }`
            }
            onClick={() => setShowSidebar(false)}
          >
            <FaLink className="text-lg" />
            My Links
          </NavLink>

          <NavLink
            to="create"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                ? 'bg-cyan-600 text-white shadow-md'
                : 'hover:bg-gray-700 hover:text-cyan-300 hover:translate-x-1'
              }`
            }
            onClick={() => setShowSidebar(false)}
          >
            <FaPlus className="text-lg" />
            Create Link
          </NavLink>

          <NavLink
            to="analytics"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                ? 'bg-cyan-600 text-white shadow-md'
                : 'hover:bg-gray-700 hover:text-cyan-300 hover:translate-x-1'
              }`
            }
            onClick={() => setShowSidebar(false)}
          >
            <FaChartLine className="text-lg" />
            Analytics
          </NavLink>

          <button
            onClick={handleLogout}
            className="mt-auto flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-600 hover:text-white transition-all duration-200"
          >
            <FaSignOutAlt className="text-lg" />
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      {/* Sidebar or mobile-only area */}
      {showSidebar && (
        <div
          className="absolute inset-0 z-10 bg-black/50 backdrop-blur-md transition duration-300 md:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}

      <main className="flex-1 p-6 overflow-y-auto h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;

