import React, { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend
} from "recharts";

const Analytics = () => {

  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BASE_URL}/analytics/summary`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        console.log(token);

        const data = await res.json();
        setAnalytics(data);
        console.log("Analytics Response:", data); // Log the data to debug
      } catch (err) {
        console.error("Error fetching analytics:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  if (loading || !analytics) {
    return <div className="text-center text-gray-400 p-8">Loading analytics...</div>;
  }

  return (
    <div className="grid sm:grid-col-2  p-4 max-h-screen bg-[#0f111a] text-white">
      <h1 className="text-3xl font-bold  text-transparent bg-gradient-to-t from-blue-500 to-orange-500 bg-clip-text mt-5 mb-7">Analytics Dashboard</h1>

      {/* Clicks Over Time */}
      <div className="bg-[#1c1f2a] p-5 mb-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4 text-blue-300">Clicks Over Time</h2>
        {analytics.clicksOverTime.length > 0 && analytics.clicksOverTime[0].date !== "No Data" ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.clicksOverTime}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="clicks" fill="#00a6fb" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center text-gray-400">No click data available over time.</p>
        )}
      </div>

      {/* Device / Browser / OS Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatPie title="Device Stats" data={analytics.deviceStats} />
        {console.log("Device Stats:", analytics.deviceStats)} 
        {console.log("Browser Stats:", analytics.browserStats)} 
        {console.log("OS Stats:", analytics.osStats)} 
        <StatPie title="Browser Stats" data={analytics.browserStats} />
        <StatPie title="OS Stats" data={analytics.osStats} />
      </div>
    </div >
  );
};

const COLORS = [
  '#FF8042',
  '#FFBE0B', // Golden amber
  '#0088FE',
  '#FF006E', // Vivid magenta
  '#7AE582', // Bright green
  '#00BBF9', // Electric sky blue
]

const StatPie = ({ title, data }) => {
  const chartData = Object.entries(data).map(([name, value]) => ({ name, value }));

  return (
    <div className="bg-[#1c1f2a] p-4 rounded-xl shadow max-h-screen">
      <h3 className="text-lg font-semibold mb-4 text-blue-300">{title}</h3>
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" align="center" iconType="circle" iconSize={10} />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-center text-gray-400">No data available.</p>
      )}
    </div>
  );
};


export default Analytics;

