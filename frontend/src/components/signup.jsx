import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './signup.css';

export default function Signup() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: '',
        phone: '',
        organization: ''
    });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const validateForm = () => {
        let newErrors = {};
        if (!formData.name.trim()) newErrors.name = "Name is required.";
        if (!formData.email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/))
            newErrors.email = "Invalid email format.";
        if (formData.password.length < 6)
            newErrors.password = "Password must be at least 6 characters.";
        if (formData.password !== formData.confirmPassword)
            newErrors.confirmPassword = "Passwords do not match.";
        if (!formData.role)
            newErrors.role = "Please select a role.";
        if (formData.phone && !formData.phone.match(/^[0-9]{10}$/)) // Simple phone validation
            newErrors.phone = "Invalid phone number.";
        if (formData.organization && formData.organization.length < 3)
            newErrors.organization = "Organization name should be at least 3 characters.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const response = await axios.post('http://localhost:3000/api/auth/register', {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: formData.role,
                phone: formData.phone,
                organization: formData.organization
            });

            if (response.data && response.data.token) {
                localStorage.setItem('token', response.data.token);
                alert('Signup successful!');
                navigate('/'); // Redirect to the dashboard after successful signup
            } else {
                setErrors({ apiError: "Unexpected response from server." });
            }
        } catch (error) {
            console.error("Signup error:", error.response?.data || error.message);
            setErrors({ apiError: error.response?.data?.message || "Signup failed! Please try again." });
        }
    };

    return (
        <div className="signup-container">
            <div className="signup-card">
                <h2>Signup</h2>
                <form className='signup-form' onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="name"
                        placeholder='Enter your name'
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className='input-field'
                    />
                    {errors.name && <p className="error-text">{errors.name}</p>}

                    <input
                        type="email"
                        name="email"
                        placeholder='Enter your email'
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className='input-field'
                    />
                    {errors.email && <p className="error-text">{errors.email}</p>}

                    <input
                        type="password"
                        name="password"
                        placeholder='Enter your password'
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className='input-field'
                    />
                    {errors.password && <p className="error-text">{errors.password}</p>}

                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder='Confirm your password'
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        className='input-field'
                    />
                    {errors.confirmPassword && <p className="error-text">{errors.confirmPassword}</p>}

                    <input
                        type="text"
                        name="phone"
                        placeholder='Enter your phone number'
                        value={formData.phone}
                        onChange={handleChange}
                        className='input-field'
                    />
                    {errors.phone && <p className="error-text">{errors.phone}</p>}

                    <input
                        type="text"
                        name="organization"
                        placeholder='Enter your organization name'
                        value={formData.organization}
                        onChange={handleChange}
                        className='input-field'
                    />
                    {errors.organization && <p className="error-text">{errors.organization}</p>}

                    <div className="role-selection">
                        <p>Select your role:</p>
                        <div className="select-role-container">
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="select-role"
                            >
                                <option value="">Select a role</option>
                                <option value="freelancer">Freelancer</option>
                                <option value="small_business">Small Business</option>
                                <option value="ecommerce">E-commerce</option>
                                <option value="corporate">Corporate</option>
                                <option value="accountant">Accountant</option>
                            </select>
                        </div>
                    </div>
                    {errors.role && <p className="error-text">{errors.role}</p>}

                    {errors.apiError && <p className="error-text">{errors.apiError}</p>}

                    <button className='signup-button' type="submit">Register</button>
                </form>
                <p><a href="/login" className="login-link">Have an account?</a></p>
            </div>
        </div>
    );
}
