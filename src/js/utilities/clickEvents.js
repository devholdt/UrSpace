export function handleLogout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  location.reload();
}

export function clearUrl(button, input) {
  button.addEventListener("click", () => {
    input.value = "";
  });
}
