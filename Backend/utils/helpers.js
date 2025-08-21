
const crypto = require('crypto');
const mongoose = require('mongoose');

/**
 * Database Utilities
 */
const dbUtils = {
    /**
     * Check if a value is a valid MongoDB ObjectId
     */
    isValidObjectId: (id) => {
        return mongoose.Types.ObjectId.isValid(id);
    },

    /**
     * Convert string to ObjectId
     */
    toObjectId: (id) => {
        return new mongoose.Types.ObjectId(id);
    },

    /**
     * Build pagination metadata
     */
    buildPagination: (page, limit, total) => {
        const currentPage = parseInt(page) || 1;
        const itemsPerPage = parseInt(limit) || 10;
        const totalPages = Math.ceil(total / itemsPerPage);
        
        return {
            current: currentPage,
            pages: totalPages,
            total,
            limit: itemsPerPage,
            hasNext: currentPage < totalPages,
            hasPrev: currentPage > 1,
            next: currentPage < totalPages ? currentPage + 1 : null,
            prev: currentPage > 1 ? currentPage - 1 : null
        };
    },

    /**
     * Build MongoDB aggregation pipeline for pagination
     */
    buildPaginationPipeline: (page = 1, limit = 10, sort = { createdAt: -1 }) => {
        const skip = (page - 1) * limit;
        return [
            { $sort: sort },
            { $skip: skip },
            { $limit: limit }
        ];
    }
};

/**
 * String Utilities
 */
const stringUtils = {
    /**
     * Generate random string
     */
    generateRandomString: (length = 32) => {
        return crypto.randomBytes(length).toString('hex');
    },

    /**
     * Generate OTP
     */
    generateOTP: (length = 6) => {
        const digits = '0123456789';
        let otp = '';
        for (let i = 0; i < length; i++) {
            otp += digits[Math.floor(Math.random() * 10)];
        }
        return otp;
    },

    /**
     * Slugify string
     */
    slugify: (text) => {
        return text
            .toString()
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-')
            .replace(/^-+/, '')
            .replace(/-+$/, '');
    },

    /**
     * Capitalize first letter
     */
    capitalize: (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    },

    /**
     * Truncate text
     */
    truncate: (text, length = 100, suffix = '...') => {
        if (text.length <= length) return text;
        return text.substring(0, length) + suffix;
    },

    /**
     * Extract initials from name
     */
    getInitials: (name) => {
        return name
            .split(' ')
            .map(word => word.charAt(0).toUpperCase())
            .join('')
            .substring(0, 2);
    }
};

/**
 * Date Utilities
 */
const dateUtils = {
    /**
     * Add days to date
     */
    addDays: (date, days) => {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    },

    /**
     * Add hours to date
     */
    addHours: (date, hours) => {
        const result = new Date(date);
        result.setHours(result.getHours() + hours);
        return result;
    },

    /**
     * Format date for display
     */
    formatDate: (date, format = 'YYYY-MM-DD') => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        
        switch (format) {
            case 'YYYY-MM-DD':
                return `${year}-${month}-${day}`;
            case 'DD/MM/YYYY':
                return `${day}/${month}/${year}`;
            case 'MM/DD/YYYY':
                return `${month}/${day}/${year}`;
            default:
                return d.toISOString().split('T')[0];
        }
    },

    /**
     * Check if date is today
     */
    isToday: (date) => {
        const today = new Date();
        const checkDate = new Date(date);
        return today.toDateString() === checkDate.toDateString();
    },

    /**
     * Get age from birth date
     */
    getAge: (birthDate) => {
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        
        return age;
    },

    /**
     * Get time ago string
     */
    getTimeAgo: (date) => {
        const now = new Date();
        const diff = now - new Date(date);
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const months = Math.floor(days / 30);
        const years = Math.floor(months / 12);

        if (years > 0) return `${years} year${years > 1 ? 's' : ''} ago`;
        if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`;
        if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
        if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        return 'Just now';
    }
};

/**
 * Validation Utilities
 */
const validationUtils = {
    /**
     * Validate email format
     */
    isValidEmail: (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    /**
     * Validate phone number
     */
    isValidPhoneNumber: (phone) => {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
    },

    /**
     * Validate password strength
     */
    isStrongPassword: (password) => {
        // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
        const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return strongPasswordRegex.test(password);
    },

    /**
     * Validate URL
     */
    isValidURL: (url) => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    },

    /**
     * Sanitize HTML input
     */
    sanitizeHtml: (html) => {
        // Basic HTML sanitization - for production, use a library like DOMPurify
        return html
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
            .replace(/javascript:/gi, '')
            .replace(/on\w+\s*=/gi, '');
    }
};

/**
 * File Utilities
 */
const fileUtils = {
    /**
     * Get file extension
     */
    getFileExtension: (filename) => {
        return filename.split('.').pop().toLowerCase();
    },

    /**
     * Check if file is image
     */
    isImageFile: (filename) => {
        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
        const extension = fileUtils.getFileExtension(filename);
        return imageExtensions.includes(extension);
    },

    /**
     * Generate unique filename
     */
    generateUniqueFilename: (originalName) => {
        const extension = fileUtils.getFileExtension(originalName);
        const timestamp = Date.now();
        const randomString = crypto.randomBytes(8).toString('hex');
        return `${timestamp}-${randomString}.${extension}`;
    },

    /**
     * Format file size
     */
    formatFileSize: (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
};

/**
 * Array Utilities
 */
const arrayUtils = {
    /**
     * Remove duplicates from array
     */
    removeDuplicates: (array) => {
        return [...new Set(array)];
    },

    /**
     * Shuffle array
     */
    shuffle: (array) => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    },

    /**
     * Chunk array into smaller arrays
     */
    chunk: (array, size) => {
        const chunks = [];
        for (let i = 0; i < array.length; i += size) {
            chunks.push(array.slice(i, i + size));
        }
        return chunks;
    },

    /**
     * Get random item from array
     */
    getRandomItem: (array) => {
        return array[Math.floor(Math.random() * array.length)];
    }
};

/**
 * Response Utilities
 */
const responseUtils = {
    /**
     * Standard success response
     */
    success: (res, data = null, message = 'Success', statusCode = 200) => {
        const response = {
            success: true,
            message
        };
        
        if (data !== null) {
            response.data = data;
        }
        
        return res.status(statusCode).json(response);
    },

    /**
     * Standard error response
     */
    error: (res, message = 'An error occurred', statusCode = 500, errors = null) => {
        const response = {
            success: false,
            message
        };
        
        if (errors) {
            response.errors = errors;
        }
        
        return res.status(statusCode).json(response);
    },

    /**
     * Paginated response
     */
    paginated: (res, data, pagination, message = 'Success') => {
        return res.status(200).json({
            success: true,
            message,
            data,
            pagination
        });
    }
};

/**
 * Password Utilities
 */
const passwordUtils = {
    /**
     * Generate strong password
     */
    generateStrongPassword: (length = 12) => {
        const lowercase = 'abcdefghijklmnopqrstuvwxyz';
        const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const numbers = '0123456789';
        const symbols = '@$!%*?&';
        
        let password = '';
        password += arrayUtils.getRandomItem(uppercase);
        password += arrayUtils.getRandomItem(lowercase);
        password += arrayUtils.getRandomItem(numbers);
        password += arrayUtils.getRandomItem(symbols);
        
        const allChars = lowercase + uppercase + numbers + symbols;
        for (let i = 4; i < length; i++) {
            password += arrayUtils.getRandomItem(allChars);
        }
        
        return arrayUtils.shuffle(password.split('')).join('');
    },

    /**
     * Hash password with bcrypt
     */
    hashPassword: async (password) => {
        const bcrypt = require('bcryptjs');
        const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
        return await bcrypt.hash(password, saltRounds);
    },

    /**
     * Compare password with hash
     */
    comparePassword: async (password, hash) => {
        const bcrypt = require('bcryptjs');
        return await bcrypt.compare(password, hash);
    }
};

module.exports = {
    dbUtils,
    stringUtils,
    dateUtils,
    validationUtils,
    fileUtils,
    arrayUtils,
    responseUtils,
    passwordUtils
};
