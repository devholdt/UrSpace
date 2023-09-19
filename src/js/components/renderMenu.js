import { getUser } from "../utilities/storage.js";

export default function renderMenu() {
  const { pathname } = document.location;
  const nav = document.querySelector("nav");
  const user = getUser();

  const links = [
    { href: "index.html", text: "Home", icon: "fa-solid fa-house" },
    { href: "login.html", text: "Login", icon: "fa-solid fa-right-to-bracket" },
    { href: "signup.html", text: "Sign up", icon: "fa-solid fa-user-plus" },
  ];

  const navProfile = document.querySelector(".nav-profile");

  if (user) {
    links.splice(1, 2);
    links.push({
      href: "profile.html",
      text: "Profile",
      icon: "fa-solid fa-user",
    });

    if (user.avatar === null) {
      user.avatar =
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
    }

    navProfile.innerHTML = `
    <div>
      <img src="${user.avatar}" class="profile-pic" alt="${user.name}'s profile picture">
      <a href="profile.html">${user.name}</a>
    </div>
    <button id="btnLogout" class="btn btn-custom">Log out</button>`;
  }

  nav.innerHTML = links
    .map(
      (link) => `
      <a href="${link.href}" class="custom-link ${
        pathname === `/${link.href}` ? "active" : ""
      }"><i class="${link.icon}"></i> <span>${link.text}</span></a>`
    )
    .join("");
}

// export default function renderMenu() {
//   const { pathname } = document.location;

//   const nav = document.querySelector("nav");

//   const user = getUser();

//   let authLink = `<a href="login.html" class="custom-link ${
//     pathname === "/login.html" ? "active" : ""
//   }"><i class="fa-solid fa-right-to-bracket"></i> <span>Login</span></a>
//   <a href="signup.html" class="custom-link ${
//     pathname === "/signup.html" ? "active" : ""
//   }"><i class="fa-solid fa-user-plus"></i> <span>Sign up</span></a>`;

//   if (user) {
//     authLink = `<a href="profile.html" class="custom-link ${
//       pathname === "/profile.html" ? "active" : ""
//     }"><i class="fa-solid fa-user"></i> <span>Profile</span></a>`;

//     const navProfile = document.querySelector(".nav-profile");

//     if (user.avatar === null) {
//       user.avatar =
//         "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
//     }

//     navProfile.innerHTML = `
//     <img src="${user.avatar}" class="profile-pic" alt="${user.name}'s profile picture">
//     <a href="profile.html">${user.name}</a>`;
//   }

//   nav.innerHTML = `<a href="index.html" class="custom-link ${
//     pathname === "/index.html" || pathname === "" ? "active" : ""
//   }"><i class="fa-solid fa-house"></i> <span>Home</span></a>
//   ${authLink}`;
// }
