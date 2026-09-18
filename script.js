const menuBtn = document.getElementById("menuBtn");
const navMenu = document.getElementById("navMenu");

menuBtn.addEventListener("click", () => {
  navMenu.classList.toggle("open");
});

document.querySelectorAll("#navMenu a").forEach(link => {
  link.addEventListener("click", () => navMenu.classList.remove("open"));
});

document.getElementById("contactForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const data = new FormData(this);
  const name = data.get("name");
  const email = data.get("email");
  const subject = data.get("subject") || "Portfolio enquiry";
  const message = data.get("message");

  const mailto =
    "mailto:kumarisagrika137@gmail.com" +
    "?subject=" + encodeURIComponent(subject) +
    "&body=" + encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\n${message}`
    );

  document.getElementById("formMsg").textContent = "Opening your email app...";
  window.location.href = mailto;
});
