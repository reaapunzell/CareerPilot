import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

// Fix for __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to users.json file
const usersJsonPath = path.join(__dirname, 'static', 'src', 'users.json');

// MongoDB connection
mongoose
    .connect("mongodb://localhost:27017/static", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((error) => {
        console.error("Error connecting to MongoDB:", error);
    });

// User Schema
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    age: Number,
    careerPath: String,
    skills: String,
});

const User = mongoose.model('User', userSchema);

// Helper function to read users.json
const readUsersJson = () => {
    try {
        const data = fs.readFileSync(usersJsonPath, 'utf-8');
        return JSON.parse(data);
    } catch (err) {
        console.error("Error reading users.json:", err);
        return [];
    }
};

// Helper function to write users.json
const writeUsersJson = (data) => {
    try {
        fs.writeFileSync(usersJsonPath, JSON.stringify(data, null, 2));
    } catch (err) {
        console.error("Error writing to users.json:", err);
    }
};

// POST route to add new user or greet existing user
app.post('/addUser', async (req, res) => {
    const { name, email, age } = req.body;

    // Validation
    if (!name || !email || !age) {
        return res.status(400).json({ success: false, message: "All fields are required." });
    }

    // Check if user already exists in users.json
    const users = readUsersJson();
    const existingUser = users.find(user => user.email === email);

    if (existingUser) {
        // User already exists, greet them
        return res.json({ success: true, message: `Welcome back ${existingUser.name}!` });
    }

    // Add new user to MongoDB
    const newUser = new User({ name, email, age });
    try {
        const savedUser = await newUser.save();

        // Add new user to users.json
        users.push({ name, email, age, message: `Hi ${name}, introduction` });
        writeUsersJson(users);

        // Return response
        res.json({ success: true, message: "User added successfully!", user: savedUser });
    } catch (err) {
        res.status(500).json({ success: false, message: "Failed to add user." });
    }
});

app.get('/users', (req, res) => {
    const users = readUsersJson(); // Get users from JSON
    res.json(users); // Send users as response
});

// POST route to add new user or greet existing user
// POST route to add new user or greet existing user
app.post('/addUser', async (req, res) => {
    const { name, email, age } = req.body;

    // Validation
    if (!name || !email || !age) {
        return res.status(400).json({ success: false, message: "All fields are required." });
    }

    // Check if user already exists in users.json
    const users = readUsersJson();
    const existingUser = users.find(user => user.email === email);

    if (existingUser) {
        // User already exists, greet them with their name
        return res.json({ success: true, message: `Hi ${existingUser.name}, what career related questions do you have for me today?` });
    }

    // Add new user to MongoDB
    const newUser = new User({ name, email, age });
    try {
        const savedUser = await newUser.save();

        // Add new user to users.json
        users.push({ name, email, age, message: `Hi ${name}, introduction` });
        writeUsersJson(users);

        // Return response
        res.json({ success: true, message: `Hi ${name}, what career related questions do you have for me today?` });
    } catch (err) {
        res.status(500).json({ success: false, message: "Failed to add user." });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
