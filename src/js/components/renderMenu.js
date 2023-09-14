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
      // Don't display this if user is logged in
      href: "signup.html",
      text: "Sign up",
      icon: "fa-user-plus",
      isActive: pathname === "/signup.html",
    },
    {
      // Display this if user isn't logged in
      href: "login.html",
      text: "Login",
      icon: "fa-right-to-bracket",
      isActive: pathname === "/login.html",
    },
    {
      // Display this if user is logged in
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
