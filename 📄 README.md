Room Reserve - MERN Stack (MySQL)
A full-stack room booking application that allows users to register, login, and book hotel rooms with date-conflict prevention.

 Key Features
Auto-Schema Setup: Backend automatically creates required MySQL tables on the first run.

Secure Auth: JWT-based authentication with protected routes.

Smart Booking: Backend logic prevents overlapping dates for the same room.

Responsive UI: Fully mobile-optimized design using Tailwind CSS.

Real-time Feedback: Toast notifications for seamless UX.

 Tech Stack
Frontend: React.js, Tailwind CSS, Axios, React Router.

Backend: Node.js, Express.js.

Database: MySQL.

Security: Bcrypt (Password Hashing), JWT (Session Management).

 Setup & Installation
1. Backend Setup
Navigate to the backend folder:
cd backend

Install dependencies:
npm install

Database Setup (Mandatory):
Run the following command to create tables and add default rooms:
node setup.js

Start the server:
npm start

2. Frontend Setup
Navigate to the frontend folder:

Bash
cd frontend
Install dependencies:

Bash
npm install
Start the application:

Bash
npm start
(Runs on http://localhost:3000)

 RoomReserve/
├── frontend/           # React application
├── backend/            # Node.js & Express
│   ├── config/db.js    # DB Connection
│   ├── routes/         # API Routes
│   └── .env            # Env Variables
└── README.md