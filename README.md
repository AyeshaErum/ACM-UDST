# 🎓 ACM UDST Quest Portal

An interactive, gamified website built for the **ACM UDST Student Chapter Competition** 🏆  
Built with **Node.js + Express** and **Python + Flask**, this portal lets students log in, join events, upload their creative photo submissions, and get AI-judged rankings using **Google Gemini** and a local **image captioning model (BLIP)**.

---

## 🚀 Features

- 🔐 **Login & Signup System** – Students can register and log in using their Student ID.  
- 🪄 **Photo Quest Uploads** – Submit photos for any event; captions generated automatically via AI.  
- 🧠 **AI Captioning (Flask + BLIP)** – Runs locally, no API limits.  
- 🤖 **Gemini Judging** – Judges creativity & relevance once the event ends.  
- 🏅 **Leaderboard Page** – Displays top 3 winners with reasons.  
- 🧾 **JSON Storage** – All user data and submissions stored locally in `.json` files (no database needed).  
- 🎨 **Modern UI** – Clean ACM blue theme with responsive cards and consistent styling.

---

## 🧩 Tech Stack

| Component | Technology |
|------------|-------------|
| **Frontend** | HTML + EJS Templates + CSS |
| **Backend (Web)** | Node.js + Express |
| **Backend (AI Captioning)** | Python + Flask |
| **AI Models** | BLIP (Salesforce) + Google Gemini 1.5 Flash |
| **Storage** | JSON files (no database) |

---

## 📁 Folder Structure

ACM_Quest_Portal/
├── events.js                # Main Express server
├── caption_api.py           # Flask AI caption API
├── .env                     # Contains Gemini API key
├── README.md
├── accounts.json
├── events.json
├── submissions.json
├── winners.json
├── views/                   # EJS templates (frontend)
│   ├── login.ejs
│   ├── signup.ejs
│   ├── events.ejs
│   ├── quest.ejs
│   ├── message.ejs
│   └── winners.ejs
└── public/
    └── style.css            # ACM blue theme

---

## ⚙️ Setup Instructions

### 🧰 Prerequisites
Make sure you have:
- Node.js (v18 or later)
- Python 3.9+
- Internet connection (for Gemini API)
- A valid Google Gemini API key

In your `.env` file:
GEMINI_API_KEY=your_key_here

---

### 🪄 Step 1 — Install Node.js Dependencies
npm install express express-session body-parser multer axios ejs dotenv

---

### 🧠 Step 2 — Set Up Python Environment
python -m venv venv
venv\Scripts\activate        # on Windows
# or
source venv/bin/activate     # on macOS/Linux

pip install flask transformers torch torchvision pillow

---

### ⚡ Step 3 — Run the Caption API
python caption_api.py

Expected output:
✅ Model loaded!
 * Running on http://127.0.0.1:5001

Keep this terminal open.  
It handles AI caption generation.

---

### 🖥️ Step 4 — Run the Node.js Server
In a new terminal:
node events.js

Expected output:
🚀 Running on http://localhost:3000

---

### 🌐 Step 5 — Open the Web App
Go to → http://localhost:3000

You can now:
1. Sign Up → create your account  
2. Log In → access event list  
3. Join Quest → upload a photo (AI caption generated automatically)  
4. Wait for the event end date → Gemini will generate top 3 winners with reasons  
5. View Winners → see results once the event ends  

---

## 🧾 Data Files

| File | Purpose |
|------|----------|
| accounts.json | Stores user credentials (Student ID, name, password) |
| events.json | Holds event info, theme, and end date |
| submissions.json | Tracks all submitted captions |
| winners.json | Stores Gemini-generated top 3 winners and reasons |

---

## 🧹 Cleanup for Sharing

Before zipping/sharing the project:
- ❌ Delete `venv/` (Python environment)
- ❌ Delete `node_modules/`
- ❌ Delete `uploads/` (optional – auto-generated)
- ✅ Keep all `.json`, `.ejs`, `.css`, `.js`, and `.py` files

Recipients can reinstall everything using the setup steps above.

---

## 👨‍💻 Developers
Built by the **ACM UDST Chapter Team** 💙  
Empowering creativity through AI & innovation.

---

## 🧠 Future Enhancements
- 🔄 Real-time leaderboard refresh  
- 💬 Comments section under winners  
- 🧍 Admin panel for event creation  
- ☁️ Cloud database integration (MongoDB / Firebase)

---

## 🏁 License
MIT License © 2025 ACM UDST Student Chapter
