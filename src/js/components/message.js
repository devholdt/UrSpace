/**
 * Displays a message on a specified target element.
 *
 * @param {string} type - The type of message (e.g. "success", "error").
 * @param {string} content - The content of the message.
 * @param {string} target - The CSS selector for the target element where the message will be displayed.
 * @param {number|null} duration - The duration (in milliseconds) for which the message will be
 *                                 displayed. Set to 'null' for not automatic removal.
 */
export default function message(type, content, target, duration = 2000) {
  // Select the target element
  const element = document.querySelector(target);

  // Create an HTML message element with the specified type and content
  element.innerHTML = `<p class="message ${type}">${content}</p>`;

  // Check if a duration is provided
  if (duration !== null) {
    // Set a timer to remove the message after the specified duration
    setTimeout(() => {
      element.innerHTML = "";
    }, duration);
  }
}
