import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import './navbar.css';
import Logo from '../assets/fin-logo.png';

export default function Navbar() {
    const [userName, setUserName] = useState('');
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const dropdownRef = useRef(null); // Reference for detecting outside clicks
    const location = useLocation(); // Get the current route

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await fetch('http://localhost:3000/api/auth/getuser', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (!response.ok) {
                        console.error('Failed to fetch user:', response.statusText);
                        return;
                    }

                    const data = await response.json();
                    if (!data) {
                        console.error('Empty response data received');
                        return;
                    }

                    setUserName(data);
                } catch (error) {
                    console.error('Error fetching user:', error);
                }
            } else {
                console.log('No token found in localStorage');
            }
        };

        fetchUser();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    const toggleDropdown = () => {
        setDropdownVisible((prev) => !prev); // Toggle dropdown visibility
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownVisible(false);
            }
        }

        if (dropdownVisible) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownVisible]);

    return (
        <div className="nav-main">
            <a href="/"><img src={Logo} alt="Logo" /></a>
            <Link to="/dashboard" className={location.pathname === "/dashboard" ? "active-link" : ""}>Dashboard</Link>
            <Link to="/analyze" className={location.pathname === "/analyze" ? "active-link" : ""}>Analyze</Link>
            <Link to="/contact" className={location.pathname === "/contact" ? "active-link" : ""}>Contact Us</Link>

            <div className="user-dropdown" onClick={toggleDropdown} ref={dropdownRef}>
                <span>{userName || "Loading..."}</span>
                {dropdownVisible && (
                    <div className="dropdown-menu">
                        <button className="dropdown-btn" onClick={handleLogout}>Logout</button>
                    </div>
                )}
            </div>
        </div>
    );
}
