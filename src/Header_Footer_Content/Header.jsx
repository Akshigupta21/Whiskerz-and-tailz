import React, { useState, useEffect, useCallback } from 'react'
import { ShoppingCart, MapPin, User, Search, Menu, X, Heart, Bell, Sun, Moon } from 'lucide-react'
import './Header.css'
import LoginModal from '../components/LoginModal'

const Header = ({
  onNavigateHome,
  onNavigateWishlist,
  onNavigateCart,
  onNavigateFood,
  onNavigateProduct,
  onNavigateService,
  onNavigateAbout,
  onNavigateContact,
  onNavigateBlog,
  onNavigateProfile,
  cartItemsCount = 0,
  wishlistItemsCount = 0,
}) => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [darkMode, setDarkMode] = useState(false)
  const [location, setLocation] = useState('Detecting...')
  const [locationList, setLocationList] = useState([''])
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false) // Track login status
  const [currentUser, setCurrentUser] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    profileImage: 'https://placehold.co/40x40/E8F5E8/4A5D4A?text=JD'
  })

  const navItems = [
    { name: 'Home', onClick: onNavigateHome },
    { name: 'About Us', onClick: onNavigateAbout },
    { name: 'Services', onClick: onNavigateService },
    { name: 'Food', onClick: onNavigateFood },
    { name: 'Products', onClick: onNavigateProduct },
    { name: 'Blog', onClick: onNavigateBlog },
    { name: 'Contact Us', onClick: onNavigateContact },
  ]

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Dark mode effect
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode')
    } else {
      document.body.classList.remove('dark-mode')
    }
  }, [darkMode])

  // Geolocation functionality
  const getLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setLocation('Location not supported')
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
          )

          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`)
          }

          const data = await res.json()

          const detectedCity =
            data.address.city ||
            data.address.town ||
            data.address.village ||
            data.address.county ||
            data.address.state ||
            data.address.country ||
            'Unknown Location'

          setLocation(detectedCity)

          setLocationList((prevList) => {
            if (!prevList.includes(detectedCity)) {
              return [detectedCity, ...prevList]
            }
            return prevList
          })

        } catch (e) {
          console.error("Error fetching location from Nominatim:", e)
          setLocation('Location detection failed')
        }
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocation('Location access denied')
            console.warn("User denied the request for Geolocation.")
            break
          case error.POSITION_UNAVAILABLE:
            setLocation('Location unavailable')
            console.warn("Location information is unavailable.")
            break
          case error.TIMEOUT:
            setLocation('Location request timed out')
            console.warn("The request to get user location timed out.")
            break
          case error.UNKNOWN_ERROR:
            setLocation('An unknown location error occurred')
            console.warn("An unknown error occurred.")
            break
          default:
            setLocation('Location error')
            break
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    )
  }, [])

  useEffect(() => {
    getLocation()
  }, [getLocation])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProfileDropdown && !event.target.closest('.header__profile-menu')) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileDropdown]);

  const handleLocationChange = (e) => setLocation(e.target.value)

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser({
      name: '',
      email: '',
      profileImage: ''
    });
    setShowProfileDropdown(false);
  }

  // Prevent hydration mismatch if window is not available
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <header className={`header ${isScrolled ? 'header--scrolled' : ''}`}>
      <div className="header__container">
        <div className="header__inner">
          {/* Logo */}
          <div className="header__logo" onClick={onNavigateHome}>
            <div className="header__logo-text">
              <p>Wiskerz & Tailz </p>
            </div>
          </div>

        

          {/* Desktop Nav */}
          <nav className="header__nav">
            {navItems.map((item, index) => (
              <button
                key={index}
                onClick={item.onClick}
                className="header__nav-link"
              >
                {item.name}
              </button>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="header__right">
            <div className="header__location">
              <MapPin className="header__location-icon" size={16} />
              <select 
                value={location} 
                onChange={handleLocationChange}
                className="header__location-select"
                disabled={location === 'Detecting...' || location.includes('Location')}
              >
                <option value={location} disabled={location === 'Detecting...' || location.includes('Location')}>
                  {location}
                </option>
                {locationList
                  .filter((loc) => loc !== location)
                  .map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
              </select>
            </div>
            <div className="header__actions">
              <button 
                className="header__action-btn header__dark-mode-btn"
                onClick={() => setDarkMode((prev) => !prev)}
                aria-label="Toggle dark mode"
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button className="header__action-btn">
                <Bell size={20} />
                <span className="header__badge header__badge--red">3</span>
              </button>
              <button
                onClick={onNavigateWishlist}
                className="header__action-btn"
              >
                <Heart size={20} />
                {wishlistItemsCount > 0 && (
                  <span className="header__badge header__badge--orange">{wishlistItemsCount}</span>
                )}
              </button>
              <button 
                onClick={onNavigateCart}
                className="header__action-btn"
              >
                <ShoppingCart size={20} />
                {cartItemsCount > 0 && (
                  <span className="header__badge header__badge--orange">{cartItemsCount}</span>
                )}
              </button>
              <div className="header__user">
                {isLoggedIn ? (
                  <div className="header__profile-menu">
                    <button 
                      className="header__profile-btn"
                      onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                    >
                      <img 
                        src={currentUser.profileImage} 
                        alt="Profile" 
                        className="header__profile-image"
                      />
                      <span className="header__profile-name">{currentUser.name}</span>
                    </button>
                    
                    {showProfileDropdown && (
                      <div className="header__profile-dropdown">
                        <button 
                          className="header__profile-dropdown-item"
                          onClick={() => {
                            onNavigateProfile && onNavigateProfile();
                            setShowProfileDropdown(false);
                          }}
                        >
                          <User size={16} />
                          My Profile
                        </button>
                        <button 
                          className="header__profile-dropdown-item"
                          onClick={handleLogout}
                        >
                          <X size={16} />
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <button 
                      className="header__user-btn header__user-btn--outline"
                      onClick={() => setShowLoginModal(true)}
                    >
                      <User size={16} className="header__user-icon" />
                      Sign In
                    </button>
                    <button 
                      className="header__user-btn header__user-btn--primary"
                      onClick={() => setShowLoginModal(true)}
                    >
                      Join Now
                    </button>
                  </>
                )}
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="header__menu-toggle"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="header__search header__search--mobile">
          <div className="header__search-wrap">
            <Search className="header__search-icon" size={18} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="header__search-input"
            />
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="header__mobile-menu">
            <nav className="header__mobile-nav">
              {navItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    item.onClick && item.onClick()
                    setIsMobileMenuOpen(false)
                  }}
                  className="header__mobile-nav-link"
                >
                  {item.name}
                </button>
              ))}
              <div className="header__mobile-buttons">
                {isLoggedIn ? (
                  <button 
                    className="header__user-btn header__user-btn--primary"
                    onClick={() => {
                      onNavigateProfile && onNavigateProfile();
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <User size={16} />
                    My Profile
                  </button>
                ) : (
                  <>
                    <button 
                      className="header__user-btn header__user-btn--outline"
                      onClick={() => {
                        setShowLoginModal(true);
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      Sign In
                    </button>
                    <button 
                      className="header__user-btn header__user-btn--primary"
                      onClick={() => {
                        setShowLoginModal(true);
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      Join Now
                    </button>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
      
      {/* Login Modal */}
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
        onLoginSuccess={(user) => {
          setIsLoggedIn(true);
          setCurrentUser(user);
          setShowLoginModal(false);
        }}
      />
    </header>
  )
}

export default Header
