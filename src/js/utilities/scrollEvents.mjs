/**
 * Display a scroll button and handles scrolling behavior when the user clicks it.
 *
 * @param {number} scrollY - The scroll position (in pixels) at which to display the scroll button.
 */
export function displayScrollButton(scrollY) {
  const scrollButton = document.querySelector(".scroll-button");
  const scrollTarget = document.querySelector(".scroll-target");

  // Listen for scroll events to show/hide the scroll button.
  window.addEventListener("scroll", () => {
    if (window.scrollY > scrollY) {
      scrollButton.style.display = "block";
    } else {
      scrollButton.style.display = "none";
    }
  });

  // Scroll to the target element when the scroll button is clicked.
  scrollButton.addEventListener("click", () => {
    scrollTarget.scrollIntoView();
  });
}
