import message from "./message.js";
import { API_URLS } from "../settings/constants.js";
import { httpRequest } from "../utilities/httpRequest.js";
import { formatDate } from "../utilities/formatDate.js";

export async function handleComment() {
  const commentFormContainers = document.querySelectorAll(
    ".comment-form-container"
  );

  commentFormContainers.forEach((container) => {
    const commentForm = container.querySelector("form");
    const commentsContainer = container.querySelector(".comments");
    const commentInput = commentForm.querySelector("#commentInput");

    const url = `${API_URLS.POSTS}/${commentForm.dataset.id}/comment`;

    commentForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const commentValue = commentInput.value;

      const commentMessage = document.createElement("div");
      commentMessage.classList.add(
        "message-container",
        "message-comment",
        "mt-2"
      );

      try {
        const newComment = await httpRequest(url, "POST", {
          body: commentValue,
        });

        const newCommentDate = new Date(newComment.created);
        const formattedNewCommentDate = formatDate(newCommentDate);

        const commentElement = document.createElement("div");
        commentElement.classList.add(
          "d-flex",
          "rounded-bottom",
          "post-comment"
        );

        commentElement.innerHTML = `
            <div class="card post p-">
        
            <div class="card-header border-0 py-1">
                <div class="d-flex justify-content-between align-items-center">
                    <div class="d-flex gap-2">
                        <p>${newComment.author.name}</p>
                        <a href="#" class="fst-italic fw-light">visit profile</a>
                    </div>
                    <p class="fst-italic fw-light">id: ${newComment.id}</p>
                </div>
            </div>

            <div class="card-content border-bottom">
                <div class="card-body">
                    <div class="card-text">${newComment.body}</div>
                </div>
            </div>

            <div class="d-flex justify-content-between post-bottom">
                <p class="mx-2 my-1">${formattedNewCommentDate}</p>
                <p class="mx-2 my-1 fw-light">id: ${newComment.id}</p>
            </div>

            </div>`;

        commentsContainer.append(commentElement);

        commentsContainer.prepend(commentMessage);
        message("success", "Comment posted", ".message-comment");

        commentInput.value = "";

        setTimeout(() => {
          commentMessage.remove();
        }, 1500);
      } catch (error) {
        commentsContainer.prepend(commentMessage);
        message(
          "error",
          `An error occured when attempting to post a comment: ${error}`,
          ".message-comment",
          null
        );
        setTimeout(() => {
          commentMessage.remove();
        }, 2000);
      }
    });
  });
}
