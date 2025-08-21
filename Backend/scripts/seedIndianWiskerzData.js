const mongoose = require('mongoose');
require('dotenv').config();

// Import all models
const User = require('../models/user');
const Pet = require('../models/pet');
const Product = require('../models/product');
const PetType = require('../models/PetType');
const ProductCategory = require('../models/productCategory');
const Food = require('../models/food');
const BlogPost = require('../models/blogPost');
const BlogCategory = require('../models/blogCategory');
const Testimonial = require('../models/testimonial');
const Service = require('../models/service');
const AdoptionAgency = require('../models/adoptionAgency');
const Brands = require('../models/brands');

// Function to get product-specific images based on category and pet type
const getProductImages = (category, petType, productName) => {
    // Extract key terms for better image search
    const categoryKey = category.name.toLowerCase().replace(/[^a-z]/g, '');
    const petTypeKey = petType.name.toLowerCase().replace(/[^a-z]/g, '');
    
    // Determine search terms based on product name and category
    let searchTerms = [];
    const lowerProductName = productName.toLowerCase();
    
    if (lowerProductName.includes('food') || lowerProductName.includes('treat') || categoryKey.includes('food')) {
        searchTerms = [`${petTypeKey}+food`, 'pet+food', 'dog+treats', 'cat+food'];
    } else if (lowerProductName.includes('toy') || categoryKey.includes('toy')) {
        searchTerms = [`${petTypeKey}+toy`, 'pet+toy', 'dog+ball', 'cat+mouse'];
    } else if (lowerProductName.includes('bed') || lowerProductName.includes('blanket') || categoryKey.includes('bed')) {
        searchTerms = [`${petTypeKey}+bed`, 'pet+bed', 'dog+sleeping', 'cat+cushion'];
    } else if (lowerProductName.includes('collar') || lowerProductName.includes('leash') || lowerProductName.includes('harness')) {
        searchTerms = [`${petTypeKey}+collar`, 'pet+leash', 'dog+walk', 'pet+accessories'];
    } else if (lowerProductName.includes('groom') || lowerProductName.includes('brush') || lowerProductName.includes('shampoo')) {
        searchTerms = [`${petTypeKey}+grooming`, 'pet+grooming', 'dog+brush', 'cat+bath'];
    } else if (lowerProductName.includes('bowl') || lowerProductName.includes('feeder') || lowerProductName.includes('water')) {
        searchTerms = [`${petTypeKey}+bowl`, 'pet+bowl', 'dog+eating', 'cat+water'];
    } else if (lowerProductName.includes('carrier') || lowerProductName.includes('crate') || categoryKey.includes('travel')) {
        searchTerms = [`${petTypeKey}+carrier`, 'pet+travel', 'dog+crate', 'cat+carrier'];
    } else {
        // Default to general pet product images
        searchTerms = [`${petTypeKey}+${categoryKey}`, `${petTypeKey}+accessories`, 'pet+products', `${petTypeKey}+care`];
    }
    
    // Generate multiple images with different search terms
    return [
        `https://source.unsplash.com/400x400/?${searchTerms[0]}`,
        `https://source.unsplash.com/400x400/?${searchTerms[1] || searchTerms[0]}`,
        `https://source.unsplash.com/400x400/?${searchTerms[2] || searchTerms[0]}`
    ];
};

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URI || 'mongodb://localhost:27017/wiskerzandtail');
        console.log('✅ Connected to MongoDB for Indian Wiskerz & Tail data seeding');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
};

// Generate 100 Users with Indian names and details
const generateIndianUsers = () => {
    const indianFirstNames = [
        'Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Ayaan', 'Krishna', 'Ishaan',
        'Shaurya', 'Atharv', 'Advik', 'Pranav', 'Vedant', 'Kabir', 'Aryan', 'Yuvaan', 'Harsh', 'Daksh',
        'Ananya', 'Fatima', 'Ira', 'Prisha', 'Anvi', 'Riya', 'Myra', 'Sara', 'Anika', 'Kavya',
        'Navya', 'Diya', 'Pihu', 'Saanvi', 'Khushi', 'Angel', 'Pari', 'Moksha', 'Tara', 'Mahika',
        'Rajesh', 'Suresh', 'Deepak', 'Amit', 'Vikash', 'Rohit', 'Ajay', 'Ravi', 'Manoj', 'Vinod',
        'Priya', 'Kavita', 'Sunita', 'Meera', 'Pooja', 'Nisha', 'Seema', 'Rekha', 'Geeta', 'Maya',
        'Rahul', 'Sachin', 'Vikas', 'Nitin', 'Ashok', 'Pankaj', 'Sanjay', 'Raj', 'Kiran', 'Mohan',
        'Shweta', 'Neha', 'Ritu', 'Smita', 'Vandana', 'Rashmi', 'Sushma', 'Lata', 'Usha', 'Radha',
        'Arpit', 'Gaurav', 'Himanshu', 'Abhishek', 'Deepesh', 'Kaushal', 'Varun', 'Tarun', 'Akash', 'Naman',
        'Shreya', 'Divya', 'Preeti', 'Swati', 'Jyoti', 'Manisha', 'Sonia', 'Renu', 'Babita', 'Kiran'
    ];

    const indianLastNames = [
        'Sharma', 'Verma', 'Gupta', 'Agarwal', 'Bansal', 'Mittal', 'Jain', 'Goel', 'Singhal', 'Mahajan',
        'Singh', 'Kumar', 'Yadav', 'Mishra', 'Tiwari', 'Dubey', 'Shukla', 'Pandey', 'Chaturvedi', 'Srivastava',
        'Patel', 'Shah', 'Mehta', 'Dave', 'Joshi', 'Parekh', 'Desai', 'Vyas', 'Trivedi', 'Gandhi',
        'Reddy', 'Rao', 'Nair', 'Menon', 'Pillai', 'Krishnan', 'Iyer', 'Subramanian', 'Venkatesh', 'Prasad',
        'Khan', 'Ahmed', 'Ali', 'Hussain', 'Ansari', 'Sheikh', 'Qureshi', 'Malik', 'Rahman', 'Siddiqui'
    ];

    const indianCities = [
        { city: 'Mumbai', state: 'Maharashtra', zip: '400001' },
        { city: 'Delhi', state: 'Delhi', zip: '110001' },
        { city: 'Bangalore', state: 'Karnataka', zip: '560001' },
        { city: 'Hyderabad', state: 'Telangana', zip: '500001' },
        { city: 'Chennai', state: 'Tamil Nadu', zip: '600001' },
        { city: 'Kolkata', state: 'West Bengal', zip: '700001' },
        { city: 'Pune', state: 'Maharashtra', zip: '411001' },
        { city: 'Ahmedabad', state: 'Gujarat', zip: '380001' },
        { city: 'Jaipur', state: 'Rajasthan', zip: '302001' },
        { city: 'Lucknow', state: 'Uttar Pradesh', zip: '226001' },
        { city: 'Kanpur', state: 'Uttar Pradesh', zip: '208001' },
        { city: 'Nagpur', state: 'Maharashtra', zip: '440001' },
        { city: 'Indore', state: 'Madhya Pradesh', zip: '452001' },
        { city: 'Bhopal', state: 'Madhya Pradesh', zip: '462001' },
        { city: 'Visakhapatnam', state: 'Andhra Pradesh', zip: '530001' }
    ];

    const userTypes = ['Customer', 'Business', 'Agency'];
    const users = [];

    for (let i = 0; i < 100; i++) {
        const firstName = indianFirstNames[Math.floor(Math.random() * indianFirstNames.length)];
        const lastName = indianLastNames[Math.floor(Math.random() * indianLastNames.length)];
        const location = indianCities[Math.floor(Math.random() * indianCities.length)];
        const userType = userTypes[Math.floor(Math.random() * userTypes.length)];
        
        users.push({
            firstName,
            lastName,
            email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@wiskerzandtail.com`,
            password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBpkEOPj5h.tKq', // password123
            userType,
            phone: `+91-${Math.floor(Math.random() * 9000000000) + 1000000000}`,
            address: {
                street: `${Math.floor(Math.random() * 999) + 1} ${firstName} Street`,
                city: location.city,
                state: location.state,
                zipCode: location.zip,
                country: 'India'
            },
            isActive: true,
            isVerified: true,
            dateOfBirth: new Date(1980 + Math.floor(Math.random() * 25), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
            preferences: {
                petTypes: ['Dog', 'Cat', 'Bird'][Math.floor(Math.random() * 3)],
                communicationMethod: ['email', 'sms', 'phone'][Math.floor(Math.random() * 3)]
            }
        });
    }

    return users;
};

// Generate Indian Pet Brands
const generateIndianBrands = () => {
    return [
        {
            name: 'Pedigree India',
            description: 'Leading pet food brand in India',
            website: 'https://www.pedigree.in',
            country: 'India',
            foundedYear: 1957,
            isActive: true
        },
        {
            name: 'Whiskas India',
            description: 'Premium cat food brand',
            website: 'https://www.whiskas.in',
            country: 'India',
            foundedYear: 1958,
            isActive: true
        },
        {
            name: 'Drools',
            description: 'Indian premium pet food manufacturer',
            website: 'https://www.drools.in',
            country: 'India',
            foundedYear: 2000,
            isActive: true
        },
        {
            name: 'Farmina India',
            description: 'Natural and premium pet nutrition',
            website: 'https://www.farmina.com',
            country: 'India',
            foundedYear: 1965,
            isActive: true
        },
        {
            name: 'Royal Canin India',
            description: 'Scientific pet nutrition solutions',
            website: 'https://www.royalcanin.com',
            country: 'India',
            foundedYear: 1968,
            isActive: true
        },
        {
            name: 'Petspot India',
            description: 'Complete pet care solutions',
            website: 'https://www.petspot.in',
            country: 'India',
            foundedYear: 2010,
            isActive: true
        },
        {
            name: 'Purepet',
            description: 'Nutritious and affordable pet food',
            website: 'https://www.purepet.in',
            country: 'India',
            foundedYear: 2016,
            isActive: true
        },
        {
            name: 'Kennel Kitchen',
            description: 'Fresh and natural pet food',
            website: 'https://www.kennelkitchen.com',
            country: 'India',
            foundedYear: 2014,
            isActive: true
        }
    ];
};

// Generate Product Categories first
const generateProductCategories = () => {
    return [
        {
            name: 'Toys',
            slug: 'toys',
            description: 'Interactive and fun toys for pets',
            isActive: true
        },
        {
            name: 'Food & Treats',
            slug: 'food-treats',
            description: 'Nutritious food and delicious treats',
            isActive: true
        },
        {
            name: 'Grooming',
            slug: 'grooming',
            description: 'Grooming supplies and tools',
            isActive: true
        },
        {
            name: 'Accessories',
            slug: 'accessories',
            description: 'Essential pet accessories',
            isActive: true
        },
        {
            name: 'Health & Wellness',
            slug: 'health-wellness',
            description: 'Health care and wellness products',
            isActive: true
        },
        {
            name: 'Training',
            slug: 'training',
            description: 'Training aids and equipment',
            isActive: true
        },
        {
            name: 'Bedding',
            slug: 'bedding',
            description: 'Comfortable bedding for pets',
            isActive: true
        },
        {
            name: 'Travel',
            slug: 'travel',
            description: 'Travel accessories for pets',
            isActive: true
        }
    ];
};

// Generate Pet Types
const generatePetTypes = () => {
    return [
        {
            name: 'Dogs',
            slug: 'dogs',
            description: 'Domestic dogs of all breeds',
            isActive: true
        },
        {
            name: 'Cats',
            slug: 'cats',
            description: 'Domestic cats of all breeds',
            isActive: true
        },
        {
            name: 'Birds',
            slug: 'birds',
            description: 'Pet birds including parrots, canaries',
            isActive: true
        },
        {
            name: 'Fish',
            slug: 'fish',
            description: 'Aquarium fish and marine pets',
            isActive: true
        },
        {
            name: 'Small Pets',
            slug: 'small-pets',
            description: 'Rabbits, hamsters, guinea pigs',
            isActive: true
        }
    ];
};

// 200 Products 
const generateIndianProducts = (brands, categories, petTypes) => {
    const productNames = [
        'Premium Dog Biscuits', 'Cat Grooming Brush', 'Pet Bed Deluxe', 'Dog Leash Premium', 'Cat Scratching Post',
        'Pet Food Bowl Steel', 'Dog Toy Rope', 'Cat Toy Mouse', 'Pet Carrier Bag', 'Dog Shampoo Herbal',
        'Cat Litter Box', 'Pet Water Fountain', 'Dog Training Collar', 'Cat Tree House', 'Pet First Aid Kit',
        'Dog Nail Clipper', 'Cat Feeding Mat', 'Pet Blanket Soft', 'Dog Waste Bags', 'Cat Tunnel Toy',
        'Pet GPS Tracker', 'Dog Dental Chews', 'Cat Catnip Spray', 'Pet Travel Crate', 'Dog Rain Coat',
        'Cat Litter Scoop', 'Pet Vitamin Supplements', 'Dog Fetch Ball', 'Cat Interactive Toy', 'Pet Grooming Kit',
        'Dog Harness Adjustable', 'Cat Window Perch', 'Pet Heating Pad', 'Dog Treat Dispenser', 'Cat Collar Bell',
        'Pet Stain Remover', 'Dog Agility Set', 'Cat Food Puzzle', 'Pet Safety Gate', 'Dog Cooling Mat'
    ];

    const products = [];

    for (let i = 0; i < 100; i++) {
        const brand = brands[Math.floor(Math.random() * brands.length)];
        const baseName = productNames[Math.floor(Math.random() * productNames.length)];
        const category = categories[Math.floor(Math.random() * categories.length)];
        const petType = petTypes[Math.floor(Math.random() * petTypes.length)];
        const productName = `${brand.name} ${baseName} ${i}`;
        
        products.push({
            name: productName,
            slug: productName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
            description: `High-quality ${baseName.toLowerCase()} designed specifically for ${petType.name.toLowerCase()}s. Made with premium materials and tested for safety.`,
            price: Math.floor(Math.random() * 5000) + 100, // ₹100 to ₹5100
            originalPrice: Math.floor(Math.random() * 1000) + 50,
            category: category._id,
            brand: brand._id,
            petType: [petType._id],
            inStock: true,
            stockQuantity: Math.floor(Math.random() * 100) + 10,
            images: getProductImages(category, petType, productName),
            specifications: {
                material: ['Cotton', 'Plastic', 'Metal', 'Rubber', 'Wood'][Math.floor(Math.random() * 5)],
                size: ['Small', 'Medium', 'Large', 'XL'][Math.floor(Math.random() * 4)],
                weight: `${Math.floor(Math.random() * 5) + 0.5}kg`,
                color: ['Red', 'Blue', 'Green', 'Yellow', 'Black', 'White'][Math.floor(Math.random() * 6)]
            },
            features: [
                'Durable construction',
                'Easy to clean',
                'Safe for pets',
                'Non-toxic materials',
                'Ergonomic design'
            ],
            rating: (Math.random() * 2 + 3).toFixed(1), // 3.0 to 5.0
            numReviews: Math.floor(Math.random() * 500) + 10,
            tags: [category.name.toLowerCase(), petType.name.toLowerCase(), 'premium', 'indian-brand'],
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        });
    }

    return products;
};

//  Food Items
const generateIndianFoods = (brands) => {
    const foodNames = [
        'Chicken & Rice Formula', 'Mutton & Vegetable Mix', 'Fish & Sweet Potato', 'Egg & Oats Blend',
        'Lamb & Barley Recipe', 'Tuna & Salmon Feast', 'Chicken Liver Treats', 'Buffalo & Brown Rice',
        'Duck & Quinoa Formula', 'Turkey & Peas Recipe', 'Sardine & Potato Mix', 'Goat & Millet Blend',
        'Prawn & Rice Formula', 'Chicken & Pumpkin', 'Beef & Carrot Recipe', 'Mackerel & Sweet Corn',
        'Rabbit & Lentil Mix', 'Cod & Spinach Formula', 'Chicken Hearts Treats', 'Venison & Oat Recipe',
        'Salmon & Broccoli', 'Chicken & Beetroot', 'Tuna & Green Beans', 'Lamb & Cauliflower',
        'Duck & Sweet Potato', 'Turkey & Cabbage', 'Fish & Carrot Blend', 'Chicken & Peas Formula',
        'Mutton & Spinach Recipe', 'Egg & Vegetable Mix', 'Buffalo & Corn Formula', 'Prawn & Potato',
        'Goat & Rice Recipe', 'Sardine & Pumpkin', 'Chicken & Quinoa', 'Lamb & Sweet Corn',
        'Tuna & Oats Blend', 'Turkey & Barley', 'Fish & Millet Recipe', 'Chicken & Lentil Mix'
    ];

    const foodCategories = ['Dry Food', 'Wet Food', 'Treats', 'Supplements', 'Raw Food', 'Special Diet'];
    const ageGroups = ['Puppy/Kitten', 'Adult', 'Senior', 'All Ages'];
    const petTypes = ['Dog', 'Cat', 'Bird', 'Fish', 'Small Animals', 'All Pets'];
    const breedSizes = ['Small', 'Medium', 'Large', 'All Sizes'];
    const specialFeatures = [
        'Grain Free', 'Organic', 'Natural', 'Gluten Free', 'Limited Ingredients', 
        'Hypoallergenic', 'Veterinary Recommended', 'Made in USA', 'No Artificial Colors', 'No Preservatives'
    ];
    
    const foods = [];

    for (let i = 0; i < 100; i++) {
        const brand = brands[Math.floor(Math.random() * brands.length)];
        const baseName = foodNames[Math.floor(Math.random() * foodNames.length)];
        const category = foodCategories[Math.floor(Math.random() * foodCategories.length)];
        const ageGroup = ageGroups[Math.floor(Math.random() * ageGroups.length)];
        const petType = petTypes[Math.floor(Math.random() * petTypes.length)];
        const breedSize = breedSizes[Math.floor(Math.random() * breedSizes.length)];
        
        const ingredients = [
            'Real Chicken', 'Brown Rice', 'Sweet Potato', 'Peas', 'Carrots', 
            'Spinach', 'Flaxseed', 'Fish Oil', 'Turmeric', 'Coconut Oil'
        ];

        foods.push({
            name: `${brand.name} ${baseName} ${i}`,
            brand: brand.name,
            description: `Premium ${category.toLowerCase()} formulated for ${ageGroup.toLowerCase()} ${petType.toLowerCase()}s. Made with natural ingredients sourced from India for optimal nutrition and health.`,
            category: category,
            petType: petType,
            ageGroup: ageGroup,
            breedSize: breedSize,
            ingredients: ingredients.slice(0, Math.floor(Math.random() * 6) + 4),
            nutritionalInfo: {
                protein: Math.floor(Math.random() * 20) + 18, // 18-38%
                fat: Math.floor(Math.random() * 10) + 5,      // 5-15%
                fiber: Math.floor(Math.random() * 5) + 2,     // 2-7%
                moisture: Math.floor(Math.random() * 5) + 8,  // 8-13%
                calories: Math.floor(Math.random() * 100) + 350 // 350-450 kcal/cup
            },
            weight: Math.floor(Math.random() * 15) + 1, // 1-15 kg
            weightUnit: 'kg',
            price: Math.floor(Math.random() * 3000) + 200, // ₹200-3200
            originalPrice: Math.floor(Math.random() * 1000) + 3200, // ₹3200-4200
            discount: Math.floor(Math.random() * 30), // 0-30%
            inStock: Math.random() > 0.1, // 90% in stock
            stockQuantity: Math.floor(Math.random() * 200) + 50,
            images: [
                {
                    url: `https://source.unsplash.com/400x400/?${petType.toLowerCase()}+food`,
                    alt: `${petType} ${category} image`,
                    isPrimary: true
                },
                {
                    url: `https://source.unsplash.com/400x400/?pet+nutrition`,
                    alt: `${petType} food package`,
                    isPrimary: false
                }
            ],
            rating: {
                average: parseFloat((Math.random() * 1.5 + 3.5).toFixed(1)), // 3.5-5.0
                count: Math.floor(Math.random() * 200) + 50
            },
            reviews: [], // Empty reviews array as per schema
            tags: [category.toLowerCase(), petType.toLowerCase(), 'indian-made', 'premium'],
            specialFeatures: Math.random() > 0.5 ? 
                [specialFeatures[Math.floor(Math.random() * specialFeatures.length)]] : 
                [specialFeatures[Math.floor(Math.random() * specialFeatures.length)], specialFeatures[Math.floor(Math.random() * specialFeatures.length)]],
            manufacturer: {
                name: brand.name,
                country: 'India',
                contact: `contact@${brand.name.toLowerCase().replace(/\s+/g, '')}.in`
            },
            expiryDate: new Date(Date.now() + (365 * 24 * 60 * 60 * 1000)), // 1 year from now
            isActive: true,
            isFeatured: Math.random() > 0.8, // 20% featured
            isDealOfTheDay: Math.random() > 0.9, // 10% deal of the day
            views: Math.floor(Math.random() * 1000),
            salesCount: Math.floor(Math.random() * 100)
        });
    }

    return foods;
};

// Indian Adoption Agencies
const generateIndianAdoptionAgencies = () => {
    const agencyNames = [
        'Mumbai Pet Rescue Foundation',
        'Delhi Animal Welfare Society',
        'Bangalore Pet Adoption Center',
        'Chennai Stray Care Foundation',
        'Kolkata Animal Rescue',
        'Pune Pet Sanctuary',
        'Hyderabad Animal Shelter',
        'Ahmedabad Pet Care Foundation',
        'Jaipur Animal Welfare Trust',
        'Lucknow Pet Rescue Center'
    ];

    const cities = [
        { city: 'Mumbai', state: 'Maharashtra' },
        { city: 'Delhi', state: 'Delhi' },
        { city: 'Bangalore', state: 'Karnataka' },
        { city: 'Chennai', state: 'Tamil Nadu' },
        { city: 'Kolkata', state: 'West Bengal' },
        { city: 'Pune', state: 'Maharashtra' },
        { city: 'Hyderabad', state: 'Telangana' },
        { city: 'Ahmedabad', state: 'Gujarat' },
        { city: 'Jaipur', state: 'Rajasthan' },
        { city: 'Lucknow', state: 'Uttar Pradesh' }
    ];

    const availablePetTypes = ['Dogs', 'Cats', 'Rabbits', 'Birds', 'Fish', 'Small Pets'];

    return agencyNames.map((name, index) => {
        const location = cities[index];
        const streetNumber = Math.floor(Math.random() * 999) + 1;
        const zipCode = Math.floor(Math.random() * 900000) + 100000;
        const phone = `+91-${Math.floor(Math.random() * 9000000000) + 1000000000}`;
        
        return {
            name: name,
            description: `Dedicated to rescuing, rehabilitating and rehoming stray and abandoned animals in ${location.city}. We provide medical care, shelter, and find loving homes for pets.`,
            address: `${streetNumber} Animal Care Street, ${location.city}, ${location.state} ${zipCode}, India`,
            contactInfo: `Phone: ${phone}, Email: contact@${name.toLowerCase().replace(/\s+/g, '').replace(/'/g, '')}.org`,
            availablePetTypes: availablePetTypes.slice(0, Math.floor(Math.random() * 4) + 2), // Random 2-6 pet types
            image: `https://source.unsplash.com/800x400/?animal+shelter`,
            rating: parseFloat((Math.random() * 1.5 + 3.5).toFixed(1)), // 3.5-5.0
            numReviews: Math.floor(Math.random() * 200) + 20
        };
    });
};

//  Sample Pets for adoption
const generateIndianPets = (agencies) => {
    const dogBreeds = [
        'Indian Pariah', 'Labrador Retriever', 'Golden Retriever', 'German Shepherd', 'Beagle',
        'Pomeranian', 'Shih Tzu', 'Dachshund', 'Bulldog', 'Boxer', 'Rottweiler', 'Doberman'
    ];
    
    const catBreeds = [
        'Indian Shorthair', 'Persian', 'Siamese', 'Maine Coon', 'British Shorthair',
        'Bengal', 'Himalayan', 'Ragdoll', 'Russian Blue', 'Scottish Fold'
    ];

    const petNames = [
        'Buddy', 'Bella', 'Charlie', 'Luna', 'Max', 'Lucy', 'Cooper', 'Molly', 'Rocky', 'Sadie',
        'Arjun', 'Priya', 'Karan', 'Meera', 'Raj', 'Kavya', 'Dev', 'Anya', 'Veer', 'Diya'
    ];

    const pets = [];

    for (let i = 0; i < 50; i++) {
        const agency = agencies[Math.floor(Math.random() * agencies.length)];
        const petType = Math.random() > 0.7 ? 'Cat' : 'Dog';
        const breeds = petType === 'Dog' ? dogBreeds : catBreeds;
        const breed = breeds[Math.floor(Math.random() * breeds.length)];
        const name = petNames[Math.floor(Math.random() * petNames.length)];

        pets.push({
            ownerId: agency._id, // Using agency as owner for adoption center pets
            name: `${name} ${i}`, // Make names unique
            type: petType, // Schema expects 'type' not 'species'
            breed: breed,
            age: Math.floor(Math.random() * 8) + 1,
            gender: Math.random() > 0.5 ? 'Male' : 'Female',
            medicalNotes: Math.random() > 0.8 ? 'Requires special attention' : 'Healthy and up to date with vaccinations',
            profilePicture: `https://source.unsplash.com/400x400/?${petType.toLowerCase()}`
        });
    }

    return pets;
};

// Blog Categories and Posts
const generateIndianBlogData = () => {
    const categories = [
        {
            name: 'Pet Care Tips',
            slug: 'pet-care-tips',
            description: 'Essential tips for caring for your pets in Indian climate',
            isActive: true
        },
        {
            name: 'Pet Health',
            slug: 'pet-health',
            description: 'Health and wellness information for Indian pet owners',
            isActive: true
        },
        {
            name: 'Pet Training',
            slug: 'pet-training',
            description: 'Training guides and behavioral tips',
            isActive: true
        },
        {
            name: 'Pet Stories',
            slug: 'pet-stories',
            description: 'Heartwarming stories from Indian pet families',
            isActive: true
        },
        {
            name: 'Pet Nutrition',
            slug: 'pet-nutrition',
            description: 'Nutrition advice suitable for Indian pets',
            isActive: true
        }
    ];

    const blogPosts = [
        {
            title: 'Caring for Pets During Indian Monsoons',
            slug: 'caring-for-pets-during-indian-monsoons',
            content: 'The monsoon season in India brings unique challenges for pet owners. Here are essential tips to keep your furry friends safe and healthy during the rainy season...',
            excerpt: 'Essential monsoon care tips for Indian pet owners',
            author: 'Dr. Priya Sharma',
            status: 'published',
            tags: ['monsoon', 'pet-care', 'health', 'indian-climate'],
            readTime: 8,
            isActive: true,
            publishedAt: new Date()
        },
        {
            title: 'Best Indian Dog Breeds for Apartments',
            slug: 'best-indian-dog-breeds-for-apartments',
            content: 'Living in an apartment doesn\'t mean you can\'t have a dog. Here are the best Indian dog breeds that adapt well to apartment living...',
            excerpt: 'Discover the perfect dog breeds for Indian apartment living',
            author: 'Rajesh Kumar',
            status: 'published',
            tags: ['dog-breeds', 'apartment-living', 'indian-dogs'],
            readTime: 6,
            isActive: true,
            publishedAt: new Date()
        },
        {
            title: 'Traditional Indian Remedies for Pet Care',
            slug: 'traditional-indian-remedies-for-pet-care',
            content: 'India has a rich tradition of natural remedies. Learn about safe, traditional methods to care for your pets using Indian herbs and practices...',
            excerpt: 'Explore safe traditional Indian remedies for pet wellness',
            author: 'Dr. Meera Patel',
            status: 'published',
            tags: ['traditional-remedies', 'ayurveda', 'natural-care'],
            readTime: 10,
            isActive: true,
            publishedAt: new Date()
        }
    ];

    return { categories, blogPosts };
};

//  Services
const generateIndianServices = () => {
    return [
        {
            name: 'Pet Grooming',
            slug: 'pet-grooming',
            tagline: 'Keep your pets clean and stylish',
            description: 'Professional grooming services for all pet types including nail trimming, ear cleaning, and styling',
            category: 'Grooming',
            startingPrice: 800,
            isBookable: true,
            isActive: true
        },
        {
            name: 'Veterinary Consultation',
            slug: 'veterinary-consultation',
            tagline: 'Expert healthcare for your beloved pets',
            description: '24/7 veterinary care and consultation with experienced doctors',
            category: 'Health',
            startingPrice: 500,
            isBookable: true,
            isActive: true
        },
        {
            name: 'Pet Training',
            slug: 'pet-training',
            tagline: 'Well-behaved pets, happy families',
            description: 'Basic and advanced pet training sessions for obedience and behavioral correction',
            category: 'Training',
            startingPrice: 1200,
            isBookable: true,
            isActive: true
        },
        {
            name: 'Pet Boarding',
            slug: 'pet-boarding',
            tagline: 'A home away from home for your pets',
            description: 'Safe and comfortable boarding facilities with 24/7 care and supervision',
            category: 'Boarding',
            startingPrice: 1000,
            isBookable: true,
            isActive: true
        },
        {
            name: 'Pet Taxi',
            slug: 'pet-taxi',
            tagline: 'Safe rides for your furry friends',
            description: 'Safe transportation for your pets with trained drivers and AC vehicles',
            category: 'Pet Taxi',
            startingPrice: 300,
            isBookable: true,
            isActive: true
        },
        {
            name: 'Pet Vaccination',
            slug: 'pet-vaccination',
            tagline: 'Protect your pets with timely vaccines',
            description: 'Complete vaccination schedule for dogs, cats, and other pets with authentic vaccines',
            category: 'Health',
            startingPrice: 400,
            isBookable: true,
            isActive: true
        },
        {
            name: 'Pet Dental Care',
            slug: 'pet-dental-care',
            tagline: 'Healthy teeth, happy pets',
            description: 'Professional dental cleaning, scaling, and oral health checkups for pets',
            category: 'Health',
            startingPrice: 600,
            isBookable: true,
            isActive: true
        },
        {
            name: 'Pet Photography',
            slug: 'pet-photography',
            tagline: 'Capture precious moments with your pets',
            description: 'Professional pet photography sessions for portraits and special occasions',
            category: 'Other',
            startingPrice: 1500,
            isBookable: true,
            isActive: true
        },
        {
            name: 'Pet Nutrition Consultation',
            slug: 'pet-nutrition-consultation',
            tagline: 'Customized diet plans for optimal health',
            description: 'Expert nutrition consultation and customized diet plans based on your pet\'s needs',
            category: 'Nutrition',
            startingPrice: 350,
            isBookable: true,
            isActive: true
        },
        {
            name: 'Pet Daycare',
            slug: 'pet-daycare',
            tagline: 'Fun and safe daytime care for pets',
            description: 'Daily care service for pets while you\'re at work with play time and socialization',
            category: 'Boarding',
            startingPrice: 800,
            isBookable: true,
            isActive: true
        },
        {
            name: 'Pet Emergency Care',
            slug: 'pet-emergency-care',
            tagline: '24/7 emergency medical assistance',
            description: 'Round-the-clock emergency veterinary care for critical situations',
            category: 'Health',
            startingPrice: 1000,
            isBookable: true,
            isActive: true
        },
        {
            name: 'Pet Behavioral Therapy',
            slug: 'pet-behavioral-therapy',
            tagline: 'Address behavioral issues with expert care',
            description: 'Specialized behavioral therapy for aggressive, anxious, or problematic pets',
            category: 'Training',
            startingPrice: 1500,
            isBookable: true,
            isActive: true
        },
        {
            name: 'Pet Spa Treatment',
            slug: 'pet-spa-treatment',
            tagline: 'Luxury spa experience for your pets',
            description: 'Premium spa treatments including aromatherapy, massage, and luxury grooming',
            category: 'Grooming',
            startingPrice: 1200,
            isBookable: true,
            isActive: true
        },
        {
            name: 'Pet Insurance Consultation',
            slug: 'pet-insurance-consultation',
            tagline: 'Secure your pet\'s future with insurance',
            description: 'Guidance on choosing the right pet insurance plans and coverage options',
            category: 'Consultation',
            startingPrice: 200,
            isBookable: true,
            isActive: true
        },
        {
            name: 'Pet Adoption Counseling',
            slug: 'pet-adoption-counseling',
            tagline: 'Find the perfect pet for your family',
            description: 'Expert counseling to help you choose and adopt the right pet for your lifestyle',
            category: 'Consultation',
            startingPrice: 300,
            isBookable: true,
            isActive: true
        }
    ];
};

//  Testimonials
const generateIndianTestimonials = () => {
    return [
        {
            authorName: 'Priya Sharma',
            authorTitle: 'Pet Owner',
            rating: 5,
            quote: 'Wiskerz & Tail has been amazing for my Golden Retriever. The grooming service is top-notch and the staff is very caring.',
            serviceUsed: 'Grooming',
            isApproved: true,
            authorImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&q=80'
        },
        {
            authorName: 'Rajesh Patel',
            authorTitle: 'Cat Lover',
            rating: 5,
            quote: 'I have been using their services for 2 years. My cats love coming here and the veterinary care is excellent.',
            serviceUsed: 'Veterinary',
            isApproved: true,
            authorImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&q=80'
        },
        {
            authorName: 'Meera Reddy',
            authorTitle: 'Dog Trainer',
            rating: 4,
            quote: 'My German Shepherd was very aggressive, but after training at Wiskerz & Tail, he is much more calm and obedient.',
            serviceUsed: 'Training',
            isApproved: true,
            authorImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b5bb?w=80&h=80&fit=crop&q=80'
        },
        {
            authorName: 'Amit Kumar',
            authorTitle: 'Pet Parent',
            rating: 5,
            quote: 'The pet boarding facility is excellent. My dogs were happy and well-cared for during my vacation.',
            serviceUsed: 'Boarding',
            isApproved: true,
            authorImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&q=80'
        },
        {
            authorName: 'Neha Singh',
            authorTitle: 'Bird Enthusiast',
            rating: 4,
            quote: 'Great experience with their consultation services. Very knowledgeable staff who helped with my parrot\'s health issues.',
            serviceUsed: 'Consultation',
            isApproved: true,
            authorImage: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=80&h=80&fit=crop&q=80'
        },
        {
            authorName: 'Arjun Joshi',
            authorTitle: 'Dog Owner',
            rating: 5,
            quote: 'The pet taxi service is a lifesaver! Professional drivers who really care about animal safety. Highly recommended.',
            serviceUsed: 'Pet Taxi',
            isApproved: true,
            authorImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&q=80'
        },
        {
            authorName: 'Kavya Iyer',
            authorTitle: 'Cat Parent',
            rating: 5,
            quote: 'The vaccination service was smooth and stress-free for my cat. The vet was gentle and explained everything clearly.',
            serviceUsed: 'Vaccination',
            isApproved: true,
            authorImage: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=80&h=80&fit=crop&q=80'
        },
        {
            authorName: 'Rohit Gupta',
            authorTitle: 'Pet Enthusiast',
            rating: 4,
            quote: 'Amazing pet photography session! They captured my dog\'s personality perfectly. The photos are now my wallpaper.',
            serviceUsed: 'Photography',
            isApproved: true,
            authorImage: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=80&h=80&fit=crop&q=80'
        },
        {
            authorName: 'Divya Agarwal',
            authorTitle: 'Pet Nutritionist',
            rating: 5,
            quote: 'The nutrition consultation helped me create a perfect diet plan for my diabetic dog. Very professional service.',
            serviceUsed: 'Nutrition',
            isApproved: true,
            authorImage: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=80&h=80&fit=crop&q=80'
        },
        {
            authorName: 'Karan Mehta',
            authorTitle: 'Working Professional',
            rating: 5,
            quote: 'Pet daycare is perfect for busy professionals like me. My dog loves the playtime and socialization.',
            serviceUsed: 'Daycare',
            isApproved: true,
            authorImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&h=80&fit=crop&q=80'
        },
        {
            authorName: 'Sunita Rao',
            authorTitle: 'Senior Citizen',
            rating: 4,
            quote: 'When my cat had an emergency at midnight, they responded immediately. Thank god for their 24/7 service.',
            serviceUsed: 'Emergency Care',
            isApproved: true,
            authorImage: 'https://images.unsplash.com/photo-1485875437342-9b39470b3d95?w=80&h=80&fit=crop&q=80'
        },
        {
            authorName: 'Varun Kapoor',
            authorTitle: 'Dog Trainer',
            rating: 5,
            quote: 'The behavioral therapy sessions worked wonders for my rescue dog. He\'s now much more confident and social.',
            serviceUsed: 'Behavioral Therapy',
            isApproved: true,
            authorImage: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=80&h=80&fit=crop&q=80'
        },
        {
            authorName: 'Anita Mishra',
            authorTitle: 'Pet Groomer',
            rating: 5,
            quote: 'The spa treatment made my Persian cat look and feel amazing. The aromatherapy was so relaxing for her.',
            serviceUsed: 'Spa Treatment',
            isApproved: true,
            authorImage: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=80&h=80&fit=crop&q=80'
        },
        {
            authorName: 'Sachin Verma',
            authorTitle: 'First-time Pet Owner',
            rating: 4,
            quote: 'The insurance consultation helped me understand pet insurance better. Now I feel secure about my pet\'s future.',
            serviceUsed: 'Insurance Consultation',
            isApproved: true,
            authorImage: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=80&h=80&fit=crop&q=80'
        },
        {
            authorName: 'Rekha Nair',
            authorTitle: 'Animal Lover',
            rating: 5,
            quote: 'The adoption counseling was incredibly helpful. They helped me find the perfect companion for my family.',
            serviceUsed: 'Adoption Counseling',
            isApproved: true,
            authorImage: 'https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?w=80&h=80&fit=crop&q=80'
        }
    ];
};

// Main seeding function
const seedDatabase = async () => {
    try {
        console.log('🌱 Starting comprehensive Indian Wiskerz & Tail database seeding...');

        // Clear existing data
        console.log('🗑️ Clearing existing data...');
        await Promise.all([
            User.deleteMany({}),
            Product.deleteMany({}),
            Food.deleteMany({}),
            Pet.deleteMany({}),
            AdoptionAgency.deleteMany({}),
            Brands.deleteMany({}),
            ProductCategory.deleteMany({}),
            PetType.deleteMany({}),
            BlogCategory.deleteMany({}),
            BlogPost.deleteMany({}),
            Service.deleteMany({}),
            Testimonial.deleteMany({})
        ]);

        // Generate and seed brands first (needed for products/foods)
        console.log('🏷️ Seeding Indian brands...');
        const brandsData = generateIndianBrands();
        const savedBrands = await Brands.insertMany(brandsData);
        console.log(`✅ ${savedBrands.length} brands seeded successfully`);

        // Generate and seed product categories
        console.log('📂 Seeding product categories...');
        const categoriesData = generateProductCategories();
        const savedCategories = await ProductCategory.insertMany(categoriesData);
        console.log(`✅ ${savedCategories.length} product categories seeded successfully`);

        // Generate and seed pet types
        console.log('🐾 Seeding pet types...');
        const petTypesData = generatePetTypes();
        const savedPetTypes = await PetType.insertMany(petTypesData);
        console.log(`✅ ${savedPetTypes.length} pet types seeded successfully`);

        // Generate and seed users
        console.log('👥 Seeding 100 Indian users...');
        const usersData = generateIndianUsers();
        const savedUsers = await User.insertMany(usersData);
        console.log(`✅ ${savedUsers.length} users seeded successfully`);

        // Generate and seed products
        console.log('📦 Seeding 100 Indian products...');
        const productsData = generateIndianProducts(savedBrands, savedCategories, savedPetTypes);
        const savedProducts = await Product.insertMany(productsData);
        console.log(`✅ ${savedProducts.length} products seeded successfully`);

        // Generate and seed foods
        console.log('🍖 Seeding 100 Indian food items...');
        const foodsData = generateIndianFoods(savedBrands);
        const savedFoods = await Food.insertMany(foodsData);
        console.log(`✅ ${savedFoods.length} food items seeded successfully`);

        // Generate and seed adoption agencies
        console.log('🏠 Seeding Indian adoption agencies...');
        const agenciesData = generateIndianAdoptionAgencies();
        const savedAgencies = await AdoptionAgency.insertMany(agenciesData);
        console.log(`✅ ${savedAgencies.length} adoption agencies seeded successfully`);

        // Generate and seed pets
        console.log('🐕 Seeding pets for adoption...');
        const petsData = generateIndianPets(savedAgencies);
        const savedPets = await Pet.insertMany(petsData);
        console.log(`✅ ${savedPets.length} pets seeded successfully`);

        // Generate and seed blog data
        console.log('📝 Seeding blog categories and posts...');
        const { categories, blogPosts } = generateIndianBlogData();
        const savedBlogCategories = await BlogCategory.insertMany(categories);
        
        // Now create blog posts with proper category references
        const blogPostsWithCategories = blogPosts.map((post, index) => ({
            ...post,
            category: savedBlogCategories[index % savedBlogCategories.length]._id
        }));
        
        const savedBlogPosts = await BlogPost.insertMany(blogPostsWithCategories);
        console.log(`✅ ${savedBlogCategories.length} blog categories and ${savedBlogPosts.length} blog posts seeded successfully`);

        // Generate and seed services
        console.log('🛠️ Seeding services...');
        const servicesData = generateIndianServices();
        const savedServices = await Service.insertMany(servicesData);
        console.log(`✅ ${savedServices.length} services seeded successfully`);

        // Generate and seed testimonials
        console.log('⭐ Seeding testimonials...');
        const testimonialsData = generateIndianTestimonials();
        const savedTestimonials = await Testimonial.insertMany(testimonialsData);
        console.log(`✅ ${savedTestimonials.length} testimonials seeded successfully`);

        console.log('\n🎉 DATABASE SEEDING COMPLETED SUCCESSFULLY!');
        console.log('\n📊 SEEDING SUMMARY:');
        console.log(`👥 Users: ${savedUsers.length}`);
        console.log(`🏷️ Brands: ${savedBrands.length}`);
        console.log(`� Product Categories: ${savedCategories.length}`);
        console.log(`🐾 Pet Types: ${savedPetTypes.length}`);
        console.log(`�📦 Products: ${savedProducts.length}`);
        console.log(`🍖 Food Items: ${savedFoods.length}`);
        console.log(`🏠 Adoption Agencies: ${savedAgencies.length}`);
        console.log(`🐕 Pets: ${savedPets.length}`);
        console.log(`📝 Blog Categories: ${savedBlogCategories.length}`);
        console.log(`📰 Blog Posts: ${savedBlogPosts.length}`);
        console.log(`🛠️ Services: ${savedServices.length}`);
        console.log(`⭐ Testimonials: ${savedTestimonials.length}`);
        console.log('\n✨ Your Wiskerz & Tail database is now ready with comprehensive Indian data!');

    } catch (error) {
        console.error('❌ Error during seeding:', error);
        throw error;
    }
};

// Run the seeding script
const runSeed = async () => {
    try {
        await connectDB();
        await seedDatabase();
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
};

// Export for use in other files
module.exports = {
    seedDatabase,
    generateIndianUsers,
    generateIndianBrands,
    generateIndianProducts,
    generateIndianFoods,
    generateIndianAdoptionAgencies
};

// Run if called directly
if (require.main === module) {
    runSeed();
}
