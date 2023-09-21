export default function message(type, content) {
  const element = document.querySelector(".message-container");

  element.innerHTML = `<p class="message ${type}">${content}</p>`;

  setTimeout(() => {
    element.innerHTML = "";
  }, 3000);
}
