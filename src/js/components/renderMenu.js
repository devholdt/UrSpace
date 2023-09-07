/** This function renders the menu for all pages **/
export default function renderMenu() {
  const { pathname } = document.location;
  const nav = document.querySelector("nav");

  // Use this array to easily add more links to nav if needed
  const links = [
    {
      href: "index.html",
      text: "Home",
      icon: "fa-house",
      isActive: pathname === "/index.html" || pathname === "",
    },
    {
      href: "login.html",
      text: "Login",
      icon: "fa-right-to-bracket",
      isActive: pathname === "/login.html",
    },
    {
      href: "profile.html",
      text: "Profile",
      icon: "fa-user",
      isActive: pathname === "/profile.html",
    },
  ];

  // Reusable code for rendering all links in nav
  const navHTML = links
    .map(
      (link) => `
  <a href="${link.href}" class="custom-link ${link.isActive ? "active" : ""}">
    <i class="fa-solid ${link.icon}"></i> <span>${link.text}</span>
  </a>`
    )
    .join("");

  nav.innerHTML = navHTML;
}
