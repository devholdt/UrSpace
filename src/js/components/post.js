export default function postContent() {
  const form = document.querySelector("form");
  const messageContainer = document.querySelector(".message-container");

  form.addEventListener("submit", handleSubmit);

  function handleSubmit(event) {
    event.preventDefault();

    messageContainer.innerHTML = "";
  }
}
