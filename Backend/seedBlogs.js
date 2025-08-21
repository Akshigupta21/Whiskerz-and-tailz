const mongoose = require('mongoose');
const BlogPost = require('./models/blogPost');
const BlogCategory = require('./models/blogCategory');
require('dotenv').config();

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URI || 'mongodb://localhost:27017/wiskerzandtail');
        console.log('✅ Connected to MongoDB for seeding');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
};

// Sample blog categories
const categories = [
    {
        name: 'Pet Care',
        slug: 'pet-care',
        description: 'General pet care tips and advice'
    },
    {
        name: 'Health',
        slug: 'health',
        description: 'Pet health and wellness information'
    },
    {
        name: 'Nutrition',
        slug: 'nutrition',
        description: 'Pet nutrition and feeding guides'
    },
    {
        name: 'Training',
        slug: 'training',
        description: 'Pet training tips and techniques'
    },
    {
        name: 'Grooming',
        slug: 'grooming',
        description: 'Pet grooming tips and tutorials'
    }
];

// Sample blog posts
const blogPosts = [
    {
        title: "10 Essential Tips for New Pet Owners",
        slug: "essential-tips-new-pet-owners",
        author: "Dr. Sarah Johnson",
        content: `Bringing home a new pet is one of life's greatest joys, but it can also be overwhelming. Whether you're adopting your first puppy, kitten, or any other furry friend, preparation is key to ensuring a smooth transition for both you and your new companion.

**1. Pet-Proof Your Home**
Before your new pet arrives, take time to pet-proof your living space. Remove toxic plants, secure loose wires, and store harmful substances out of reach. Think from your pet's perspective and identify potential hazards.

**2. Stock Up on Essentials**
Make sure you have all the basic supplies before bringing your pet home: food and water bowls, appropriate food, a comfortable bed, toys, grooming supplies, and a first-aid kit.

**3. Establish a Routine**
Pets thrive on routine. Set regular times for feeding, walks, play, and sleep. This helps your new pet feel secure and makes training easier.

**4. Find a Good Veterinarian**
Research and choose a veterinarian before you need one. Schedule a check-up within the first week of bringing your pet home.

**5. Start Training Early**
Begin basic training immediately. House training, basic commands, and socialization are crucial during the first few weeks.

**6. Be Patient with the Adjustment Period**
Every pet adjusts at their own pace. Some may settle in within days, while others might take weeks or even months.

**7. Provide Mental Stimulation**
Keep your pet's mind active with puzzle toys, training sessions, and new experiences appropriate for their age and species.

**8. Learn Your Pet's Body Language**
Understanding your pet's signals will help you respond to their needs and build a stronger bond.

**9. Plan for Emergencies**
Know the location of the nearest emergency vet clinic and keep important contact numbers easily accessible.

**10. Enjoy the Journey**
Remember that building a relationship with your pet takes time. Be patient, stay positive, and enjoy watching your new companion settle into their forever home.`,
        excerpt: "Everything you need to know before bringing home your new furry friend, from preparation to building lasting bonds.",
        category: 'Pet Care',
        tags: ['beginner', 'tips', 'new-owners', 'preparation'],
        featuredImage: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&h=400&fit=crop',
        isFeatured: true,
        views: 234
    },
    {
        title: "Understanding Pet Nutrition: A Complete Guide",
        slug: "understanding-pet-nutrition-complete-guide",
        author: "Dr. Emily Rodriguez",
        content: `Proper nutrition is the foundation of your pet's health and longevity. Understanding what your pet needs nutritionally can help prevent disease, maintain a healthy weight, and ensure a long, happy life.

**Understanding Macronutrients**
Just like humans, pets need a balanced intake of proteins, fats, and carbohydrates. Proteins are essential for muscle development and repair, fats provide energy and support skin health, while carbohydrates offer quick energy.

**Life Stage Nutrition**
Nutritional needs change throughout your pet's life. Puppies and kittens need more calories and specific nutrients for growth, while senior pets may need adjusted portions and specialized nutrients for joint health.

**Reading Pet Food Labels**
Learn to read and understand pet food labels. Look for named protein sources as the first ingredient, avoid excessive fillers, and choose foods that meet AAFCO (Association of American Feed Control Officials) standards.

**Common Nutritional Mistakes**
Many pet owners unknowingly make nutritional errors: overfeeding, giving too many treats, feeding inappropriate human foods, or frequently changing diets without transition periods.

**Special Dietary Needs**
Some pets may require special diets due to allergies, health conditions, or breed-specific needs. Always consult with your veterinarian before making significant dietary changes.

**Hydration is Key**
Don't forget about water! Fresh, clean water should always be available. Some pets prefer running water, so consider a pet fountain if your pet doesn't drink enough.

**Treats and Supplements**
Treats should not exceed 10% of your pet's daily caloric intake. Most pets on balanced diets don't need supplements unless recommended by a veterinarian.`,
        excerpt: "Everything you need to know about pet nutrition, from basic needs to special diets and feeding guidelines.",
        category: 'Nutrition',
        tags: ['nutrition', 'feeding', 'health', 'diet'],
        featuredImage: 'https://images.unsplash.com/photo-1546975490-e8b92a360b24?w=800&h=400&fit=crop',
        isFeatured: true,
        views: 189
    },
    {
        title: "Seasonal Pet Care: Keeping Your Pets Safe Year-Round",
        slug: "seasonal-pet-care-year-round-safety",
        author: "Dr. Michael Chen",
        content: `Each season brings unique challenges and opportunities for pet care. Understanding how to adjust your pet care routine throughout the year ensures your furry friends stay healthy and comfortable in any weather.

**Spring Care Tips**
Spring is renewal time, but it also brings specific challenges. Watch for seasonal allergies, increase parasite prevention as fleas and ticks become active, and be cautious with spring cleaning products that might be toxic to pets.

**Summer Safety**
Hot weather can be dangerous for pets. Never leave pets in cars, provide plenty of shade and water, limit outdoor activities during peak heat hours, and watch for signs of heat stroke. Keep their paws safe from hot pavement.

**Fall Preparations**
As temperatures cool, it's time to prepare for winter. Update vaccinations, adjust feeding amounts as activity levels may change, and prepare outdoor shelters if you have outdoor pets.

**Winter Precautions**
Cold weather requires special attention. Provide warm shelter, adjust food portions as pets burn more calories staying warm, protect paws from ice and salt, and watch for signs of hypothermia.

**Year-Round Essentials**
Regardless of season, maintain regular vet check-ups, keep identification tags current, maintain exercise routines (adjusted for weather), and always have emergency supplies ready.

**Weather-Specific Concerns**
Learn to recognize weather-related health issues: heat stroke in summer, hypothermia in winter, seasonal depression in some pets, and how weather changes can affect arthritis in older pets.`,
        excerpt: "Complete guide to keeping your pets healthy and safe through all four seasons with specific tips for each time of year.",
        category: 'Health',
        tags: ['seasonal', 'safety', 'health', 'weather'],
        featuredImage: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&h=400&fit=crop',
        views: 156
    },
    {
        title: "The Science of Positive Reinforcement Training",
        slug: "science-positive-reinforcement-training",
        author: "Mark Wilson, Certified Dog Trainer",
        content: `Positive reinforcement training is not just a humane approach to pet training—it's scientifically proven to be the most effective method for teaching new behaviors and strengthening the bond between you and your pet.

**What is Positive Reinforcement?**
Positive reinforcement involves adding something pleasant (like treats, praise, or play) immediately after a desired behavior occurs, increasing the likelihood that the behavior will be repeated.

**The Science Behind It**
Research in animal behavior shows that positive reinforcement creates positive associations with learning, reduces stress and anxiety, builds confidence in shy pets, and strengthens the human-animal bond.

**Timing is Everything**
The key to successful positive reinforcement is timing. Rewards must be given immediately (within 3 seconds) after the desired behavior for the pet to make the connection.

**Types of Rewards**
Different pets are motivated by different things: food treats, verbal praise, physical affection, play time, or access to preferred activities. Discover what motivates your individual pet most.

**Common Training Mistakes**
Avoid these common errors: delayed rewards, inconsistent commands, punishment-based methods, training when frustrated, and expecting immediate results.

**Building a Training Plan**
Start with simple commands, keep training sessions short (5-10 minutes), practice in low-distraction environments first, gradually increase difficulty, and always end on a positive note.

**Troubleshooting Challenges**
If your pet isn't responding, consider: are rewards valuable enough? Is timing correct? Are you asking too much too fast? Is the environment too distracting?`,
        excerpt: "Discover why positive reinforcement is the most effective training method and how to implement it successfully with your pet.",
        category: 'Training',
        tags: ['training', 'behavior', 'positive-reinforcement', 'science'],
        featuredImage: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&h=400&fit=crop',
        views: 203
    },
    {
        title: "DIY Pet Grooming: Professional Results at Home",
        slug: "diy-pet-grooming-professional-results",
        author: "Lisa Martinez, Professional Groomer",
        content: `Regular grooming is essential for your pet's health and comfort. While professional grooming has its place, learning basic grooming skills can save money and strengthen your bond with your pet.

**Essential Grooming Tools**
Invest in quality tools: appropriate brushes for your pet's coat type, nail clippers, ear cleaning solution, toothbrush and pet toothpaste, and mild pet shampoo.

**Brushing Techniques**
Regular brushing prevents matting, reduces shedding, and distributes natural oils. Brush in the direction of hair growth, work through tangles gently, and pay special attention to areas prone to matting.

**Nail Care Basics**
Trim nails regularly to prevent overgrowth and splitting. Cut only the white tip, avoiding the pink quick. If you accidentally cut the quick, apply styptic powder to stop bleeding.

**Ear Cleaning**
Clean ears weekly using a veterinarian-approved ear cleaner. Never use cotton swabs deep in the ear canal. Watch for signs of infection: odor, redness, or excessive scratching.

**Dental Care**
Brush your pet's teeth regularly with pet-safe toothpaste. Start slowly, letting your pet get used to the toothbrush and taste. Dental chews and water additives can supplement brushing.

**Bathing Best Practices**
Most pets need baths monthly unless they get especially dirty. Use lukewarm water, wet thoroughly, shampoo gently, rinse completely, and dry thoroughly to prevent skin issues.

**When to Seek Professional Help**
Some situations require professional groomers: severe matting, aggressive behavior during grooming, breed-specific cuts, or if you're uncomfortable with any grooming task.`,
        excerpt: "Learn professional grooming techniques you can master at home to keep your pet healthy, comfortable, and looking great.",
        category: 'Grooming',
        tags: ['grooming', 'diy', 'maintenance', 'tools'],
        featuredImage: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&h=400&fit=crop',
        views: 178
    }
];

// Seed function
const seedDatabase = async () => {
    try {
        console.log('🌱 Starting database seeding...');

        // Clear existing data
        await BlogPost.deleteMany({});
        await BlogCategory.deleteMany({});
        console.log('🗑️  Cleared existing blog data');

        // Create categories
        const createdCategories = await BlogCategory.insertMany(categories);
        console.log(`✅ Created ${createdCategories.length} blog categories`);

        // Create a map of category names to IDs
        const categoryMap = {};
        createdCategories.forEach(cat => {
            categoryMap[cat.name] = cat._id;
        });

        // Add category IDs to blog posts
        const postsWithCategories = blogPosts.map(post => ({
            ...post,
            category: categoryMap[post.category],
            publishDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) // Random date within last 30 days
        }));

        // Create blog posts
        const createdPosts = await BlogPost.insertMany(postsWithCategories);
        console.log(`✅ Created ${createdPosts.length} blog posts`);

        console.log('🎉 Database seeding completed successfully!');
        console.log('\nCreated blog posts:');
        createdPosts.forEach((post, index) => {
            console.log(`  ${index + 1}. ${post.title} (${post.views} views)`);
        });

    } catch (error) {
        console.error('❌ Error seeding database:', error);
    } finally {
        await mongoose.connection.close();
        console.log('🔌 Database connection closed');
    }
};

// Run the seeder
const run = async () => {
    await connectDB();
    await seedDatabase();
};

// Execute if run directly
if (require.main === module) {
    run();
}

module.exports = { seedDatabase, connectDB };
