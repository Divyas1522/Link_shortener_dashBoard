import React, { useEffect, useState } from 'react';


const DashboardContent = () => {
  const [analytics, setAnalytics] = useState(null);
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);


  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BASE_URL}/analytics/summary`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`
          },
        }
        );
        const res2 = await fetch(`${import.meta.env.VITE_BASE_URL}/link/recent`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`
          },
        }
        );

        if (!res.ok || !res2.ok) {
          throw new Error(`Failed with status ${res.status}`);
        }

        const data = await res.json();
        const data2 = await res2.json();
        console.log("mydata", data2)

        setAnalytics(data);
        setLinks(data2);

        console.log("Analytics Response:", data); // Log the data to debug
        console.log("Links Data:", data2); // Log the data to debug

      } catch (err) {
        console.error("Error fetching analytics:", err);
      } finally {
        setLoading(false);
      }
  
    };

    fetchData();
  }, [token]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShow(true);
    }, 100);

    return () => clearTimeout(timeout);
    },[])

  if (loading || !analytics) {
    return <div className="text-center text-gray-400 p-8">Loading analytics...</div>;
  }

  return (
    <div className="space-y-10 ">
      <div>
        <h1 className="mt-12 sm:mt-2 text-4xl font-bold text-purple-400 mb-1">Welcome to Your Dashboard</h1>
        <p className="text-gray-400 text-sm">Manage your links with powerful insights.</p>
      </div>

      {/* Stats Cards */}
      <div className={`grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-4 gap-6`}>
        <div className={`bg-gradient-to-br from-pink-700 to-white p-6 rounded-2xl shadow-lg transition-all duration-700 transform ease-in-out ${show ? "scale-100 opacity-100" : "scale-45 opacity-0"}`}>
          <h3 className="text-lg font-medium text-white mb-1">Total Links</h3>
          <p className="text-3xl font-bold text-white">{analytics.totalLinks}</p>
        </div>
        <div className={`bg-gradient-to-br from-purple-700 to-white p-6 rounded-2xl shadow-lg transition-all duration-700 transform ease-in-out ${show ? "scale-100 opacity-100" : "scale-45 opacity-0"}`}>
          <h3 className="text-lg font-medium text-white mb-1">Total Clicks</h3>
          <div className="text-4xl font-bold">{analytics.totalClicks}</div>
        </div>

        {/* Most Active Day */}
        <div className={`bg-gradient-to-br from-green-600 to-white p-6 rounded-2xl shadow-xl text-white transition-all duration-700 transform ease-in-out ${show ? "scale-100 opacity-100" : "scale-45 opacity-0"}`}>
          <h3 className="text-lg font-medium text-white mb-1">Most Active Day</h3>
          <p className="text-2xl font-bold">{analytics.mostActiveDay.day}</p>
          <p className="text-sm mt-2">{analytics.mostActiveDay.clicks}</p>
        </div>

        {/* Devices Used */}
        <div className={`bg-gradient-to-br from-blue-600 to-white p-6 rounded-2xl shadow-lg transition-all duration-700 transform ease-in-out ${show ? "scale-100 opacity-100" : "scale-45 opacity-0"} `}>
          <h3 className="text-lg font-medium text-white mb-1">Device Breakdown</h3>
          <ul className="text-sm space-y-1 mt-2">
            <li>📱 Mobile: <span className="font-semibold">{analytics.deviceStats?.Mobile ?? 0}</span></li>
            <li>💻 Desktop: <span className="font-semibold">{analytics.deviceStats?.Desktop ?? 0}</span></li>
            <li>📟 Tablet: <span className="font-semibold">{analytics.deviceStats?.Tablet ?? 0}</span></li>
          </ul>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-16 w-full px-4 sm:px-6 md:px-8">
        <h2 className="text-2xl font-semibold text-purple-300 mb-8">Recent Links</h2>

        <div className="overflow-x-auto rounded-xl shadow-md">
          <table className="min-w-[600px] w-full bg-gray-800 text-sm">
            <thead className="bg-gray-700 text-purple-100">
              <tr>
                <th className="px-4 py-3 text-left whitespace-nowrap">Short URL</th>
                <th className="px-4 py-3 text-left whitespace-nowrap">Clicks</th>
                <th className="px-4 py-3 text-left whitespace-nowrap">Created</th>
              </tr>
            </thead>
            <tbody className="text-gray-300">
              {links.slice(0, 5).map((link, index) => (
                <tr
                  key={index}
                  className="border-t border-gray-700 hover:bg-gray-700 transition"
                >
                  <td className="px-4 py-3 break-all">{link.shortUrl}</td>
                  <td className="px-4 py-3">{link.clicks}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {new Date(link.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default DashboardContent;
