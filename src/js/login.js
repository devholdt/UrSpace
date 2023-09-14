import renderMenu from "./components/renderMenu.js";
import { formValidation } from "./utilities/formValidation.js";
// import message from "./components/message.js";

renderMenu();
formValidation();

// const form = document.querySelector("form");
// const email = document.querySelector("#email");
// const password = document.querySelector("#password");
// const messageContainer = document.querySelector(".message-container");

// form.addEventListener("submit", submitForm);

// function submitForm(event) {
//   event.preventDefault();

//   messageContainer.innerHTML = "";

//   const emailValue = email.value.trim();
//   const passwordValue = password.value.trim();

//   // If values are invalid/absent, display an error message
//   if (emailValue.length === 0 && passwordValue.length === 0) {
//     return message(
//       "bg-warning",
//       "Please enter your login details",
//       ".message-container"
//     );
//   } else if (emailValue.length === 0) {
//     return message(
//       "bg-warning",
//       "Please enter your e-mail",
//       ".message-container"
//     );
//   } else if (passwordValue.length === 0) {
//     return message(
//       "bg-warning",
//       "Please enter a password",
//       ".message-container"
//     );
//   }

//   doLogin(emailValue, passwordValue);
// }

// async function doLogin(email, password) {
//   console.log("Hello");
// }
