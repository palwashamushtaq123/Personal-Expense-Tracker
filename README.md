# 💰 Personal Expense Tracker

A modern, fast, and responsive web application designed for personal finance management. Built with Vanilla JavaScript, Firebase, and CSS3, this application enables users to track, log, and analyze their daily expenses in real-time with complete data isolation and privacy.

🚀 **Live Production Deployment:** [personal-expense-tracker-eight-beta.vercel.app](https://personal-expense-tracker-eight-beta.vercel.app/)

---

## 🖼️ Application Preview

### 📱 Web UI Dashboard
- **Google OAuth Sign-In Interface:** User-specific dashboard isolation.
- **Analytics Cards:** Real-time expense count and total spent calculation in PKR.
- **Interactive Form:** Categorized expense entry system.

---

## 🌟 Key Features

- 🔐 **Personalized User Isolation:** Powered by Firebase Google Auth to ensure each user only accesses their own financial entries.
- ⚡ **Real-Time Data Persistence:** Cloud Firestore backend for instant sync, retrieval, and updates.
- 📊 **Automated Summary:** Dynamically calculates total entry counts and overall budget spent in PKR.
- 🏷️ **Categorized Tracking:** Easily organize transactions into predefined categories (Food, Travel, Shopping, Bills, Other).
- 📱 **Responsive Design:** Native CSS Flexbox/Grid layout optimized across mobile, tablet, and desktop screens.

---

## 🛠️️ Tech Stack & Architecture

- **Frontend:** HTML5, CSS3, JavaScript (ES6+ Modules)
- **Backend & Database:** Google Cloud Firestore (NoSQL)
- **Authentication:** Firebase Auth (Google Identity Provider)
- **Deployment & Hosting:** Vercel Continuous Integration & Deployment (CI/CD)

---

## 📂 Project Structure

```text
Personal Expense Tracker/
│
├── assets/                  # Application media and screenshots
│   └── screenshot.png
├── index.html               # Main HTML markup
├── style.css                # Custom styling and layout rules
├── app.js                   # Application state, Auth, and Firestore logic
├── .gitignore               # Version control exclusion file
└── README.md                # Project documentation

---

### 🚀 Local Development Setup

## 1. Clone the repository:

git clone [https://github.com/your-username/personal-expense-tracker.git](https://github.com/your-username/personal-expense-tracker.git)
cd personal-expense-tracker

## Run locally:

Open index.html directly in your web browser or use the Live Server extension in VS Code.

---

### 🔒 Cloud Security & Data Access Rules

Firestore Security Rules enforce user privacy directly at the database level:

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /expenses/{expenseId} {
      allow read, write: if request.auth != null;
    }
  }
}