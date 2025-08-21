// User-Collection
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');


// Define the Address Sub-schema
// This allows for flexible storage of one or more addresses
const AddressSchema = new Schema({
  street: {
    type: String,
    required: true,
    trim: true
  },
  apartment: {
    type: String,
    trim: true 
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  state: {
    type: String,
    required: true,
    trim: true
  },
  zipCode: {
    type: String,
    required: true,
    trim: true
  },
  country: {
    type: String,
    required: true,
    trim: true
  }
}, { _id: false }); 

// Define the User Schema
const UserSchema = new Schema({

  email: {
    type: String,
    required: true,
    unique: true, // Ensures email addresses are unique
    lowercase: true, // Stores emails in lowercase to avoid duplication issues
    trim: true,
    match: [/.+@.+\..+/, 'Please fill a valid email address'] // Basic email regex validation
  },
  password: {
    type: String,
    required: true
  },
  userType: {
    type: String,
    required: true,
    enum: ["Customer", "Business", "Agency", "Admin/Staff"], // Enforces specific values
    trim: true
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  fullName: {
    type: String,
    trim: true
  },
  phoneNumber: {
    type: String,
    trim: true,
    match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number.']
  },
  profilePicture: {
    type: String, // URL to the image
    trim: true,
    default: null // Optional field, default to null if not provided
  },
  address: {
    type: [AddressSchema], // Array of AddressSchema, allowing multiple addresses
    required: false // Made optional for easier registration
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  dateOfBirth: {
    type: Date,
    required: false
  },
  registeredAt: {
    type: Date,
    default: Date.now 
  },
  lastLogin: {
    type: Date,
    default: null 
  },
  isVerified: {
    type: Boolean,
    default: false // For email verification
  },
  isActive: {
    type: Boolean,
    default: true // For account status
  },
  passwordChangedAt: {
    type: Date
  },
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: {
    type: Date
  }
}, {
  timestamps: true // Adds createdAt and updatedAt timestamps automatically
});

// Virtual for account lockout
UserSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Pre-save hook to hash the password before saving
UserSchema.pre('save', async function(next) {
  // Create fullName from firstName and lastName
  if (this.firstName && this.lastName) {
    this.fullName = `${this.firstName} ${this.lastName}`;
  }

  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(12); 
    this.password = await bcrypt.hash(this.password, salt); // Hash the password
    
    // Set passwordChangedAt timestamp if this isn't a new user
    if (!this.isNew) {
      this.passwordChangedAt = Date.now() - 1000; // Subtract 1 second to account for potential timing issues
    }
    
    next();
  } catch (error) {
    next(error); 
  }
});

// Method to compare the given password with the hashed password in the database
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to check if password was changed after JWT was issued
UserSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

// Method to handle failed login attempts
UserSchema.methods.incLoginAttempts = function() {
  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { loginAttempts: 1 }
    });
  }
  
  const updates = { $inc: { loginAttempts: 1 } };
  
  // Check if we need to lock the account
  if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 }; // Lock for 2 hours
  }
  
  return this.updateOne(updates);
};

// Method to reset login attempts after successful login
UserSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $unset: { loginAttempts: 1, lockUntil: 1 }
  });
};

const User = mongoose.model('User', UserSchema);

module.exports = User;