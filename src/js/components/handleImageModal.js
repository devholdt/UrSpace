export function handleImageModal() {
  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.add("modal-active");
    modal.addEventListener("click", closeModal);
    modal.querySelector(".modal-content").addEventListener("click", (e) => {
      e.stopPropagation();
    });
  }

  function closeModal(e) {
    if (
      e.target.classList.contains("modal") ||
      e.target.classList.contains("close-btn")
    ) {
      const modals = document.querySelectorAll(".modal");
      modals.forEach((modal) => {
        modal.classList.remove("modal-active");
      });
    }
  }

  function attachEventListeners() {
    const thumbnailImages = document.querySelectorAll(".thumbnail-img");

    thumbnailImages.forEach((thumbnail) => {
      thumbnail.addEventListener("click", () => {
        const modalId = thumbnail.getAttribute("data-modal-id");
        openModal(modalId);
      });
    });
  }

  attachEventListeners();
}
