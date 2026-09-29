// ========================================
// Firebase Imports
// ========================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    query,
    where
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";


// ========================================
// Firebase Configuration
// ========================================

const firebaseConfig = {
    apiKey: "AIzaSyBnQO7Vzkd0HfNhAKHEhBvCClglP2rklAc",
    authDomain: "personal-expense-tracker-d9ab2.firebaseapp.com",
    projectId: "personal-expense-tracker-d9ab2",
    storageBucket: "personal-expense-tracker-d9ab2.firebasestorage.app",
    messagingSenderId: "678846920990",
    appId: "1:678846920990:web:1b1f8c20721b7ec587310f"
};


// ========================================
// Start Firebase & Auth
// ========================================

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

let currentUser = null;


// ========================================
// HTML Elements
// ========================================

const titleInput = document.getElementById("expenseTitle");
const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const dateInput = document.getElementById("date");
const addExpenseBtn = document.getElementById("addExpenseBtn");
const expenseTableBody = document.getElementById("expenseTableBody");
const totalExpenses = document.getElementById("totalExpenses");
const totalAmount = document.getElementById("totalAmount");

const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const userInfo = document.getElementById("userInfo");
const userName = document.getElementById("userName");


// ========================================
// Set Today's Date Automatically
// ========================================

function setTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    dateInput.value = `${year}-${month}-${day}`;
}

setTodayDate();


// ========================================
// AUTHENTICATION LOGIC
// ========================================

// Google Login
loginBtn.addEventListener("click", async () => {
    try {
        await signInWithPopup(auth, provider);
    } catch (error) {
        console.error("Login Error:", error);
        alert("Google Sign-In Failed!");
    }
});

// Logout
logoutBtn.addEventListener("click", async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Logout Error:", error);
    }
});

// Track Auth State (Login / Logout Handle)
onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUser = user;
        loginBtn.style.display = "none";
        userInfo.style.display = "flex";
        userName.textContent = `Hello, ${user.displayName || "User"}`;
        loadExpenses();
    } else {
        currentUser = null;
        loginBtn.style.display = "block";
        userInfo.style.display = "none";
        expenseTableBody.innerHTML = "";
        totalExpenses.textContent = "0";
        totalAmount.textContent = "Rs. 0";
    }
});


// ========================================
// LOAD EXPENSES (Specific to Logged-in User)
// ========================================

async function loadExpenses() {
    if (!currentUser) return;

    try {
        console.log("Loading user expenses...");

        // Query to filter expenses by logged-in user's UID
        const expensesRef = collection(db, "expenses");
        const userQuery = query(expensesRef, where("userId", "==", currentUser.uid));

        const snapshot = await getDocs(userQuery);

        expenseTableBody.innerHTML = "";
        let count = 0;
        let total = 0;

        snapshot.forEach((item) => {
            const data = item.data();
            count++;
            total += Number(data.amount);

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${data.title}</td>
                <td>
                    Rs. ${Number(data.amount).toLocaleString()}
                </td>
                <td>${data.category}</td>
                <td>${data.date}</td>
                <td>
                    <button
                        class="delete-btn"
                        onclick="deleteExpense('${item.id}')"
                    >
                        Delete
                    </button>
                </td>
            `;

            expenseTableBody.appendChild(row);
        });

        // Update Summary
        totalExpenses.textContent = count;
        totalAmount.textContent = "Rs. " + total.toLocaleString();

    } catch (error) {
        console.error("FIREBASE READ ERROR:", error);
    }
}


// ========================================
// ADD EXPENSE (With User ID)
// ========================================

addExpenseBtn.addEventListener("click", async function () {
    if (!currentUser) {
        alert("Please login first to add expenses!");
        return;
    }

    const title = titleInput.value.trim();
    const amount = Number(amountInput.value);
    const category = categoryInput.value;
    const date = dateInput.value;

    if (title === "" || amount <= 0 || category === "" || date === "") {
        alert("Please fill all fields correctly.");
        return;
    }

    try {
        // Save expense with logged-in user's UID
        await addDoc(collection(db, "expenses"), {
            title: title,
            amount: amount,
            category: category,
            date: date,
            userId: currentUser.uid
        });

        alert("Expense added successfully!");

        titleInput.value = "";
        amountInput.value = "";
        categoryInput.value = "";
        setTodayDate();

        await loadExpenses();

    } catch (error) {
        console.error("FIREBASE ADD ERROR:", error);
        alert("Could not add expense.");
    }
});


// ========================================
// DELETE EXPENSE
// ========================================

window.deleteExpense = async function (id) {
    if (!currentUser) return;

    const confirmDelete = confirm("Are you sure you want to delete this expense?");
    if (!confirmDelete) return;

    try {
        await deleteDoc(doc(db, "expenses", id));
        alert("Expense deleted successfully!");
        await loadExpenses();
    } catch (error) {
        console.error("FIREBASE DELETE ERROR:", error);
        alert("Could not delete expense.");
    }
};