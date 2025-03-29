import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import './navbar.css';
import Logo from '../assets/fin-logo.png';

export default function Navbar() {
    const [userName, setUserName] = useState('');
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const dropdownRef = useRef(null); // Reference for detecting outside clicks

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
            <img src={Logo} alt="Logo" />
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/analyze">Analyze</Link>
            <Link to="/contact">Contact Us</Link>
            
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
