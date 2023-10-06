export function displayScrollButton(scrollY) {
  const scrollButton = document.querySelector(".scroll-button");
  const scrollTarget = document.querySelector(".scroll-target");
  window.addEventListener("scroll", () => {
    if (window.scrollY > scrollY) {
      scrollButton.style.display = "block";
    } else {
      scrollButton.style.display = "none";
    }
  });

  scrollButton.addEventListener("click", () => {
    scrollTarget.scrollIntoView();
  });
}
