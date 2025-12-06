const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(cors({
    origin: '*', // Allow all origins for development. In production, specify your frontend's origin.
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json()); // To parse JSON request bodies

// Serve static files from the current directory (for frontend testing)
app.use(express.static(path.join(__dirname)));

// Email transporter setup
// Configure with your email service details
// For Gmail, you might need to enable "less secure app access" or use an App Password
// It's highly recommended to use environment variables for credentials in production.
const transporter = nodemailer.createTransport({
    service: 'gmail', // or your email service provider
    auth: {
        user: process.env.EMAIL_USER || 'houssein.bouzidi123@gmail.com', // Replace with your email address
        pass: process.env.EMAIL_PASS || 'kfms yykl wzby kmut'   // Replace with your email password or app password
    }
});

// Contact form submission endpoint
app.post('/send-email', async (req, res) => {
    const { fullName, email, message } = req.body;

    if (!fullName || !email || !message) {
        return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ success: false, message: 'Invalid email format.' });
    }

    try {
        const mailOptions = {
            from: email, // Sender's email from the form
            to: 'houssein.bouzidi123@gmail.com', // Recipient's email address (your email)
            subject: `New Contact Form Submission from ${fullName}`,
            html: `
                <p><strong>Full Name:</strong> ${fullName}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Message:</strong></p>
                <p>${message}</p>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully!');
        res.status(200).json({ success: true, message: 'Message sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ success: false, message: 'Failed to send message.' });
    }
});

// Order confirmation submission endpoint
app.post('/send-order-confirmation', async (req, res) => {
    const { fullName, address, phone, cart } = req.body; // Expect cart data

    if (!fullName || !address || !phone || !cart) {
        return res.status(400).json({ success: false, message: 'All order fields and cart data are required.' });
    }

    // Format cart items for the email
    let cartItemsHtml = '<p><strong>Products Ordered:</strong></p><ul>';
    let totalOrderPrice = 0;

    if (cart && cart.length > 0) {
        cart.forEach(item => {
            const itemPrice = parseFloat(item.price);
            const itemQuantity = parseInt(item.quantity);
            const itemTotal = itemPrice * itemQuantity;
            totalOrderPrice += itemTotal;
            cartItemsHtml += `
                <li>
                    ${item.name} (x${item.quantity}) - ${itemPrice} MAD/each = ${itemTotal} MAD
                </li>
            `;
        });
        cartItemsHtml += `</ul><p><strong>Total Order Price: ${totalOrderPrice} MAD</strong></p>`;
    } else {
        cartItemsHtml = '<p>No products were in the cart.</p>';
    }
    
    try {
        const mailOptions = {
            from: 'noreply@yourdomain.com', // A generic sender for order confirmations
            to: 'houssein.bouzidi123@gmail.com', // Recipient's email address (your email)
            subject: `New Order Confirmation from ${fullName}`,
            html: `
                <p><strong>Full Name:</strong> ${fullName}</p>
                <p><strong>Address:</strong> ${address}</p>
                <p><strong>Phone Number:</strong> ${phone}</p>
                ${cartItemsHtml}
            `
        };

        await transporter.sendMail(mailOptions);
        console.log('Order confirmation email sent successfully!');
        res.status(200).json({ success: true, message: 'Order confirmed successfully! We will contact you shortly.' });
    } catch (error) {
        console.error('Error sending order confirmation email:', error);
        res.status(500).json({ success: false, message: 'Failed to confirm order.' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Backend server listening at http://localhost:${port}`);
    console.log('Ensure you have configured EMAIL_USER and EMAIL_PASS environment variables.');
});
