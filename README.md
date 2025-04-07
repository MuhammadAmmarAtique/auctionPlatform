# 🕵️‍♂️ Auction Platform

A full-stack auction platform built with the **MERN stack** (MongoDB, Express.js, React, Node.js) where users can list items for auction, place bids in real time, and handle commissions securely. The platform supports roles like **Auctioneers**, **Bidders**, and **Super Admins**. Payment handling is integrated with **Stripe**, and automation is achieved via cron jobs.

---

## 🚀 Features

- 🧑‍⚖️ Role-based Access: Auctioneers, Bidders, and Super Admins
- 🕒 Real-time auction lifecycle with automated cron jobs
- 💳 Commission tracking and Stripe payment integration
- 📬 Email notifications on auction wins and payment reminders
- 📊 Super Admin dashboard with visual insights (graphs)
- 📁 Cloud image upload using Cloudinary
- 🧾 Commission proof submission & verification

---

## 📁 Project Structure

```
auctionPlatform/
│
├── backend/
│   ├── src/
│   │   ├── automation/               # Cron jobs for automation
│   │   │   ├── auctionEndedCron.js
│   │   │   └── verifyComissionCron.js
│   │   ├── controllers/             # Route logic
│   │   ├── database/                # DB connection config
│   │   ├── middlewares/            # Middlewares (auth, error handling, etc.)
│   │   ├── models/                  # Mongoose schemas
│   │   ├── routers/                 # Route definitions
│   │   ├── utils/                   # Utility functions (e.g., cloudinary, email)
│   │   ├── app.js                   # Express app config
│   │   ├── constants.js             # App constants
│   │   └── index.js                 # App entry point
│   ├── .env                         # Environment variables
│   └── .env.sample                  # Sample env file for reference
│
├── frontend/
│   ├── src/
│   │   ├── assets/                  # Static assets
│   │   ├── components/
│   │   │   ├── Dashboard/           # Super Admin dashboard components
│   │   │   └── Home/                # UI components for home page
│   │   ├── layout/                  # Layout component (e.g., SideDrawer)
│   │   ├── lib/                     # Utility functions
│   │   ├── pages/                   # All page components (Home, Login, Auctions, etc.)
│   │   ├── store/                   # Redux store and slices
│   │   ├── App.jsx                  # App wrapper
│   │   └── main.jsx                 # React entry point
│   ├── tailwind.config.js          # Tailwind CSS config
│   └── vite.config.js              # Vite config
│
├── README.md                       # You're reading it!
└── auctionPlatform.postman_collection.json  # Postman API collection for testing
```

---

## 🧠 Key Backend Logic

### 🔁 Automation

- **auctionEndedCron.js**  
  Runs every minute to detect auctions that have ended and haven’t had their commissions calculated. It:
  - Updates database fields in `Auction`, `User` (Auctioneer), and `User` (Highest Bidder)
  - Sends an email to the winning bidder with payment instructions

- **verifyComissionCron.js**  
  Runs every minute to verify commission payments:
  - Handles exact, partial, and overpayments
  - Updates user balances and commission statuses
  - Logs each verified transaction in a `Commission` object

---

## 📊 Super Admin Dashboard

Interactive graphs showing:
- Registered Bidders & Auctioneers
- Total Revenue
- Payment Proofs submitted
- Option to delete auction items

---

## 🌐 Tech Stack

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: MongoDB Atlas
- **State Management**: Redux Toolkit
- **Authentication**: JWT
- **Payments**: Stripe API
- **Email**: Nodemailer
- **File Uploads**: Cloudinary

---

## 📦 Setup Instructions

1. **Clone the repo**
   ```bash
   git clone https://github.com/MuhammadAmmarAtique/auctionPlatform.git
   cd auctionPlatform
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
4. **Environment Variables**
Both backend and frontend folders contain a .env.sample file.
Rename each to .env.
Open the .env files and fill in the required environment variables (e.g., MongoDB URI, JWT secret, Stripe keys, etc.).

---

## 🧪 API Testing

- Import the included `auctionPlatform.postman_collection.json` into Postman
- Contains routes for login, auction creation, bidding, commission submission, etc.

---

## 🙌 Contributing

Pull requests are welcome! For major changes, open an issue first to discuss what you’d like to change.

---

## 📄 License

[MIT](LICENSE)
