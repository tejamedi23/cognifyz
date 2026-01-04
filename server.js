const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(__dirname));

// In-memory storage
const users = [];

// Server-side validation
app.post('/api/submit', (req, res) => {
    const { name, email, password, age, country } = req.body;
    const errors = {};

    // Validate name
    if (!name || name.length < 3) {
        errors.name = 'Name must be at least 3 characters';
    }

    // Validate email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.email = 'Invalid email format';
    }

    // Validate password
    if (!password || password.length < 6) {
        errors.password = 'Password must be at least 6 characters';
    }

    // Validate age
    if (!age || age < 18 || age > 100) {
        errors.age = 'Age must be between 18 and 100';
    }

    // Validate country
    if (!country) {
        errors.country = 'Country is required';
    }

    // Check for duplicate email
    if (users.find(u => u.email === email)) {
        errors.email = 'Email already registered';
    }

    // Return errors if any
    if (Object.keys(errors).length > 0) {
        return res.status(400).json({ success: false, errors });
    }

    // Save user
    const user = {
        id: users.length + 1,
        name,
        email,
        age: parseInt(age),
        country,
        registeredAt: new Date().toISOString()
    };
    users.push(user);

    console.log('User registered:', user.email);

    res.json({ success: true, data: user });
});

// Get all users
app.get('/api/users', (req, res) => {
    res.json({ success: true, users });
});

// Serve HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
