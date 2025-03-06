const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB connection
const mongoURI = 'mongodb://localhost:27017/Texi'; // Your MongoDB URL
mongoose.connect(mongoURI)
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));

// Define a schema for the contact form data
const contactSchema = new mongoose.Schema({
    name: String,
    email: String,
    message: String,
    timestamp: { type: Date, default: Date.now }
});

// Create a model for the contact form data
const Contact = mongoose.model('Contact', contactSchema);

// Handle form submissions
app.post('/submit-form', (req, res) => {
    const { name, email, message } = req.body;

    // Create a new contact document
    const newContact = new Contact({ name, email, message });

    // Save the document to the database
    newContact.save()
        .then(() => {
            res.status(200).json({ message: 'Form submitted successfully!' });
        })
        .catch(err => {
            console.error('Error saving contact:', err);
            res.status(500).json({ message: 'Error submitting form', error: err }); // Enhanced error logging
        });
});

// Serve the main HTML file for all routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
