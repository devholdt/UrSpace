import { getUser } from "./utilities/storage.js";
import { URLS } from "./settings/constants.js";
import { handleLogin } from "./components/handleLogin.js";
import { handleRegistration } from "./components/handleRegistration.js";

const user = getUser();

if (user) {
  window.location.href = URLS.FEED;
}

const loginForm = document.getElementById("loginForm");
const registrationForm = document.getElementById("registrationForm");
const toggleFormButtons = document.querySelectorAll(".toggle-form");
const inputs = document.querySelectorAll("input");
const messageContainer = document.querySelector(".message-container");

loginForm.addEventListener("submit", handleLogin);
registrationForm.addEventListener("submit", handleRegistration);

toggleFormButtons.forEach((btn) => {
  btn.addEventListener("click", (event) => {
    event.preventDefault();

    inputs.forEach((input) => {
      input.value = "";
    });

    messageContainer.innerHTML = "";

    if (loginForm.style.display === "none") {
      loginForm.style.display = "block";
      registrationForm.style.display = "none";
    } else {
      loginForm.style.display = "none";
      registrationForm.style.display = "block";
    }
  });
});
