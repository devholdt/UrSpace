export default function message(type, content, target) {
  const element = document.querySelector(target);

  element.innerHTML = `<div class="message ${type}">${content}</div>`;
}
