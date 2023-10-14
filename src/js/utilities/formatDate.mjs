/**
 * Formats a date object into a string with the format "DD/MM/YY HH:MM".
 *
 * @param {Date} date - The date to be formatted.
 * @returns {string} - The formatted date string.
 */
export function formatDate(date) {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString().slice(-2);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}
