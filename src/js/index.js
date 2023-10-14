import { getUser } from "./utilities/storage.mjs";
import { URLS } from "./settings/constants.mjs";
import { handleLogin } from "./components/handleLogin.mjs";
import { handleRegistration } from "./components/handleRegistration.mjs";

// Get user data or redirect to the index page if the user is already authenticated
const user = getUser();
if (user) {
  window.location.href = URLS.FEED;
}

// Get references to the login and registration forms
const loginForm = document.getElementById("loginForm");
const registrationForm = document.getElementById("registrationForm");

// Get references to the buttons that toggle between login and registration forms
const toggleFormButtons = document.querySelectorAll(".toggle-form");

// Get references to all input fields in the forms
const inputs = document.querySelectorAll("input");

// Get a reference to the message container for displaying form messages
const messageContainer = document.querySelector(".message-container");

// Attach a submit event listener to the login form to handle login submission
loginForm.addEventListener("submit", handleLogin);

// Attach a submit event listener to the registration form to handle registration submission
registrationForm.addEventListener("submit", handleRegistration);

// Attach click event listeners to the toggle buttons to switch between login and registration forms
toggleFormButtons.forEach((btn) => {
  btn.addEventListener("click", (event) => {
    // Prevent the default form submission behavior
    event.preventDefault();

    // Clear input field values and messages when toggling forms
    inputs.forEach((input) => {
      input.value = "";
    });

    messageContainer.innerHTML = "";

    // Toggle the display of login and registration forms
    if (loginForm.style.display === "none") {
      loginForm.style.display = "block";
      registrationForm.style.display = "none";
    } else {
      loginForm.style.display = "none";
      registrationForm.style.display = "block";
    }
  });
});
