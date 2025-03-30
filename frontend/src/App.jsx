import './App.css'
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/navbar'
import Home from './home'
import Signup from './components/signup';
import Login from './components/login';
import Dashboard from './dashboard';
import Chatbot from './components/chatbot';

function App() {
  const token = localStorage.getItem('token');
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
  return (
    <>
      {!isAuthPage && (
        <>
          <Navbar></Navbar>
        </>
      )}

      <Routes>
        <Route path="/" element={token ? <Home /> : <Navigate to="/login" />} />
        <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/chat" element={token ? <Chatbot /> : <Navigate to="/login"/>} />
        <Route path="*" element={<h1>Page Not Found</h1>} />
      </Routes>
    </>
  )
}

export default App
