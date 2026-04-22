# ✉️ Email Writer Assistant (AutoMail AI)

An AI-powered email reply generator that helps users instantly create professional, well-structured email responses based on their input.

---

## 🚀 Live Demo

👉 

---

## 🧠 Features

* 🔐 User Authentication (Email & Google Login)
* 🤖 AI-generated email replies using Groq API
* 📨 Automatic Subject & Body generation
* 📜 Personalized Reply History (per user)
* 📧 One-click Gmail compose integration
* 🎨 Fully responsive UI (mobile + desktop)

---

## 🛠️ Tech Stack

### Frontend

* React.js
* CSS (Responsive Design)
* Axios
* Google OAuth

### Backend

* Node.js
* Express.js
* MongoDB Atlas
* JWT Authentication
* Groq AI API

---

## 📂 Project Structure

Email-Writer-Assistant/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── server/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   └── server.js
│
└── README.md

---

## ⚙️ Environment Variables

### Backend (.env)

GROQ_API_KEY=your_api_key
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
PORT=5000

### Frontend (.env)

REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
REACT_APP_BACKEND_URL=http://localhost:5000
REACT_APP_FRONTEND_URL=http://localhost:3000

---

## ▶️ Run Locally

### 1️⃣ Clone Repository

git clone https://github.com/Tejas-Mahajan2004/Email-Writer-Assistant.git
cd Email-Writer-Assistant

---

### 2️⃣ Start Backend

cd server
npm install
npm run dev

---

### 3️⃣ Start Frontend

cd frontend
npm install
npm start

---

---

## 👨‍💻 Author

**Tejas Mahajan**

* GitHub: https://github.com/Tejas-Mahajan2004
* LinkedIn: https://linkedin.com/in/tejasmahajan04

---

## ⭐ Support

If you like this project, consider giving it a ⭐ on GitHub!
