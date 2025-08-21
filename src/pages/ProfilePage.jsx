import React, { useState, useEffect } from 'react';
import { 
  User, Edit3, Save, X, Camera, Heart, ShoppingBag, Calendar, MapPin, Phone, Mail, 
  Lock, Bell, Shield, Trash2, Upload, Star, Award, TrendingUp, Activity,
  Sparkles, Zap, Crown, Plus
} from 'lucide-react';
import ApiService from '../Services/api';
import config from '../config/api';
import './ProfilePage.css';

const ProfilePage = ({ onNavigateHome, userId }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [pets, setPets] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  
  // Business-specific state
  const [businessProducts, setBusinessProducts] = useState([]);
  const [businessServices, setBusinessServices] = useState([]);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  
  // Agency-specific state
  const [agencyAnimals, setAgencyAnimals] = useState([]);
  const [showAnimalModal, setShowAnimalModal] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState(null);

  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({});
  const [selectedPet, setSelectedPet] = useState(null);
  const [showPetModal, setShowPetModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newPet, setNewPet] = useState({
    name: '',
    type: 'Dog',
    breed: '',
    age: '',
    weight: '',
    birthDate: '',
    microchipId: '',
    veterinarian: '',
    allergies: '',
    medications: '',
    notes: '',
    image: ''
  });

  // Business form states
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    price: '',
    description: '',
    image: '',
    inStock: true,
    brand: ''
  });

  const [newService, setNewService] = useState({
    name: '',
    category: '',
    price: '',
    duration: '',
    description: '',
    image: '',
    availability: true
  });

  // Agency form states
  const [newAnimal, setNewAnimal] = useState({
    name: '',
    species: 'Dog',
    breed: '',
    age: '',
    gender: '',
    size: '',
    color: '',
    description: '',
    medicalHistory: '',
    vaccinated: false,
    spayedNeutered: false,
    image: '',
    adoptionFee: '',
    location: ''
  });

  // API base URL - adjust according to your backend
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

  // Fetch user data from database
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // Get user ID from props, localStorage, or authentication context
        const userIdToFetch = userId || localStorage.getItem('userId') || 'current';
        
        // Fetch user profile using API service (includes userType from database)
        const userData = await ApiService.getUserProfile(userIdToFetch);
        
        // Ensure userType is set from database
        if (!userData.userType) {
          console.warn('UserType not found in database, defaulting to Customer');
          userData.userType = 'Customer';
        }
        
        setCurrentUser(userData);
        setEditedUser(userData);

        // Fetch user's pets
        try {
          const petsData = await ApiService.getUserPets(userIdToFetch);
          setPets(petsData);
        } catch (err) {
          console.log('No pets data available');
          setPets([]);
        }

        // Fetch order history
        try {
          const ordersData = await ApiService.getUserOrders(userIdToFetch);
          setOrderHistory(ordersData);
        } catch (err) {
          console.log('No order history available');
          // Set fallback demo order data if API fails
          setOrderHistory([
            {
              id: 'ORD-001',
              date: '2024-01-20',
              total: 89.99,
              status: 'Delivered',
              items: 3,
              products: [
                { name: 'Premium Dog Food', quantity: 2, price: 45.99 },
                { name: 'Pet Toy', quantity: 1, price: 12.99 }
              ]
            },
            {
              id: 'ORD-002',
              date: '2024-01-15',
              total: 156.50,
              status: 'Delivered',
              items: 5,
              products: [
                { name: 'Cat Litter', quantity: 3, price: 25.00 },
                { name: 'Cat Food', quantity: 2, price: 30.75 }
              ]
            },
            {
              id: 'ORD-003',
              date: '2024-01-10',
              total: 42.25,
              status: 'Processing',
              items: 2,
              products: [
                { name: 'Pet Shampoo', quantity: 1, price: 18.99 },
                { name: 'Pet Brush', quantity: 1, price: 23.26 }
              ]
            }
          ]);
        }

        // Fetch wishlist
        try {
          const wishlistData = await ApiService.getUserWishlist(userIdToFetch);
          setWishlistItems(wishlistData);
        } catch (err) {
          console.log('No wishlist data available');
          setWishlistItems([]);
        }

      } catch (err) {
        setError(err.message);
        console.error('Error fetching user data:', err);
        
        // Fallback to demo data if API fails - userType should come from database
        const fallbackUser = {
          id: 1,
          firstName: 'Demo',
          lastName: 'User',
          email: 'demo@example.com',
          phone: '+1 (555) 123-4567',
          address: '123 Pet Street, Animal City, AC 12345',
          profileImage: 'https://placehold.co/150x150/E8F5E8/4A5D4A?text=DU',
          joinDate: new Date().toISOString().split('T')[0],
          bio: 'Demo user profile - API connection failed.',
          userType: 'Customer', // This should be fetched from database
          preferences: {
            emailNotifications: true,
            pushNotifications: false,
            marketingEmails: true,
            orderUpdates: true
          }
        };
        setCurrentUser(fallbackUser);
        setEditedUser(fallbackUser);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId, API_BASE_URL]);

  const handleEditProfile = () => {
    setIsEditing(true);
    setEditedUser({ ...currentUser });
  };

  const handleSaveProfile = async () => {
    try {
      const userIdToUpdate = userId || localStorage.getItem('userId') || currentUser.id;
      
      const updatedUser = await ApiService.updateUserProfile(userIdToUpdate, editedUser);
      setCurrentUser(updatedUser);
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      // Fallback to local state update if API fails
      setCurrentUser(editedUser);
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedUser({ ...currentUser });
    setIsEditing(false);
  };

  const handleAddPet = () => {
    setSelectedPet(null);
    setNewPet({
      name: '',
      type: 'Dog',
      breed: '',
      age: '',
      weight: '',
      birthDate: '',
      microchipId: '',
      veterinarian: '',
      allergies: '',
      medications: '',
      notes: '',
      image: ''
    });
    setShowPetModal(true);
  };

  const handleEditPet = (pet) => {
    setSelectedPet(pet);
    setNewPet(pet);
    setShowPetModal(true);
  };

  const handleSavePet = async () => {
    // Validate required fields
    if (!newPet.name.trim()) {
      alert('Pet name is required');
      return;
    }
    
    if (!newPet.type.trim()) {
      alert('Pet type is required');
      return;
    }

    try {
      const userIdToUpdate = userId || localStorage.getItem('userId') || currentUser.id;
      
      if (selectedPet) {
        // Update existing pet
        const updatedPet = await ApiService.updatePet(userIdToUpdate, selectedPet.id, newPet);
        setPets(pets.map(pet => pet.id === selectedPet.id ? updatedPet : pet));
      } else {
        // Add new pet
        const createdPet = await ApiService.createPet(userIdToUpdate, newPet);
        setPets([...pets, createdPet]);
      }
      
      setShowPetModal(false);
      setSelectedPet(null);
    } catch (err) {
      console.error('Error saving pet:', err);
      // Fallback to local state update
      if (selectedPet) {
        setPets(pets.map(pet => pet.id === selectedPet.id ? { ...newPet, id: selectedPet.id } : pet));
      } else {
        setPets([...pets, { ...newPet, id: Date.now() }]);
      }
      setShowPetModal(false);
    }
  };

  const handleDeletePet = async (petId) => {
    try {
      const userIdToUpdate = userId || localStorage.getItem('userId') || currentUser.id;
      
      await ApiService.deletePet(userIdToUpdate, petId);
      setPets(pets.filter(pet => pet.id !== petId));
    } catch (err) {
      console.error('Error deleting pet:', err);
      // Fallback to local state update
      setPets(pets.filter(pet => pet.id !== petId));
    }
  };

  // Business handlers
  const handleAddProduct = () => {
    setNewProduct({
      name: '',
      category: '',
      price: '',
      description: '',
      image: '',
      inStock: true,
      brand: ''
    });
    setShowProductModal(true);
  };

  const handleSaveProduct = () => {
    // Validate required fields
    if (!newProduct.name.trim()) {
      alert('Product name is required');
      return;
    }
    
    if (!newProduct.price || newProduct.price <= 0) {
      alert('Valid product price is required');
      return;
    }

    console.log('Adding product:', newProduct);
    
    if (selectedProduct) {
      // Update existing product
      setBusinessProducts(prev => 
        prev.map(product => 
          product.id === selectedProduct.id ? { ...newProduct, id: selectedProduct.id } : product
        )
      );
    } else {
      // Add new product
      setBusinessProducts(prev => [...prev, { ...newProduct, id: Date.now() }]);
    }
    
    setNewProduct({
      name: '',
      category: '',
      price: '',
      description: '',
      image: '',
      inStock: true,
      brand: ''
    });
    setShowProductModal(false);
    setSelectedProduct(null);
  };

  const handleDeleteProduct = (productId) => {
    setBusinessProducts(prev => prev.filter(product => product.id !== productId));
  };

  const handleAddService = () => {
    setNewService({
      name: '',
      category: '',
      price: '',
      duration: '',
      description: '',
      image: '',
      availability: true
    });
    setShowServiceModal(true);
  };

  const handleSaveService = () => {
    // Validate required fields
    if (!newService.name.trim()) {
      alert('Service name is required');
      return;
    }
    
    if (!newService.price || newService.price <= 0) {
      alert('Valid service price is required');
      return;
    }

    console.log('Adding service:', newService);
    
    if (selectedService) {
      // Update existing service
      setBusinessServices(prev => 
        prev.map(service => 
          service.id === selectedService.id ? { ...newService, id: selectedService.id } : service
        )
      );
    } else {
      // Add new service
      setBusinessServices(prev => [...prev, { ...newService, id: Date.now() }]);
    }
    
    setNewService({
      name: '',
      category: '',
      price: '',
      duration: '',
      description: '',
      image: '',
      availability: true
    });
    setShowServiceModal(false);
    setSelectedService(null);
  };

  const handleDeleteService = (serviceId) => {
    setBusinessServices(prev => prev.filter(service => service.id !== serviceId));
  };

  // Agency handlers
  const handleAddAnimal = () => {
    setNewAnimal({
      name: '',
      species: '',
      breed: '',
      age: '',
      gender: '',
      size: '',
      color: '',
      description: '',
      medicalHistory: '',
      vaccinated: false,
      spayedNeutered: false,
      image: '',
      adoptionFee: '',
      location: ''
    });
    setShowAnimalModal(true);
  };

  const handleSaveAnimal = () => {
    console.log('Adding animal for adoption:', newAnimal);
    setAgencyAnimals(prev => [...prev, { ...newAnimal, id: Date.now() }]);
    setNewAnimal({
      name: '',
      species: 'Dog',
      breed: '',
      age: '',
      gender: '',
      size: '',
      color: '',
      description: '',
      medicalHistory: '',
      vaccinated: false,
      spayedNeutered: false,
      image: '',
      adoptionFee: '',
      location: ''
    });
    setShowAnimalModal(false);
  };

  const handleDeleteAnimal = (animalId) => {
    setAgencyAnimals(prev => prev.filter(animal => animal.id !== animalId));
  };

  // Missing handlers implementation
  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setNewProduct(product);
    setShowProductModal(true);
  };

  const handleEditService = (service) => {
    setSelectedService(service);
    setNewService(service);
    setShowServiceModal(true);
  };

  const handleEditAnimal = (animal) => {
    setSelectedAnimal(animal);
    setNewAnimal(animal);
    setShowAnimalModal(true);
  };

  const handleRemoveFromWishlist = async (itemId) => {
    try {
      const userIdToUpdate = userId || localStorage.getItem('userId') || currentUser.id;
      await ApiService.removeFromWishlist(userIdToUpdate, itemId);
      setWishlistItems(wishlistItems.filter(item => item.id !== itemId));
    } catch (err) {
      console.error('Error removing from wishlist:', err);
      // Fallback to local state update
      setWishlistItems(wishlistItems.filter(item => item.id !== itemId));
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const userIdToUpdate = userId || localStorage.getItem('userId') || currentUser.id;
      await ApiService.deleteUser(userIdToUpdate);
      
      // Clear local storage and redirect
      localStorage.removeItem('authToken');
      localStorage.removeItem('userId');
      localStorage.removeItem('userType');
      
      // Navigate to home or login page
      if (onNavigateHome) {
        onNavigateHome();
      } else {
        window.location.href = '/';
      }
    } catch (err) {
      console.error('Error deleting account:', err);
      alert('Failed to delete account. Please try again.');
    }
    setShowDeleteModal(false);
  };

  const handlePreferenceChange = async (key, value) => {
    const updatedPreferences = {
      ...(editedUser.preferences || {}),
      [key]: value
    };
    
    const updatedUser = {
      ...editedUser,
      preferences: updatedPreferences
    };
    
    setEditedUser(updatedUser);
    
    // Auto-save preferences using API service
    try {
      const userIdToUpdate = userId || localStorage.getItem('userId') || currentUser.id;
      await ApiService.updateUserPreferences(userIdToUpdate, updatedPreferences);
      setCurrentUser(updatedUser);
    } catch (err) {
      console.error('Error updating preferences:', err);
      // Revert to previous state if API fails
      setEditedUser(currentUser);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Calculate profile completion percentage
  const calculateProfileCompletion = () => {
    if (!currentUser) return 0;
    
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'bio'];
    const completedFields = requiredFields.filter(field => 
      currentUser[field] && currentUser[field].toString().trim() !== ''
    );
    
    return Math.round((completedFields.length / requiredFields.length) * 100);
  };

  const profileCompletion = calculateProfileCompletion();

  // Order handler functions
  const handleViewOrderDetails = async (orderId) => {
    try {
      const userIdToUpdate = userId || localStorage.getItem('userId') || currentUser.id;
      const orderDetails = await ApiService.getOrderDetails(userIdToUpdate, orderId);
      // You can open a modal or navigate to a detailed order page
      console.log('Order details:', orderDetails);
      alert(`Order ${orderId} details loaded. Implement modal or navigation as needed.`);
    } catch (err) {
      console.error('Error fetching order details:', err);
      alert('Unable to load order details. Please try again later.');
    }
  };

  const handleReorder = async (orderId) => {
    try {
      // Find the order and add its items to cart
      const order = orderHistory.find(o => o.id === orderId);
      if (order && order.products) {
        // Add logic to add items to cart
        console.log('Reordering items:', order.products);
        alert(`Items from order ${orderId} will be added to cart. Implement cart integration.`);
      }
    } catch (err) {
      console.error('Error reordering:', err);
      alert('Unable to reorder. Please try again later.');
    }
  };

  const handleLeaveReview = (orderId) => {
    // Open review modal or navigate to review page
    console.log('Leave review for order:', orderId);
    alert(`Review functionality for order ${orderId}. Implement review modal/page.`);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    ...(currentUser?.userType === 'Customer' ? [
      { id: 'pets', label: 'My Pets', icon: Heart },
      { id: 'orders', label: 'Order History', icon: ShoppingBag },
      { id: 'wishlist', label: 'Wishlist', icon: Heart }
    ] : []),
    ...(currentUser?.userType === 'Business' ? [
      { id: 'products', label: 'My Products', icon: ShoppingBag },
      { id: 'services', label: 'My Services', icon: Heart },
      { id: 'orders', label: 'Orders Received', icon: ShoppingBag }
    ] : []),
    ...(currentUser?.userType === 'Agency' ? [
      { id: 'animals', label: 'Animals for Adoption', icon: Heart },
      { id: 'adoptions', label: 'Adoption History', icon: ShoppingBag }
    ] : []),
    { id: 'settings', label: 'Settings', icon: Shield }
  ];

  // Loading state
  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-page__container">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading your profile...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !currentUser) {
    return (
      <div className="profile-page">
        <div className="profile-page__container">
          <div className="error-message">
            <p>Error loading profile: {error}</p>
            <button className="btn btn--primary" onClick={() => window.location.reload()}>
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Ensure currentUser exists before rendering
  if (!currentUser) {
    return null;
  }

  return (
    <div className="profile-page">
      <div className="profile-page__container">
        {/* Header */}
        <div className="profile-header">
          <div className="profile-header__content">
            <div className="profile-avatar">
              <img src={currentUser.profileImage} alt="Profile" />
              <button className="profile-avatar__edit">
                <Camera size={16} />
              </button>
              {/* Membership Badge */}
              <div className="profile-avatar__badge">
                <Crown size={12} />
              </div>
            </div>
            <div className="profile-header__info">
              <h1 className="profile-header__name">
                {currentUser.firstName} {currentUser.lastName}
                <Sparkles size={20} className="profile-header__sparkle" />
              </h1>
              <p className="profile-header__email">{currentUser.email}</p>
              <p className="profile-header__member-since">
                Member since {formatDate(currentUser.joinDate)}
              </p>
              
              {/* User Type Display (Read-only from Database) */}
              <div className="user-type-display">
                <span className="user-type-label">Account Type:</span>
                <span className={`user-type-badge user-type-badge--${(currentUser.userType || 'Customer').toLowerCase()}`}>
                  {currentUser.userType || 'Customer'}
                </span>
                {/* Note: User type is determined from database and cannot be changed from frontend */}
              </div>
            </div>
          </div>
          
          {/* Profile Stats */}
          <div className="profile-stats">
            <div className="profile-stat">
              <div className="profile-stat__icon">
                <Heart size={16} />
              </div>
              <div className="profile-stat__content">
                <span className="profile-stat__number">{pets.length}</span>
                <span className="profile-stat__label">Pets</span>
              </div>
            </div>
            <div className="profile-stat">
              <div className="profile-stat__icon">
                <ShoppingBag size={16} />
              </div>
              <div className="profile-stat__content">
                <span className="profile-stat__number">{orderHistory.length}</span>
                <span className="profile-stat__label">Orders</span>
              </div>
            </div>
            <div className="profile-stat">
              <div className="profile-stat__icon">
                <Star size={16} />
              </div>
              <div className="profile-stat__content">
                <span className="profile-stat__number">{wishlistItems.length}</span>
                <span className="profile-stat__label">Wishlist</span>
              </div>
            </div>
          </div>
          
          <button className="btn btn--secondary" onClick={onNavigateHome}>
            ← Back to Home
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="profile-nav">
          {/* Profile Completion Indicator */}
          {profileCompletion < 100 && (
            <div className="profile-completion">
              <div className="profile-completion__content">
                <TrendingUp size={16} />
                <span>Profile {profileCompletion}% Complete</span>
              </div>
              <div className="profile-completion__bar">
                <div 
                  className="profile-completion__fill" 
                  style={{ width: `${profileCompletion}%` }}
                />
              </div>
            </div>
          )}
          
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                className={`profile-nav__tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="profile-content">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="profile-tab">
              <div className="profile-section">
                <div className="profile-section__header">
                  <h2>Personal Information</h2>
                  {!isEditing ? (
                    <button className="btn btn--primary" onClick={handleEditProfile}>
                      <Edit3 size={16} />
                      Edit Profile
                    </button>
                  ) : (
                    <div className="profile-section__actions">
                      <button className="btn btn--secondary" onClick={handleCancelEdit}>
                        <X size={16} />
                        Cancel
                      </button>
                      <button className="btn btn--primary" onClick={handleSaveProfile}>
                        <Save size={16} />
                        Save Changes
                      </button>
                    </div>
                  )}
                </div>

                <div className="profile-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label>First Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedUser.firstName}
                          onChange={(e) => setEditedUser({...editedUser, firstName: e.target.value})}
                          className="form-input"
                        />
                      ) : (
                        <p className="form-value">{currentUser.firstName}</p>
                      )}
                    </div>
                    <div className="form-group">
                      <label>Last Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedUser.lastName}
                          onChange={(e) => setEditedUser({...editedUser, lastName: e.target.value})}
                          className="form-input"
                        />
                      ) : (
                        <p className="form-value">{currentUser.lastName}</p>
                      )}
                    </div>
                  </div>

                  <div className="form-group">
                    <label>
                      <Mail size={16} />
                      Email
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={editedUser.email}
                        onChange={(e) => setEditedUser({...editedUser, email: e.target.value})}
                        className="form-input"
                      />
                    ) : (
                      <p className="form-value">{currentUser.email}</p>
                    )}
                  </div>

                  <div className="form-group">
                    <label>
                      <Phone size={16} />
                      Phone Number
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editedUser.phone}
                        onChange={(e) => setEditedUser({...editedUser, phone: e.target.value})}
                        className="form-input"
                      />
                    ) : (
                      <p className="form-value">{currentUser.phone}</p>
                    )}
                  </div>

                  <div className="form-group">
                    <label>
                      <MapPin size={16} />
                      Address
                    </label>
                    {isEditing ? (
                      <textarea
                        value={editedUser.address}
                        onChange={(e) => setEditedUser({...editedUser, address: e.target.value})}
                        className="form-textarea"
                        rows="3"
                      />
                    ) : (
                      <p className="form-value">{currentUser.address}</p>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Bio</label>
                    {isEditing ? (
                      <textarea
                        value={editedUser.bio}
                        onChange={(e) => setEditedUser({...editedUser, bio: e.target.value})}
                        className="form-textarea"
                        rows="3"
                        placeholder="Tell us about yourself and your pets..."
                      />
                    ) : (
                      <p className="form-value">{currentUser.bio}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Pets Tab */}
          {activeTab === 'pets' && (
            <div className="pets-tab">
              <div className="pets-section">
                <div className="pets-section__header">
                  <h2>My Pets</h2>
                  <button className="btn btn--primary" onClick={handleAddPet}>
                    <User size={16} />
                    Add Pet
                  </button>
                </div>

                <div className="pets-grid">
                  {pets.map(pet => (
                    <div key={pet.id} className="pet-card">
                      <div className="pet-card__image">
                        <img src={pet.image} alt={pet.name} />
                      </div>
                      <div className="pet-card__content">
                        <h3 className="pet-card__name">{pet.name}</h3>
                        <p className="pet-card__breed">{pet.breed}</p>
                        <div className="pet-card__details">
                          <span className="pet-card__detail">
                            <strong>Type:</strong> {pet.type}
                          </span>
                          <span className="pet-card__detail">
                            <strong>Age:</strong> {pet.age}
                          </span>
                          <span className="pet-card__detail">
                            <strong>Weight:</strong> {pet.weight}
                          </span>
                        </div>
                        <div className="pet-card__actions">
                          <button
                            className="btn btn--secondary btn--small"
                            onClick={() => handleEditPet(pet)}
                          >
                            <Edit3 size={14} />
                            Edit
                          </button>
                          <button
                            className="btn btn--danger btn--small"
                            onClick={() => handleDeletePet(pet.id)}
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="orders-tab">
              <div className="orders-section">
                <h2>Order History</h2>
                {orderHistory.length === 0 ? (
                  <div className="empty-state">
                    <ShoppingBag size={48} className="empty-state-icon" />
                    <h3>No orders yet</h3>
                    <p>You haven't placed any orders. Start shopping for your pets!</p>
                    <button className="btn btn--primary" onClick={onNavigateHome}>
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  <div className="orders-list">
                    {orderHistory.map(order => (
                      <div key={order.id} className="order-card">
                        <div className="order-card__header">
                          <div className="order-card__id">
                            <strong>Order #{order.id}</strong>
                          </div>
                          <div className={`order-card__status order-card__status--${order.status.toLowerCase()}`}>
                            {order.status}
                          </div>
                        </div>
                        <div className="order-card__details">
                          <span className="order-card__date">
                            <Calendar size={16} />
                            {formatDate(order.date)}
                          </span>
                          <span className="order-card__items">
                            {order.items} items
                          </span>
                          <span className="order-card__total">
                            ${order.total}
                          </span>
                        </div>
                        
                        {/* Order products details */}
                        {order.products && (
                          <div className="order-card__products">
                            <h4>Items in this order:</h4>
                            <div className="order-products-list">
                              {order.products.map((product, index) => (
                                <div key={index} className="order-product-item">
                                  <span className="product-name">{product.name}</span>
                                  <span className="product-quantity">Qty: {product.quantity}</span>
                                  <span className="product-price">${product.price}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <div className="order-card__actions">
                          <button 
                            className="btn btn--secondary btn--small"
                            onClick={() => handleViewOrderDetails(order.id)}
                          >
                            View Details
                          </button>
                          <button 
                            className="btn btn--primary btn--small"
                            onClick={() => handleReorder(order.id)}
                          >
                            Reorder
                          </button>
                          {order.status === 'Delivered' && (
                            <button 
                              className="btn btn--outline btn--small"
                              onClick={() => handleLeaveReview(order.id)}
                            >
                              Leave Review
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Wishlist Tab */}
          {activeTab === 'wishlist' && (
            <div className="wishlist-tab">
              <div className="wishlist-section">
                <h2>My Wishlist</h2>
                <div className="wishlist-grid">
                  {wishlistItems.map(item => (
                    <div key={item.id} className="wishlist-card">
                      <div className="wishlist-card__image">
                        <img src={item.image} alt={item.name} />
                      </div>
                      <div className="wishlist-card__content">
                        <h3 className="wishlist-card__name">{item.name}</h3>
                        <p className="wishlist-card__price">${item.price}</p>
                        <div className="wishlist-card__actions">
                          <button className="btn btn--primary btn--small">
                            Add to Cart
                          </button>
                          <button className="btn btn--danger btn--small">
                            <Heart size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Business Products Tab */}
          {activeTab === 'products' && currentUser?.userType === 'Business' && (
            <div className="products-tab">
              <div className="products-section">
                <div className="section-header">
                  <h2>My Products</h2>
                  <button className="btn btn--primary" onClick={handleAddProduct}>
                    <Plus size={16} /> Add Product
                  </button>
                </div>
                <div className="products-grid">
                  {businessProducts.map(product => (
                    <div key={product.id} className="product-card">
                      <div className="product-card__image">
                        <img src={product.image || 'https://placehold.co/200x150/E8F5E8/4A5D4A?text=Product'} alt={product.name} />
                      </div>
                      <div className="product-card__content">
                        <h3 className="product-card__name">{product.name}</h3>
                        <p className="product-card__category">{product.category}</p>
                        <p className="product-card__price">${product.price}</p>
                        <p className="product-card__status">
                          {product.inStock ? '✅ In Stock' : '❌ Out of Stock'}
                        </p>
                        <div className="product-card__actions">
                          <button 
                            className="btn btn--small btn--secondary"
                            onClick={() => handleEditProduct(product)}
                          >
                            Edit
                          </button>
                          <button 
                            className="btn btn--small btn--danger"
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {businessProducts.length === 0 && (
                    <div className="empty-state">
                      <ShoppingBag size={48} />
                      <h3>No Products Yet</h3>
                      <p>Start adding products to your business catalog</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Business Services Tab */}
          {activeTab === 'services' && currentUser?.userType === 'Business' && (
            <div className="services-tab">
              <div className="services-section">
                <div className="section-header">
                  <h2>My Services</h2>
                  <button className="btn btn--primary" onClick={handleAddService}>
                    <Plus size={16} /> Add Service
                  </button>
                </div>
                <div className="services-grid">
                  {businessServices.map(service => (
                    <div key={service.id} className="service-card">
                      <div className="service-card__image">
                        <img src={service.image || 'https://placehold.co/200x150/E8F5E8/4A5D4A?text=Service'} alt={service.name} />
                      </div>
                      <div className="service-card__content">
                        <h3 className="service-card__name">{service.name}</h3>
                        <p className="service-card__category">{service.category}</p>
                        <p className="service-card__price">${service.price}</p>
                        <p className="service-card__duration">Duration: {service.duration}</p>
                        <p className="service-card__status">
                          {service.availability ? '✅ Available' : '❌ Unavailable'}
                        </p>
                        <div className="service-card__actions">
                          <button 
                            className="btn btn--small btn--secondary"
                            onClick={() => handleEditService(service)}
                          >
                            Edit
                          </button>
                          <button 
                            className="btn btn--small btn--danger"
                            onClick={() => handleDeleteService(service.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {businessServices.length === 0 && (
                    <div className="empty-state">
                      <Heart size={48} />
                      <h3>No Services Yet</h3>
                      <p>Start offering services to your customers</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Agency Animals Tab */}
          {activeTab === 'animals' && currentUser?.userType === 'Agency' && (
            <div className="animals-tab">
              <div className="animals-section">
                <div className="section-header">
                  <h2>Animals for Adoption</h2>
                  <button className="btn btn--primary" onClick={handleAddAnimal}>
                    <Plus size={16} /> Add Animal
                  </button>
                </div>
                <div className="animals-grid">
                  {agencyAnimals.map(animal => (
                    <div key={animal.id} className="animal-card">
                      <div className="animal-card__image">
                        <img src={animal.image || 'https://placehold.co/200x150/E8F5E8/4A5D4A?text=Animal'} alt={animal.name} />
                      </div>
                      <div className="animal-card__content">
                        <h3 className="animal-card__name">{animal.name}</h3>
                        <p className="animal-card__species">{animal.species} - {animal.breed}</p>
                        <p className="animal-card__age">Age: {animal.age}</p>
                        <p className="animal-card__size">Size: {animal.size}</p>
                        <p className="animal-card__fee">Adoption Fee: ${animal.adoptionFee}</p>
                        <p className="animal-card__health">
                          {animal.vaccinated ? '✅ Vaccinated' : '❌ Not Vaccinated'} | 
                          {animal.spayedNeutered ? ' ✅ Spayed/Neutered' : ' ❌ Not Spayed/Neutered'}
                        </p>
                        <div className="animal-card__actions">
                          <button 
                            className="btn btn--small btn--secondary"
                            onClick={() => handleEditAnimal(animal)}
                          >
                            Edit
                          </button>
                          <button 
                            className="btn btn--small btn--danger"
                            onClick={() => handleDeleteAnimal(animal.id)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {agencyAnimals.length === 0 && (
                    <div className="empty-state">
                      <Heart size={48} />
                      <h3>No Animals Listed</h3>
                      <p>Start adding animals available for adoption</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Agency Adoptions Tab */}
          {activeTab === 'adoptions' && currentUser?.userType === 'Agency' && (
            <div className="adoptions-tab">
              <div className="adoptions-section">
                <h2>Adoption History</h2>
                <div className="adoptions-list">
                  <div className="empty-state">
                    <ShoppingBag size={48} />
                    <h3>No Adoptions Yet</h3>
                    <p>Adoption history will appear here once animals are adopted</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="settings-tab">
              <div className="settings-section">
                <h2>Account Settings</h2>
                
                {/* Notification Preferences */}
                <div className="settings-group">
                  <h3>Notification Preferences</h3>
                  <div className="settings-options">
                    <div className="setting-option">
                      <div className="setting-option__info">
                        <Bell size={20} />
                        <div>
                          <strong>Email Notifications</strong>
                          <p>Receive updates about your orders and account</p>
                        </div>
                      </div>
                      <label className="toggle">
                        <input
                          type="checkbox"
                          checked={editedUser.preferences?.emailNotifications || false}
                          onChange={(e) => handlePreferenceChange('emailNotifications', e.target.checked)}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>

                    <div className="setting-option">
                      <div className="setting-option__info">
                        <Bell size={20} />
                        <div>
                          <strong>Push Notifications</strong>
                          <p>Get instant updates on your mobile device</p>
                        </div>
                      </div>
                      <label className="toggle">
                        <input
                          type="checkbox"
                          checked={editedUser.preferences?.pushNotifications || false}
                          onChange={(e) => handlePreferenceChange('pushNotifications', e.target.checked)}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>

                    <div className="setting-option">
                      <div className="setting-option__info">
                        <Mail size={20} />
                        <div>
                          <strong>Marketing Emails</strong>
                          <p>Receive promotional offers and pet care tips</p>
                        </div>
                      </div>
                      <label className="toggle">
                        <input
                          type="checkbox"
                          checked={editedUser.preferences?.marketingEmails || false}
                          onChange={(e) => handlePreferenceChange('marketingEmails', e.target.checked)}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>

                    <div className="setting-option">
                      <div className="setting-option__info">
                        <ShoppingBag size={20} />
                        <div>
                          <strong>Order Updates</strong>
                          <p>Get notified about order status changes</p>
                        </div>
                      </div>
                      <label className="toggle">
                        <input
                          type="checkbox"
                          checked={editedUser.preferences?.orderUpdates || false}
                          onChange={(e) => handlePreferenceChange('orderUpdates', e.target.checked)}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Security Settings */}
                <div className="settings-group">
                  <h3>Security</h3>
                  <div className="settings-options">
                    <button className="setting-button">
                      <Lock size={20} />
                      <div>
                        <strong>Change Password</strong>
                        <p>Update your account password</p>
                      </div>
                    </button>

                    <button className="setting-button">
                      <Shield size={20} />
                      <div>
                        <strong>Two-Factor Authentication</strong>
                        <p>Add an extra layer of security</p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="settings-group settings-group--danger">
                  <h3>Danger Zone</h3>
                  <div className="settings-options">
                    <button 
                      className="setting-button setting-button--danger"
                      onClick={() => setShowDeleteModal(true)}
                    >
                      <Trash2 size={20} />
                      <div>
                        <strong>Delete Account</strong>
                        <p>Permanently delete your account and all data</p>
                      </div>
                    </button>
                  </div>
                </div>

                <div className="settings-actions">
                  <button className="btn btn--primary" onClick={handleSaveProfile}>
                    Save Settings
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Pet Modal */}
      {showPetModal && (
        <div className="modal-overlay">
          <div className="pet-modal">
            <div className="modal-header">
              <h3>{selectedPet ? 'Edit Pet' : 'Add New Pet'}</h3>
              <button onClick={() => setShowPetModal(false)} className="modal-close">
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label>Pet Name *</label>
                  <input
                    type="text"
                    value={newPet.name}
                    onChange={(e) => setNewPet({...newPet, name: e.target.value})}
                    className="form-input"
                    placeholder="Enter pet's name"
                  />
                </div>
                <div className="form-group">
                  <label>Pet Type *</label>
                  <select
                    value={newPet.type}
                    onChange={(e) => setNewPet({...newPet, type: e.target.value})}
                    className="form-select"
                  >
                    <option value="Dog">Dog</option>
                    <option value="Cat">Cat</option>
                    <option value="Bird">Bird</option>
                    <option value="Fish">Fish</option>
                    <option value="Reptile">Reptile</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Breed</label>
                  <input
                    type="text"
                    value={newPet.breed}
                    onChange={(e) => setNewPet({...newPet, breed: e.target.value})}
                    className="form-input"
                    placeholder="e.g., Golden Retriever"
                  />
                </div>
                <div className="form-group">
                  <label>Age</label>
                  <input
                    type="text"
                    value={newPet.age}
                    onChange={(e) => setNewPet({...newPet, age: e.target.value})}
                    className="form-input"
                    placeholder="e.g., 3 years"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Weight</label>
                  <input
                    type="text"
                    value={newPet.weight}
                    onChange={(e) => setNewPet({...newPet, weight: e.target.value})}
                    className="form-input"
                    placeholder="e.g., 25 kg"
                  />
                </div>
                <div className="form-group">
                  <label>Birth Date</label>
                  <input
                    type="date"
                    value={newPet.birthDate}
                    onChange={(e) => setNewPet({...newPet, birthDate: e.target.value})}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Veterinarian</label>
                <input
                  type="text"
                  value={newPet.veterinarian}
                  onChange={(e) => setNewPet({...newPet, veterinarian: e.target.value})}
                  className="form-input"
                  placeholder="e.g., Dr. Smith Animal Clinic"
                />
              </div>

              <div className="form-group">
                <label>Allergies</label>
                <input
                  type="text"
                  value={newPet.allergies}
                  onChange={(e) => setNewPet({...newPet, allergies: e.target.value})}
                  className="form-input"
                  placeholder="List any known allergies"
                />
              </div>

              <div className="form-group">
                <label>Current Medications</label>
                <input
                  type="text"
                  value={newPet.medications}
                  onChange={(e) => setNewPet({...newPet, medications: e.target.value})}
                  className="form-input"
                  placeholder="List current medications"
                />
              </div>

              <div className="form-group">
                <label>Notes</label>
                <textarea
                  value={newPet.notes}
                  onChange={(e) => setNewPet({...newPet, notes: e.target.value})}
                  className="form-textarea"
                  rows="3"
                  placeholder="Any additional information about your pet"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn--secondary" onClick={() => setShowPetModal(false)}>
                Cancel
              </button>
              <button className="btn btn--primary" onClick={handleSavePet}>
                {selectedPet ? 'Update Pet' : 'Add Pet'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="delete-modal">
            <div className="modal-header">
              <h3>Delete Account</h3>
              <button onClick={() => setShowDeleteModal(false)} className="modal-close">
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete your account? This action cannot be undone and will permanently remove:</p>
              <ul>
                <li>Your profile information</li>
                <li>All pet records</li>
                <li>Order history</li>
                <li>Wishlist items</li>
                <li>Saved preferences</li>
              </ul>
              <p><strong>This action is irreversible.</strong></p>
            </div>
            <div className="modal-footer">
              <button className="btn btn--secondary" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button className="btn btn--danger" onClick={handleDeleteAccount}>
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Modal */}
      {showProductModal && (
        <div className="modal-overlay">
          <div className="product-modal">
            <div className="modal-header">
              <h3>Add New Product</h3>
              <button onClick={() => setShowProductModal(false)} className="modal-close">
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label>Product Name *</label>
                  <input
                    type="text"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    className="form-input"
                    placeholder="Enter product name"
                  />
                </div>
                <div className="form-group">
                  <label>Category *</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                    className="form-select"
                  >
                    <option value="">Select Category</option>
                    <option value="Food">Food</option>
                    <option value="Toys">Toys</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Grooming">Grooming</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Price *</label>
                  <input
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                    className="form-input"
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>
                <div className="form-group">
                  <label>Brand</label>
                  <input
                    type="text"
                    value={newProduct.brand}
                    onChange={(e) => setNewProduct({...newProduct, brand: e.target.value})}
                    className="form-input"
                    placeholder="Product brand"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  className="form-textarea"
                  rows="3"
                  placeholder="Product description"
                />
              </div>
              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="url"
                  value={newProduct.image}
                  onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                  className="form-input"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={newProduct.inStock}
                    onChange={(e) => setNewProduct({...newProduct, inStock: e.target.checked})}
                  />
                  In Stock
                </label>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn--secondary" onClick={() => setShowProductModal(false)}>
                Cancel
              </button>
              <button className="btn btn--primary" onClick={handleSaveProduct}>
                Add Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Service Modal */}
      {showServiceModal && (
        <div className="modal-overlay">
          <div className="service-modal">
            <div className="modal-header">
              <h3>Add New Service</h3>
              <button onClick={() => setShowServiceModal(false)} className="modal-close">
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label>Service Name *</label>
                  <input
                    type="text"
                    value={newService.name}
                    onChange={(e) => setNewService({...newService, name: e.target.value})}
                    className="form-input"
                    placeholder="Enter service name"
                  />
                </div>
                <div className="form-group">
                  <label>Category *</label>
                  <select
                    value={newService.category}
                    onChange={(e) => setNewService({...newService, category: e.target.value})}
                    className="form-select"
                  >
                    <option value="">Select Category</option>
                    <option value="Grooming">Grooming</option>
                    <option value="Training">Training</option>
                    <option value="Veterinary">Veterinary</option>
                    <option value="Boarding">Boarding</option>
                    <option value="Walking">Walking</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Price *</label>
                  <input
                    type="number"
                    value={newService.price}
                    onChange={(e) => setNewService({...newService, price: e.target.value})}
                    className="form-input"
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>
                <div className="form-group">
                  <label>Duration</label>
                  <input
                    type="text"
                    value={newService.duration}
                    onChange={(e) => setNewService({...newService, duration: e.target.value})}
                    className="form-input"
                    placeholder="e.g., 1 hour"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={newService.description}
                  onChange={(e) => setNewService({...newService, description: e.target.value})}
                  className="form-textarea"
                  rows="3"
                  placeholder="Service description"
                />
              </div>
              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="url"
                  value={newService.image}
                  onChange={(e) => setNewService({...newService, image: e.target.value})}
                  className="form-input"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={newService.availability}
                    onChange={(e) => setNewService({...newService, availability: e.target.checked})}
                  />
                  Currently Available
                </label>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn--secondary" onClick={() => setShowServiceModal(false)}>
                Cancel
              </button>
              <button className="btn btn--primary" onClick={handleSaveService}>
                Add Service
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Animal Modal */}
      {showAnimalModal && (
        <div className="modal-overlay">
          <div className="animal-modal">
            <div className="modal-header">
              <h3>Add Animal for Adoption</h3>
              <button onClick={() => setShowAnimalModal(false)} className="modal-close">
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label>Animal Name *</label>
                  <input
                    type="text"
                    value={newAnimal.name}
                    onChange={(e) => setNewAnimal({...newAnimal, name: e.target.value})}
                    className="form-input"
                    placeholder="Enter animal's name"
                  />
                </div>
                <div className="form-group">
                  <label>Species *</label>
                  <select
                    value={newAnimal.species}
                    onChange={(e) => setNewAnimal({...newAnimal, species: e.target.value})}
                    className="form-select"
                  >
                    <option value="Dog">Dog</option>
                    <option value="Cat">Cat</option>
                    <option value="Bird">Bird</option>
                    <option value="Rabbit">Rabbit</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Breed</label>
                  <input
                    type="text"
                    value={newAnimal.breed}
                    onChange={(e) => setNewAnimal({...newAnimal, breed: e.target.value})}
                    className="form-input"
                    placeholder="Animal breed"
                  />
                </div>
                <div className="form-group">
                  <label>Age</label>
                  <input
                    type="text"
                    value={newAnimal.age}
                    onChange={(e) => setNewAnimal({...newAnimal, age: e.target.value})}
                    className="form-input"
                    placeholder="e.g., 2 years"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Gender</label>
                  <select
                    value={newAnimal.gender}
                    onChange={(e) => setNewAnimal({...newAnimal, gender: e.target.value})}
                    className="form-select"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Size</label>
                  <select
                    value={newAnimal.size}
                    onChange={(e) => setNewAnimal({...newAnimal, size: e.target.value})}
                    className="form-select"
                  >
                    <option value="">Select Size</option>
                    <option value="Small">Small</option>
                    <option value="Medium">Medium</option>
                    <option value="Large">Large</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Color</label>
                  <input
                    type="text"
                    value={newAnimal.color}
                    onChange={(e) => setNewAnimal({...newAnimal, color: e.target.value})}
                    className="form-input"
                    placeholder="Animal color"
                  />
                </div>
                <div className="form-group">
                  <label>Adoption Fee</label>
                  <input
                    type="number"
                    value={newAnimal.adoptionFee}
                    onChange={(e) => setNewAnimal({...newAnimal, adoptionFee: e.target.value})}
                    className="form-input"
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={newAnimal.description}
                  onChange={(e) => setNewAnimal({...newAnimal, description: e.target.value})}
                  className="form-textarea"
                  rows="3"
                  placeholder="Describe the animal's personality and traits"
                />
              </div>
              <div className="form-group">
                <label>Medical History</label>
                <textarea
                  value={newAnimal.medicalHistory}
                  onChange={(e) => setNewAnimal({...newAnimal, medicalHistory: e.target.value})}
                  className="form-textarea"
                  rows="2"
                  placeholder="Any medical conditions or treatments"
                />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  value={newAnimal.location}
                  onChange={(e) => setNewAnimal({...newAnimal, location: e.target.value})}
                  className="form-input"
                  placeholder="Location where animal can be viewed"
                />
              </div>
              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="url"
                  value={newAnimal.image}
                  onChange={(e) => setNewAnimal({...newAnimal, image: e.target.value})}
                  className="form-input"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={newAnimal.vaccinated}
                      onChange={(e) => setNewAnimal({...newAnimal, vaccinated: e.target.checked})}
                    />
                    Vaccinated
                  </label>
                </div>
                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={newAnimal.spayedNeutered}
                      onChange={(e) => setNewAnimal({...newAnimal, spayedNeutered: e.target.checked})}
                    />
                    Spayed/Neutered
                  </label>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn--secondary" onClick={() => setShowAnimalModal(false)}>
                Cancel
              </button>
              <button className="btn btn--primary" onClick={handleSaveAnimal}>
                Add Animal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
