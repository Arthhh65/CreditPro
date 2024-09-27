// Global variable to track login status
let isLoggedIn = false; // This will be updated when the user logs in

// Intersection Observer to detect when elements come into view
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
});

// Target each feature for the scroll animation
const features = document.querySelectorAll('.feature');
features.forEach(feature => {
    observer.observe(feature);
});

// Modal functionality
const modal = document.getElementById("modal");
const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");
const closeBtn = document.getElementsByClassName("close")[0];

// Open modal on button click
loginBtn.onclick = function() {
    modal.style.display = "block";
};

signupBtn.onclick = function() {
    modal.style.display = "block";
};

// Close modal when clicking the close button
closeBtn.onclick = function() {
    modal.style.display = "none";
};

// Close modal when clicking outside of the modal
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
};

// Functionality for the Previous Transactions button
const previousTransactionsBtn = document.getElementById("previousTransactionsBtn");

previousTransactionsBtn.onclick = function() {
    if (isLoggedIn) {
        // Replace with actual logic to fetch and display previous transactions
        alert("Fetching previous transactions...");
    } else {
        alert("Login is required to view previous transactions.");
    }
};

// Example function to simulate user login
function login() {
    isLoggedIn = true; // Update login status
    modal.style.display = "none"; // Close the modal after logging in
    alert("Logged in successfully!");
}

// Replace the login button functionality to call this login function
document.getElementById("loginGmail").onclick = login; // Example for Gmail login
document.getElementById("loginPhone").onclick = login; // Example for Phone login
