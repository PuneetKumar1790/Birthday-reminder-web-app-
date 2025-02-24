require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const cron = require("node-cron");
const nodemailer = require("nodemailer");

const app = express();
app.use(cors());
app.use(bodyParser.json());



// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ Connected to MongoDB Atlas"))
.catch(err => console.log("❌ MongoDB Connection Error:", err));


// Birthday Schema
const birthdaySchema = new mongoose.Schema({
    name: String,
    email: String,
    date: Date,
});

const Birthday = mongoose.model("Birthday", birthdaySchema);

// Add Birthday
app.post("/add-birthday", async (req, res) => {
    try {
        const { name, email, date } = req.body;
        const newBirthday = new Birthday({ name, email, date });
        await newBirthday.save();
        res.status(201).json({ message: "Birthday added successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get Birthdays
app.get("/birthdays", async (req, res) => {
    try {
        const birthdays = await Birthday.find();
        res.status(200).json(birthdays);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete Birthday
app.delete("/delete-birthday/:id", async (req, res) => {
    try {
        await Birthday.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Birthday deleted successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Email Configuration
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
    },
});

// Schedule Birthday Reminder Emails
cron.schedule("0 19 * * *", async () => { // Runs every day at 7:00 AM IST
    const today = new Date().toISOString().split("T")[0]; // Get today's date
    const birthdays = await Birthday.find({ date: today });

    birthdays.forEach(({ name, email }) => {
        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: "🎂 Birthday Reminder!",
            text: `Hey, don't forget to wish ${name} a Happy Birthday today! 🎉`,
        };
        transporter.sendMail(mailOptions);
    });
}, { timezone: "Asia/Kolkata" });



cron.schedule("0 22 * * *", async () => { // Runs every day at 10:00 PM IST
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextDay = tomorrow.toISOString().split("T")[0];

    const birthdays = await Birthday.find({ date: nextDay });

    birthdays.forEach(({ name, email }) => {
        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: "🎉 Upcoming Birthday Alert!",
            text: `Hey, ${name} has a birthday tomorrow! Prepare your wishes! 🎂`,
        };
        transporter.sendMail(mailOptions);
    });
}, { timezone: "Asia/Kolkata" });

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
