/**
 * Handles the behavior of image modals for thumbnail images.
 */
export function handleImageModal() {
  /**
   * Opens the specified modal by adding the "modal-active" class.
   *
   * @param {string} modalId - The ID of the modal to open.
   */
  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.add("modal-active");

    // Add a click event listener to the modal to close it when clicked outside
    modal.addEventListener("click", closeModal);

    // Prevent clicks inside the modal from closing it
    modal.querySelector(".modal-content").addEventListener("click", (e) => {
      e.stopPropagation();
    });
  }

  /**
   * Closes the modal when the overlay or close button is clicked.
   *
   * @param {Event} e - The click event that triggered the close action.
   */
  function closeModal(e) {
    if (
      e.target.classList.contains("modal") ||
      e.target.classList.contains("close-btn")
    ) {
      // Find all modals and remove the "modal-active" class
      const modals = document.querySelectorAll(".modal");
      modals.forEach((modal) => {
        modal.classList.remove("modal-active");
      });
    }
  }

  /**
   * Attach event listeners to thumbnail images to open their respective modals.
   */
  function attachEventListeners() {
    const thumbnailImages = document.querySelectorAll(".thumbnail-img");

    thumbnailImages.forEach((thumbnail) => {
      // Add a click event listener to each thumbnail image
      thumbnail.addEventListener("click", () => {
        const modalId = thumbnail.getAttribute("data-modal-id");
        openModal(modalId);
      });
    });
  }

  // Initialize by attaching event listeners to thumbnail images
  attachEventListeners();
}
