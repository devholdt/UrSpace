export default function message(type, content, target, duration = 2000) {
  const element = document.querySelector(target);

  element.innerHTML = `<p class="message ${type}">${content}</p>`;

  if (duration !== null) {
    setTimeout(() => {
      element.innerHTML = "";
    }, duration);
  }
}
