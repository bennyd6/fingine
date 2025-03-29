import './App.css'
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/navbar'
import Home from './home'
import Signup from './components/signup';
import Login from './components/login';

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
        <Route path="/login" element={token ? <Navigate to="/" /> : <Login />} />
        <Route path="/signup" element={token ? <Navigate to="/" /> : <Signup />} />
        <Route path="*" element={<h1>Page Not Found</h1>} />
      </Routes>
    </>
  )
}

export default App
