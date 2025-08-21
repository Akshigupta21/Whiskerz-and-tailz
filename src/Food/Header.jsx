import React, { useState, useEffect, useCallback } from 'react'
import { ShoppingCart, MapPin, User, Search, Menu, X, Heart, Bell, Sun, Moon } from 'lucide-react'
import './Header.css'

const Header = ({
  onNavigateHome,
  onNavigateProductIdeaGenerator,
  onNavigateWishlist,
  onNavigateCart,
  cartItemsCount = 0,
  wishlistItemsCount = 0,
}) => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [darkMode, setDarkMode] = useState(false)
  const [location, setLocation] = useState('Detecting...')
  const [locationList, setLocationList] = useState([
    'Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 'Zaloz'
  ])

  const navItems = [
    { name: 'Home', onClick: onNavigateHome },
    { name: 'About Us', onClick: () => console.log('Navigate to About') },
    { name: 'Services', onClick: () => console.log('Navigate to Services') },
    { name: 'Food', onClick: () => console.log('Navigate to Food') },
    { name: 'Products', onClick: onNavigateHome },
    { name: 'Blog', onClick: () => window.location.href = '/blog' },
    { name: 'Contact Us', onClick: () => console.log('Navigate to Contact') },

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

  const handleLocationChange = (e) => setLocation(e.target.value)

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
            <div className="header__logo-icon">
              <ShoppingCart size={24} />
            </div>
            <div className="header__logo-text">
              <span className="header__logo-main">PETTO</span>
              <p className="header__logo-sub">Pet Paradise</p>
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
                <button className="header__user-btn header__user-btn--outline">
                  <User size={16} className="header__user-icon" />
                  Sign In
                </button>
                <button className="header__user-btn header__user-btn--primary">
                  Join Now
                </button>
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
                <button className="header__user-btn header__user-btn--outline">
                  Sign In
                </button>
                <button className="header__user-btn header__user-btn--primary">
                  Join Now
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
