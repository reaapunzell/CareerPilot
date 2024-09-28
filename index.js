import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

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
    age: Number, // Added 'age' field
    careerPath: String,
    skills: String,
});

const User = mongoose.model('User', userSchema);

// POST route to add new user
app.post('/addUser', (req, res) => {
    const { name, email, age } = req.body;

    // Validation
    if (!name || !email || !age) {
        return res.status(400).json({ success: false, message: "All fields are required." });
    }

    const newUser = new User({ name, email, age });

    newUser.save()
        .then(user => res.json({ success: true, message: "User added successfully!", user }))
        .catch(err => res.status(500).json({ success: false, message: "Failed to add user." }));
});

// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
