const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const Notification = require("../models/Notification");
require("dotenv").config();

const seedDatabase = async () => {
  try {
    console.log("Starting database seeding...");

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Clear existing data
    await User.deleteMany({});
    await Post.deleteMany({});
    await Comment.deleteMany({});
    await Notification.deleteMany({});
    console.log("Cleared existing data");

    // Hash password for all users
    const hashedPassword = await bcrypt.hash("password123", 10);

    // Create Users
    const users = await User.insertMany([
      {
        name: "John Doe",
        username: "johndoe",
        email: "john@example.com",
        password: hashedPassword,
        role: "admin",
        profileImage: "https://i.pravatar.cc/150?img=1",
        followers: [],
        following: [],
      },
      {
        name: "Jane Smith",
        username: "janesmith",
        email: "jane@example.com",
        password: hashedPassword,
        role: "user",
        profileImage: "https://i.pravatar.cc/150?img=2",
        followers: [],
        following: [],
      },
      {
        name: "Bob Johnson",
        username: "bobjohnson",
        email: "bob@example.com",
        password: hashedPassword,
        role: "user",
        profileImage: "https://i.pravatar.cc/150?img=3",
        followers: [],
        following: [],
      },
      {
        name: "Alice Williams",
        username: "alicew",
        email: "alice@example.com",
        password: hashedPassword,
        role: "user",
        profileImage: "https://i.pravatar.cc/150?img=4",
        followers: [],
        following: [],
      },
      {
        name: "Charlie Brown",
        username: "charlieb",
        email: "charlie@example.com",
        password: hashedPassword,
        role: "user",
        profileImage: "https://i.pravatar.cc/150?img=5",
        followers: [],
        following: [],
      },
    ]);

    console.log(`Created ${users.length} users`);

    // Set up follower/following relationships
    users[0].following = [users[1]._id, users[2]._id, users[3]._id];
    users[1].following = [users[0]._id, users[3]._id];
    users[2].following = [users[0]._id];
    users[3].following = [users[0]._id, users[1]._id, users[4]._id];
    users[4].following = [users[0]._id, users[1]._id];

    users[0].followers = [
      users[1]._id,
      users[2]._id,
      users[3]._id,
      users[4]._id,
    ];
    users[1].followers = [users[0]._id, users[3]._id, users[4]._id];
    users[2].followers = [users[0]._id];
    users[3].followers = [users[0]._id, users[1]._id];
    users[4].followers = [users[3]._id];

    // Save updated users
    await Promise.all(users.map((user) => user.save()));
    console.log("Updated follower/following relationships");

    // Create Posts
    const posts = await Post.insertMany([
      {
        content: "Hello everyone! This is my first post on Space App!",
        author: users[0]._id,
        likes: [users[1]._id, users[2]._id, users[3]._id],
        image: "https://picsum.photos/600/400?random=1",
      },
      {
        content: "Just finished a great project! Feeling accomplished",
        author: users[1]._id,
        likes: [users[0]._id, users[3]._id],
        image: "https://picsum.photos/600/400?random=2",
      },
      {
        content: "Beautiful sunset today! Nature is amazing",
        author: users[2]._id,
        likes: [users[0]._id, users[1]._id, users[4]._id],
        image: "https://picsum.photos/600/400?random=3",
      },
      {
        content:
          "Learning something new every day! Currently diving into Node.js",
        author: users[0]._id,
        likes: [users[1]._id, users[4]._id],
      },
      {
        content: "Coffee and coding - the perfect combination",
        author: users[3]._id,
        likes: [users[0]._id, users[1]._id, users[2]._id],
        image: "https://picsum.photos/600/400?random=4",
      },
      {
        content: "Weekend vibes! Time to relax and recharge",
        author: users[4]._id,
        likes: [users[0]._id, users[3]._id],
      },
      {
        content:
          "Excited about the new features coming to this app! Stay tuned",
        author: users[1]._id,
        likes: [users[0]._id, users[2]._id, users[3]._id, users[4]._id],
        image: "https://picsum.photos/600/400?random=5",
      },
      {
        content: "Just deployed my first web app! Dreams do come true",
        author: users[2]._id,
        likes: [users[0]._id, users[1]._id],
      },
      {
        content: "Monday motivation: You got this!",
        author: users[3]._id,
        likes: [users[4]._id],
      },
      {
        content:
          "Sharing some tips on clean code practices. Check out my blog!",
        author: users[0]._id,
        likes: [users[1]._id, users[2]._id, users[3]._id, users[4]._id],
      },
    ]);

    console.log(`Created ${posts.length} posts`);

    // Create Comments
    const comments = await Comment.insertMany([
      {
        text: "Welcome to Space App! Great to have you here!",
        author: users[1]._id,
        post: posts[0]._id,
      },
      {
        text: "Looking forward to your posts!",
        author: users[2]._id,
        post: posts[0]._id,
      },
      {
        text: "Awesome work! What kind of project was it?",
        author: users[0]._id,
        post: posts[1]._id,
      },
      {
        text: "Congratulations! Keep it up!",
        author: users[3]._id,
        post: posts[1]._id,
      },
      {
        text: "Stunning! Where was this taken?",
        author: users[0]._id,
        post: posts[2]._id,
      },
      {
        text: "Absolutely beautiful!",
        author: users[1]._id,
        post: posts[2]._id,
      },
      {
        text: "Node.js is amazing! Let me know if you need any resources.",
        author: users[1]._id,
        post: posts[3]._id,
      },
      {
        text: "I totally agree!",
        author: users[0]._id,
        post: posts[4]._id,
      },
      {
        text: "My favorite combo too!",
        author: users[2]._id,
        post: posts[4]._id,
      },
      {
        text: "Enjoy your weekend!",
        author: users[0]._id,
        post: posts[5]._id,
      },
      {
        text: "Can't wait to see what's coming!",
        author: users[3]._id,
        post: posts[6]._id,
      },
      {
        text: "This is going to be great!",
        author: users[4]._id,
        post: posts[6]._id,
      },
      {
        text: "Congratulations! What tech stack did you use?",
        author: users[0]._id,
        post: posts[7]._id,
      },
      {
        text: "Thanks for the motivation!",
        author: users[4]._id,
        post: posts[8]._id,
      },
      {
        text: "Looking forward to reading it!",
        author: users[2]._id,
        post: posts[9]._id,
      },
    ]);

    console.log(`Created ${comments.length} comments`);

    // Create Notifications
    const notifications = await Notification.insertMany([
      {
        recipient: users[0]._id,
        sender: users[1]._id,
        type: "like",
        post: posts[0]._id,
        read: false,
      },
      {
        recipient: users[0]._id,
        sender: users[2]._id,
        type: "like",
        post: posts[0]._id,
        read: false,
      },
      {
        recipient: users[0]._id,
        sender: users[1]._id,
        type: "comment",
        post: posts[0]._id,
        read: true,
      },
      {
        recipient: users[1]._id,
        sender: users[0]._id,
        type: "follow",
        read: false,
      },
      {
        recipient: users[1]._id,
        sender: users[0]._id,
        type: "like",
        post: posts[1]._id,
        read: false,
      },
      {
        recipient: users[2]._id,
        sender: users[0]._id,
        type: "follow",
        read: true,
      },
      {
        recipient: users[2]._id,
        sender: users[0]._id,
        type: "like",
        post: posts[2]._id,
        read: false,
      },
      {
        recipient: users[3]._id,
        sender: users[0]._id,
        type: "follow",
        read: false,
      },
      {
        recipient: users[3]._id,
        sender: users[1]._id,
        type: "follow",
        read: false,
      },
      {
        recipient: users[4]._id,
        sender: users[3]._id,
        type: "follow",
        read: true,
      },
      {
        recipient: users[1]._id,
        sender: users[3]._id,
        type: "like",
        post: posts[1]._id,
        read: false,
      },
      {
        recipient: users[2]._id,
        sender: users[1]._id,
        type: "comment",
        post: posts[2]._id,
        read: false,
      },
    ]);

    console.log(`Created ${notifications.length} notifications`);

    console.log("\nDatabase seeding completed successfully!");
    console.log("\nSummary:");
    console.log(`   Users: ${users.length}`);
    console.log(`   Posts: ${posts.length}`);
    console.log(`   Comments: ${comments.length}`);
    console.log(`   Notifications: ${notifications.length}`);
    console.log("\nAll users have password: password123");
    console.log(`Admin user: ${users[0].email} (role: admin)`);
    console.log(
      `Regular users: ${users
        .slice(1)
        .map((u) => u.email)
        .join(", ")}`
    );

    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

// Run the seeder
seedDatabase();
