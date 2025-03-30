import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import "./dashboard.css";
import ai from './assets/ai.png'
import { useNavigate } from "react-router-dom";

const data = [
  { month: "Jan", users: 200, revenue: 4000 },
  { month: "Feb", users: 300, revenue: 5000 },
  { month: "Mar", users: 500, revenue: 7000 },
  { month: "Apr", users: 600, revenue: 8000 },
  { month: "May", users: 800, revenue: 10000 },
];

const pieData = [
  { name: "", value: 60 },
  { name: "", value: 40 },
];

const COLORS = ["#0088FE", "#00C49F"];

const navigate=useNavigate();
const handleClick=()=>{
  navigate('/chat');
}

export default function Dashboard() {
  return (

    <div className="dashboard-container">
      <h1>Dashboard Insights</h1>

      <div className="chart-container">
        {/* Line Chart for Users */}
        <div className="chart">
          <h3>User Growth</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="users" stroke="#007bff" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart for Revenue */}
        <div className="chart">
          <h3>Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart for User Type */}
        <div className="chart">
          <h3>User Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" dataKey="value">
                {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="dashboard-2">
        <div className="chat-prom">
            <img src={ai} alt="" />
            {/* <div className="chat-prom-in"> */}
                <h1>Ask Finora!</h1>
                <div className="b-grad">
                    <button onClick={handleClick}>Chat Now!</button>
                </div>
            {/* </div> */}
        </div>
      </div>
    </div>
  );
}
