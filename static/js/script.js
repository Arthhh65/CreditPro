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

// Target each option for the scroll animation
const options = document.querySelectorAll('.option');
options.forEach(option => {
    observer.observe(option);
});

// Modal functionality
const modal = document.getElementById("modal");
const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");
const closeBtn = document.getElementsByClassName("close")[0];
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const loginFormContainer = document.getElementById("loginFormContainer");
const signupFormContainer = document.getElementById("signupFormContainer");
const showSignupForm = document.getElementById("showSignupForm");
const showLoginForm = document.getElementById("showLoginForm");

// Open login modal on button click
if (loginBtn) {
    loginBtn.onclick = function() {
        loginFormContainer.style.display = "block";
        signupFormContainer.style.display = "none";
        if (modal) modal.style.display = "block";
    };
}

// Open sign-up modal on button click
if (signupBtn) {
    signupBtn.onclick = function() {
        signupFormContainer.style.display = "block";
        loginFormContainer.style.display = "none";
        if (modal) modal.style.display = "block";
    };
}

// Switch between login and sign-up forms
if (showSignupForm) {
    showSignupForm.onclick = function() {
        signupFormContainer.style.display = "block";
        loginFormContainer.style.display = "none";
    };
}

if (showLoginForm) {
    showLoginForm.onclick = function() {
        loginFormContainer.style.display = "block";
        signupFormContainer.style.display = "none";
    };
}

// Close modal when clicking the close button
if (closeBtn) {
    closeBtn.onclick = function() {
        if (modal) modal.style.display = "none";
    };
}

// Close modal when clicking outside of the modal
window.onclick = function(event) {
    if (event.target == modal) {
        if (modal) modal.style.display = "none";
    }
};

// Handle login form submission
if (loginForm) {
    loginForm.onsubmit = async function(event) {
        event.preventDefault(); // Prevent form submission
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
        });

        const result = await response.json();
        if (result.success) {
            isLoggedIn = true; // Update login status
            alert("Logged in successfully!");
            if (modal) modal.style.display = "none";
        } else {
            alert(result.message); // Show error message
        }
    };
}

// Handle sign-up form submission
if (signupForm) {
    signupForm.onsubmit = async function(event) {
        event.preventDefault(); // Prevent form submission
        const email = document.getElementById("signupEmail").value;
        const password = document.getElementById("signupPassword").value;

        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
        });

        const result = await response.json();
        if (result.success) {
            isLoggedIn = true; // Update login status
            alert("Signed up successfully!");
            if (modal) modal.style.display = "none";
        } else {
            alert(result.message); // Show error message
        }
    };
}

// Functionality for the Previous Transactions button
const previousTransactionsBtn = document.getElementById("previousTransactionsBtn");
if (previousTransactionsBtn) {
    previousTransactionsBtn.onclick = function() {
        if (isLoggedIn) {
            // Replace with actual logic to fetch and display previous transactions
            alert("Fetching previous transactions...");
        } else {
            alert("Login is required to view previous transactions.");
        }
    };
}

// Function to fetch credit score and show loader
async function fetchCreditScore() {
    const loader = document.getElementById('loader');
    if (loader) loader.style.display = 'block'; // Show loader

    try {
        const response = await fetch('/api/get_credit_score');
        const result = await response.json();

        if (loader) loader.style.display = 'none'; // Hide loader

        if (result.success) {
            animateCreditScore(result.credit_score);  // Pass fetched score
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error("Error fetching credit score:", error);
        alert("Error fetching credit score. Please try again.");
    }
}

// Function to animate the credit score display
function animateCreditScore(targetScore) {
    let currentScore = 0;
    const increment = Math.ceil(targetScore / 100);
    const display = document.getElementById('creditScore');
    
    const timer = setInterval(() => {
        currentScore += increment;
        if (currentScore >= targetScore) {
            currentScore = targetScore;
            clearInterval(timer);
        }
        display.textContent = currentScore;
    }, 30); // Adjust speed of animation by changing the interval time
}

// Check login status on page load
async function checkLoginStatus() {
    const response = await fetch('/api/check_login');
    const result = await response.json();
    if (result.logged_in) {
        isLoggedIn = true;
        alert("User is logged in!");
        // Update the UI to reflect logged-in state
    } else {
        isLoggedIn = false;
        // Update the UI for logged-out state
    }
}

// Call this function on page load
window.onload = checkLoginStatus;

// Function to predict credit score based on user input
async function predictCreditScore(userData) {
    const response = await fetch('/api/predict_credit_score', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: userData })  // Send the user data
    });

    const result = await response.json();
    if (result.success) {
        alert(`Predicted Credit Score Class: ${result.predicted_credit_score}`);
    } else {
        alert(result.message);  // Show error message
    }
}

// Example call with dummy user data
const exampleUserData = [0.5, 0.6, 0.7, 0.4, 0.3, 0.8, 0.9, 0.2, 0.1, 0.0];
predictCreditScore(exampleUserData);
