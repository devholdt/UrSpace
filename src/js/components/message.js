export default function message(type, content, target) {
  const element = document.querySelector(target);

  element.innerHTML = `<p class="message ${type}">${content}</p>`;
}
