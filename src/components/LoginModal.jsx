import React, { useState, useEffect } from 'react';
import { Mail, Lock, User, Building, MapPin, FileText, Eye, EyeOff, Check, AlertCircle, XCircle } from 'lucide-react';
import './LoginModal.css'; // Assuming you have a CSS file for styles

// Main AuthForm Component
const LoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    // State for Login Form
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [loginErrors, setLoginErrors] = useState({});

    // State for Signup Form
    const [signupName, setSignupName] = useState('');
    const [signupEmail, setSignupEmail] = useState('');
    const [signupPassword, setSignupPassword] = useState('');
    const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
    const [accountType, setAccountType] = useState('customer');
    const [gstNo, setGstNo] = useState('');
    const [shopName, setShopName] = useState('');
    const [address, setAddress] = useState('');
    const [termsChecked, setTermsChecked] = useState(false);
    const [signupErrors, setSignupErrors] = useState({});

    // State for modals
    const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
    const [showSocialSignInModal, setShowSocialSignInModal] = useState(false);
    const [socialSignInProvider, setSocialSignInProvider] = useState('');

    // Helper function to validate email format
    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    // Helper function to validate password strength
    const validatePasswordStrength = (password) => {
        const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]).{8,}$/;
        return re.test(password);
    };

    // Password strength indicator
    const getPasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/.test(password)) strength++;
        return strength;
    };

    const getStrengthClass = (strength) => {
        if (strength <= 2) return 'strength-weak';
        if (strength <= 3) return 'strength-fair';
        if (strength <= 4) return 'strength-good';
        return 'strength-strong';
    };

    const getStrengthText = (strength) => {
        if (strength <= 2) return 'Weak';
        if (strength <= 3) return 'Fair';
        if (strength <= 4) return 'Good';
        return 'Strong';
    };

    useEffect(() => {
        setSignupErrors({});
        const gstInput = document.getElementById('gst-no');
        const shopNameInput = document.getElementById('shop-name');
        const addressInput = document.getElementById('address');

        if (gstInput) {
            if (accountType === 'business') {
                gstInput.setAttribute('required', 'required');
            } else {
                gstInput.removeAttribute('required');
            }
        }

        if (shopNameInput) {
            if (accountType === 'business' || accountType === 'agency') {
                shopNameInput.setAttribute('required', 'required');
            } else {
                shopNameInput.removeAttribute('required');
            }
        }

        if (addressInput) {
            if (accountType === 'business' || accountType === 'agency') {
                addressInput.setAttribute('required', 'required');
            } else {
                addressInput.removeAttribute('required');
            }
        }
    }, [accountType]);

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        const errors = {};

        if (!loginEmail.trim()) {
            errors.email = 'Email is required.';
        } else if (!validateEmail(loginEmail)) {
            errors.email = 'Please enter a valid email address.';
        }

        if (!loginPassword.trim()) {
            errors.password = 'Password is required.';
        }

        setLoginErrors(errors);

        if (Object.keys(errors).length === 0) {
            try {
                console.log('Attempting login:', { email: loginEmail });
                
                // Call backend API
                const response = await fetch('http://localhost:3001/api/users/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: loginEmail,
                        password: loginPassword
                    })
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    console.log('✅ Login successful:', data);
                    
                    // Store token in localStorage
                    if (data.token) {
                        localStorage.setItem('authToken', data.token);
                        localStorage.setItem('userId', data.data.user._id);
                    }

                    // Create user data for the callback
                    const userData = {
                        id: data.data.user._id,
                        name: data.data.user.fullName || `${data.data.user.firstName} ${data.data.user.lastName}`,
                        email: data.data.user.email,
                        userType: data.data.user.userType,
                        profileImage: data.data.user.profilePicture || `https://placehold.co/40x40/E8F5E8/4A5D4A?text=${data.data.user.firstName.charAt(0)}${data.data.user.lastName.charAt(0)}`
                    };
                    
                    // Call the success callback if provided
                    if (onLoginSuccess) {
                        onLoginSuccess(userData);
                    }

                    // Close modal
                    onClose();
                } else {
                    console.error('❌ Login failed:', data.message);
                    setLoginErrors({ general: data.message || 'Login failed. Please try again.' });
                }
            } catch (error) {
                console.error('❌ Login error:', error);
                setLoginErrors({ general: 'Network error. Please check your connection and try again.' });
            }
        }
    };

    const handleSignupSubmit = async (e) => {
        e.preventDefault();
        const errors = {};

        if (!signupName.trim()) {
            errors.name = 'Full Name is required.';
        }

        if (!signupEmail.trim()) {
            errors.email = 'Email is required.';
        } else if (!validateEmail(signupEmail)) {
            errors.email = 'Please enter a valid email address.';
        }

        if (!signupPassword.trim()) {
            errors.password = 'Password is required.';
        } else if (!validatePasswordStrength(signupPassword)) {
            errors.password = 'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.';
        }

        if (!signupConfirmPassword.trim()) {
            errors.confirmPassword = 'Confirm password is required.';
        } else if (signupPassword !== signupConfirmPassword) {
            errors.confirmPassword = 'Passwords do not match.';
        }

        if (accountType === 'business') {
            if (!gstNo.trim()) {
                errors.gstNo = 'GST Number is required for Business accounts.';
            }
            if (!shopName.trim()) {
                errors.shopName = 'Shop/Company Name is required for Business accounts.';
            }
            if (!address.trim()) {
                errors.address = 'Address is required for Business accounts.';
            }
        } else if (accountType === 'agency') {
            if (!shopName.trim()) {
                errors.shopName = 'Agency Name is required for Agency accounts.';
            }
            if (!address.trim()) {
                errors.address = 'Address is required for Agency accounts.';
            }
        }

        if (!termsChecked) {
            errors.terms = 'You must agree to the Terms & Conditions.';
        }

        setSignupErrors(errors);

        if (Object.keys(errors).length === 0) {
            try {
                console.log('Attempting signup:', { email: signupEmail, userType: accountType });
                
                // Parse name into firstName and lastName
                const nameParts = signupName.trim().split(' ');
                const firstName = nameParts[0];
                const lastName = nameParts.slice(1).join(' ') || firstName; // Use firstName as lastName if only one name provided
                
                // Prepare signup data
                const signupData = {
                    email: signupEmail,
                    password: signupPassword,
                    firstName: firstName,
                    lastName: lastName,
                    userType: accountType === 'customer' ? 'Customer' : 
                             accountType === 'business' ? 'Business' : 
                             accountType === 'agency' ? 'Agency' : 'Customer'
                };

                // Add optional fields if provided
                if (accountType === 'business' || accountType === 'agency') {
                    if (address.trim()) {
                        // Parse address - this is a simplified version
                        signupData.address = {
                            street: address,
                            city: 'City', // You might want to add separate fields for these
                            state: 'State',
                            zipCode: '123456',
                            country: 'India'
                        };
                    }
                }

                // Call backend API
                const response = await fetch('http://localhost:3001/api/users/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(signupData)
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    console.log('✅ Signup successful:', data);
                    
                    // Store token in localStorage
                    if (data.token) {
                        localStorage.setItem('authToken', data.token);
                        localStorage.setItem('userId', data.data.user._id);
                    }

                    // Create user data for the callback
                    const userData = {
                        id: data.data.user._id,
                        name: data.data.user.fullName || `${data.data.user.firstName} ${data.data.user.lastName}`,
                        email: data.data.user.email,
                        userType: data.data.user.userType,
                        profileImage: data.data.user.profilePicture || `https://placehold.co/40x40/E8F5E8/4A5D4A?text=${data.data.user.firstName.charAt(0)}${data.data.user.lastName.charAt(0)}`
                    };
                    
                    // Call the success callback if provided
                    if (onLoginSuccess) {
                        onLoginSuccess(userData);
                    }

                    // Close modal
                    onClose();
                } else {
                    console.error('❌ Signup failed:', data.message);
                    
                    // Handle validation errors
                    if (data.errors && Array.isArray(data.errors)) {
                        const backendErrors = {};
                        data.errors.forEach(error => {
                            backendErrors[error.field] = error.message;
                        });
                        setSignupErrors(backendErrors);
                    } else {
                        setSignupErrors({ general: data.message || 'Signup failed. Please try again.' });
                    }
                }
            } catch (error) {
                console.error('❌ Signup error:', error);
                setSignupErrors({ general: 'Network error. Please check your connection and try again.' });
            }
        }
    };

    // Handle Forgot Password click
    const handleForgotPasswordClick = (e) => {
        e.preventDefault();
        setShowForgotPasswordModal(true);
    };

    // Simulated Google Sign-In
    const handleGoogleSignIn = () => {
        setSocialSignInProvider('Google');
        setShowSocialSignInModal(true);
        console.log('Simulating Sign in with Google...');
    };

    // Simulated Facebook Sign-In
    const handleFacebookSignIn = () => {
        setSocialSignInProvider('Facebook');
        setShowSocialSignInModal(true);
        console.log('Simulating Sign in with Facebook...');
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="modal-backdrop" onClick={onClose}>
                <div className="auth-container" onClick={(e) => e.stopPropagation()}>
                    <div className="auth-wrapper">
                        <div className="auth-card">
                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="modal-close-btn"
                                aria-label="Close"
                            >
                                <XCircle className="close-icon" />
                            </button>

                            {/* Logo/Brand Section */}
                            <div className="brand-section">
                                <div className="brand-avatar">
                                    <User className="brand-icon" />
                                </div>
                                <h1 className="brand-title">
                                    Welcome to PetCare
                                </h1>
                                <p className="brand-description">Your trusted pet companion platform</p>
                            </div>

                            {/* Toggle Buttons */}
                            <div className="toggle-container">
                                <button
                                    onClick={() => { setIsLoginMode(true); setLoginErrors({}); setSignupErrors({}); }}
                                    className={`toggle-button ${isLoginMode ? 'active' : ''}`}
                                >
                                    Login
                                </button>
                                <button
                                    onClick={() => { setIsLoginMode(false); setLoginErrors({}); setSignupErrors({}); }}
                                    className={`toggle-button ${!isLoginMode ? 'active' : ''}`}
                                >
                                    Sign Up
                                </button>
                            </div>

                            {isLoginMode ? (
                                /* Enhanced Login Form */
                                <form onSubmit={handleLoginSubmit} className="auth-form" noValidate>
                                    <h2 className="form-title">
                                        Welcome Back! 👋
                                    </h2>

                                    <div className="form-group">
                                        <label htmlFor="login-email" className="form-label">
                                            Email Address
                                        </label>
                                        <div className="input-wrapper">
                                            <Mail className="input-icon" />
                                            <input
                                                type="email"
                                                id="login-email"
                                                name="email"
                                                placeholder="your@example.com"
                                                className="form-input"
                                                value={loginEmail}
                                                onChange={(e) => setLoginEmail(e.target.value)}
                                                aria-describedby="login-email-error"
                                                aria-invalid={!!loginErrors.email}
                                            />
                                        </div>
                                        {loginErrors.email && (
                                            <div className="error-message">
                                                <AlertCircle className="error-icon" />
                                                {loginErrors.email}
                                            </div>
                                        )}
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="login-password" className="form-label">
                                            Password
                                        </label>
                                        <div className="input-wrapper">
                                            <Lock className="input-icon" />
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                id="login-password"
                                                name="password"
                                                placeholder="••••••••"
                                                className="form-input password-input"
                                                value={loginPassword}
                                                onChange={(e) => setLoginPassword(e.target.value)}
                                                aria-describedby="login-password-error"
                                                aria-invalid={!!loginErrors.password}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="password-toggle"
                                            >
                                                {showPassword ? <EyeOff className="toggle-icon" /> : <Eye className="toggle-icon" />}
                                            </button>
                                        </div>
                                        {loginErrors.password && (
                                            <div className="error-message">
                                                <AlertCircle className="error-icon" />
                                                {loginErrors.password}
                                            </div>
                                        )}
                                    </div>

                                    <div className="forgot-password-link">
                                        <a href="#" onClick={handleForgotPasswordClick} className="link">
                                            Forgot Password?
                                        </a>
                                    </div>

                                    <button type="submit" className="submit-button login-btn">
                                        Sign In
                                    </button>

                                    <div className="divider">
                                        <span className="divider-text">Or continue with</span>
                                    </div>

                                    <div className="social-buttons">
                                        <button
                                            type="button"
                                            onClick={handleGoogleSignIn}
                                            className="social-button"
                                        >
                                            <img src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_Google_2020_-_Icon_only.svg" alt="Google" className="social-icon" />
                                            <span className="social-text">Google</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleFacebookSignIn}
                                            className="social-button"
                                        >
                                            <img src="https://upload.wikimedia.org/wikipedia/en/0/04/Facebook_logo_no_background.png" alt="Facebook" className="social-icon" />
                                            <span className="social-text">Facebook</span>
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                /* Enhanced Signup Form */
                                <form onSubmit={handleSignupSubmit} className="auth-form" noValidate>
                                    <h2 className="form-title">
                                        Join Our Family! 🐾
                                    </h2>

                                    {/* Account Type Selection */}
                                    <div className="form-group">
                                        <label className="form-label">Account Type</label>
                                        <div className="account-type-grid" role="radiogroup" aria-labelledby="account-type-label">
                                            {[
                                                { value: 'customer', label: 'Customer', icon: User },
                                                { value: 'business', label: 'Business', icon: Building },
                                                { value: 'agency', label: 'Agency', icon: FileText }
                                            ].map(({ value, label, icon: Icon }) => (
                                                <label key={value} className="account-type-option">
                                                    <input
                                                        type="radio"
                                                        name="account_type"
                                                        value={value}
                                                        className="account-type-radio"
                                                        checked={accountType === value}
                                                        onChange={(e) => setAccountType(e.target.value)}
                                                    />
                                                    <div className={`account-type-card ${accountType === value ? 'selected' : ''}`}>
                                                        <Icon className="account-type-icon" />
                                                        <span className="account-type-label">{label}</span>
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="signup-name" className="form-label">
                                            Full Name
                                        </label>
                                        <div className="input-wrapper">
                                            <User className="input-icon" />
                                            <input
                                                type="text"
                                                id="signup-name"
                                                name="name"
                                                placeholder="John Doe"
                                                className="form-input"
                                                value={signupName}
                                                onChange={(e) => setSignupName(e.target.value)}
                                                aria-describedby="signup-name-error"
                                                aria-invalid={!!signupErrors.name}
                                            />
                                        </div>
                                        {signupErrors.name && (
                                            <div className="error-message">
                                                <AlertCircle className="error-icon" />
                                                {signupErrors.name}
                                            </div>
                                        )}
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="signup-email" className="form-label">
                                            Email Address
                                        </label>
                                        <div className="input-wrapper">
                                            <Mail className="input-icon" />
                                            <input
                                                type="email"
                                                id="signup-email"
                                                name="email"
                                                placeholder="your@example.com"
                                                className="form-input"
                                                value={signupEmail}
                                                onChange={(e) => setSignupEmail(e.target.value)}
                                                aria-describedby="signup-email-error"
                                                aria-invalid={!!signupErrors.email}
                                            />
                                        </div>
                                        {signupErrors.email && (
                                            <div className="error-message">
                                                <AlertCircle className="error-icon" />
                                                {signupErrors.email}
                                            </div>
                                        )}
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="signup-password" className="form-label">
                                            Password
                                        </label>
                                        <div className="input-wrapper">
                                            <Lock className="input-icon" />
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                id="signup-password"
                                                name="password"
                                                placeholder="••••••••"
                                                className="form-input password-input"
                                                value={signupPassword}
                                                onChange={(e) => setSignupPassword(e.target.value)}
                                                aria-describedby="signup-password-error"
                                                aria-invalid={!!signupErrors.password}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="password-toggle"
                                            >
                                                {showPassword ? <EyeOff className="toggle-icon" /> : <Eye className="toggle-icon" />}
                                            </button>
                                        </div>
                                        {signupPassword && (
                                            <div className="password-strength">
                                                <div className="strength-header">
                                                    <span>Password Strength</span>
                                                    <span className={`strength-text ${getStrengthClass(getPasswordStrength(signupPassword))}`}>
                                                        {getStrengthText(getPasswordStrength(signupPassword))}
                                                    </span>
                                                </div>
                                                <div className="strength-bar">
                                                    <div
                                                        className={`strength-progress ${getStrengthClass(getPasswordStrength(signupPassword))}`}
                                                        style={{ width: `${(getPasswordStrength(signupPassword) / 5) * 100}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        )}
                                        {signupErrors.password && (
                                            <div className="error-message">
                                                <AlertCircle className="error-icon" />
                                                {signupErrors.password}
                                            </div>
                                        )}
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="signup-confirm-password" className="form-label">
                                            Confirm Password
                                        </label>
                                        <div className="input-wrapper">
                                            <Lock className="input-icon" />
                                            <input
                                                type={showConfirmPassword ? "text" : "password"}
                                                id="signup-confirm-password"
                                                name="confirm-password"
                                                placeholder="••••••••"
                                                className="form-input password-input"
                                                value={signupConfirmPassword}
                                                onChange={(e) => setSignupConfirmPassword(e.target.value)}
                                                aria-describedby="signup-confirm-password-error"
                                                aria-invalid={!!signupErrors.confirmPassword}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="password-toggle"
                                            >
                                                {showConfirmPassword ? <EyeOff className="toggle-icon" /> : <Eye className="toggle-icon" />}
                                            </button>
                                            {signupConfirmPassword && signupPassword === signupConfirmPassword && (
                                                <div className="password-match-icon">
                                                    <Check className="check-icon" />
                                                </div>
                                            )}
                                        </div>
                                        {signupErrors.confirmPassword && (
                                            <div className="error-message">
                                                <AlertCircle className="error-icon" />
                                                {signupErrors.confirmPassword}
                                            </div>
                                        )}
                                    </div>

                                    {/* Business/Agency Specific Fields */}
                                    {(accountType === 'business' || accountType === 'agency') && (
                                        <div className="business-info">
                                            <h3 className="business-title">
                                                {accountType === 'business' ? 'Business Information' : 'Agency Information'}
                                            </h3>

                                            {accountType === 'business' && (
                                                <div className="form-group">
                                                    <label htmlFor="gst-no" className="form-label">
                                                        GST Number
                                                    </label>
                                                    <div className="input-wrapper">
                                                        <FileText className="input-icon" />
                                                        <input
                                                            type="text"
                                                            id="gst-no"
                                                            name="gst_no"
                                                            placeholder="e.g., 22AAAAA0000A1Z5"
                                                            className="form-input"
                                                            value={gstNo}
                                                            onChange={(e) => setGstNo(e.target.value)}
                                                            aria-describedby="gst-no-error"
                                                            aria-invalid={!!signupErrors.gstNo}
                                                        />
                                                    </div>
                                                    {signupErrors.gstNo && (
                                                        <div className="error-message">
                                                            <AlertCircle className="error-icon" />
                                                            {signupErrors.gstNo}
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            <div className="form-group">
                                                <label htmlFor="shop-name" className="form-label">
                                                    {accountType === 'agency' ? 'Agency Name' : 'Shop/Company Name'}
                                                </label>
                                                <div className="input-wrapper">
                                                    <Building className="input-icon" />
                                                    <input
                                                        type="text"
                                                        id="shop-name"
                                                        name="shop_name"
                                                        placeholder={accountType === 'agency' ? 'Your Agency Name' : 'Your Business Name'}
                                                        className="form-input"
                                                        value={shopName}
                                                        onChange={(e) => setShopName(e.target.value)}
                                                        aria-describedby="shop-name-error"
                                                        aria-invalid={!!signupErrors.shopName}
                                                    />
                                                </div>
                                                {signupErrors.shopName && (
                                                    <div className="error-message">
                                                        <AlertCircle className="error-icon" />
                                                        {signupErrors.shopName}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="address" className="form-label">
                                                    Address
                                                </label>
                                                <div className="input-wrapper textarea-wrapper">
                                                    <MapPin className="input-icon textarea-icon" />
                                                    <textarea
                                                        id="address"
                                                        name="address"
                                                        rows="3"
                                                        placeholder="Your full address"
                                                        className="form-input form-textarea"
                                                        value={address}
                                                        onChange={(e) => setAddress(e.target.value)}
                                                        aria-describedby="address-error"
                                                        aria-invalid={!!signupErrors.address}
                                                    ></textarea>
                                                </div>
                                                {signupErrors.address && (
                                                    <div className="error-message">
                                                        <AlertCircle className="error-icon" />
                                                        {signupErrors.address}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    <div className="terms-checkbox">
                                        <div className="checkbox-wrapper">
                                            <input
                                                type="checkbox"
                                                id="terms"
                                                name="terms"
                                                className="checkbox-input"
                                                checked={termsChecked}
                                                onChange={(e) => setTermsChecked(e.target.checked)}
                                                aria-describedby="terms-error"
                                                aria-invalid={!!signupErrors.terms}
                                            />
                                        </div>
                                        <div className="checkbox-label">
                                            <label htmlFor="terms" className="terms-text">
                                                I agree to the{' '}
                                                <a href="#" className="terms-link">
                                                    Terms & Conditions
                                                </a>{' '}
                                                and{' '}
                                                <a href="#" className="terms-link">
                                                    Privacy Policy
                                                </a>
                                            </label>
                                        </div>
                                    </div>
                                    {signupErrors.terms && (
                                        <div className="error-message">
                                            <AlertCircle className="error-icon" />
                                            {signupErrors.terms}
                                        </div>
                                    )}

                                    <button type="submit" className="submit-button signup-btn">
                                        Create Account
                                    </button>

                                    <div className="divider">
                                        <span className="divider-text">Or sign up with</span>
                                    </div>

                                    <div className="social-buttons">
                                        <button type="button" className="social-button">
                                            <img src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_Google_2020_-_Icon_only.svg" alt="Google" className="social-icon" />
                                            <span className="social-text">Google</span>
                                        </button>
                                        <button type="button" className="social-button">
                                            <img src="https://upload.wikimedia.org/wikipedia/en/0/04/Facebook_logo_no_background.png" alt="Facebook" className="social-icon" />
                                            <span className="social-text">Facebook</span>
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Forgot Password Modal */}
            {showForgotPasswordModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button
                            onClick={() => setShowForgotPasswordModal(false)}
                            className="modal-close"
                            aria-label="Close"
                        >
                            <XCircle className="close-icon" />
                        </button>
                        <h3 className="modal-title">Forgot Password?</h3>
                        <p className="modal-description">
                            Enter your email address and we'll send you a link to reset your password.
                        </p>
                        <input
                            type="email"
                            placeholder="your@example.com"
                            className="modal-input"
                        />
                        <button
                            onClick={() => {
                                alert('Password reset link sent! (Simulated)');
                                setShowForgotPasswordModal(false);
                            }}
                            className="modal-button"
                        >
                            Send Reset Link
                        </button>
                    </div>
                </div>
            )}

            {/* Social Sign-In Modal */}
            {showSocialSignInModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button
                            onClick={() => setShowSocialSignInModal(false)}
                            className="modal-close"
                            aria-label="Close"
                        >
                            <XCircle className="close-icon" />
                        </button>
                        <h3 className="modal-title">Sign In with {socialSignInProvider}</h3>
                        <p className="modal-description">
                            You are attempting to sign in using your {socialSignInProvider} account.
                            In a real application, you would be redirected to {socialSignInProvider}'s login page.
                        </p>
                        <button
                            onClick={() => {
                                alert(`Successfully signed in with ${socialSignInProvider}! (Simulated)`);
                                setShowSocialSignInModal(false);
                            }}
                            className="modal-button"
                        >
                            Continue
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default LoginModal;
