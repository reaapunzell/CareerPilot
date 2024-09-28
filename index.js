import express from 'express';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 3000;

app.use(express.json());

// Fix for __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to users.json file
const usersJsonPath = path.join(__dirname, 'static', 'src', 'users.json');

// Serve static files from public folder
app.use(express.static(path.join(__dirname, 'static')));

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/static", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB"))
.catch(error => console.error("Error connecting to MongoDB:", error));

// User Schema
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    age: Number,
});

const User = mongoose.model('User', userSchema);

// Helper functions for JSON file
const readUsersJson = () => {
    try {
        const data = fs.readFileSync(usersJsonPath, 'utf-8');
        return JSON.parse(data);
    } catch (err) {
        console.error("Error reading users.json:", err);
        return [];
    }
};

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

    const users = readUsersJson();
    const existingUser = users.find(user => user.email === email);

    if (existingUser) {
        return res.json({ success: true, message: `Hi ${existingUser.name}, what career-related questions do you have for me today?` });
    }

    const newUser = new User({ name, email, age });
    try {
        const savedUser = await newUser.save();
        users.push({ name, email, age });
        writeUsersJson(users);
        res.json({ success: true, message: `User added successfully! Hi ${name}, what career-related questions do you have for me today?`, user: savedUser });
    } catch (err) {
        res.status(500).json({ success: false, message: "Failed to add user." });
    }
});

// GET route to fetch users
app.get('/users', (req, res) => {
    const users = readUsersJson();
    res.json(users);
});

// Default route for the home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'static', 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
