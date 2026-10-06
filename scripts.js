const root = document.documentElement;
const themeToggle = document.getElementById("themeToggle");
const year = document.getElementById("year");
const toTop = document.getElementById("toTop");
const filters = document.querySelectorAll(".filter");
const galleryItems = document.querySelectorAll(".gallery-item");

// Current year
year.textContent = new Date().getFullYear();

// Restore saved theme, otherwise respect system preference.
const savedTheme = localStorage.getItem("joshua-theme");
if (savedTheme) {
  root.dataset.theme = savedTheme;
} else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
  root.dataset.theme = "light";
}

function updateThemeLabel() {
  const isLight = root.dataset.theme === "light";
  themeToggle.setAttribute(
    "aria-label",
    isLight ? "Switch to dark mode" : "Switch to light mode"
  );
  themeToggle.title = isLight ? "Switch to dark mode" : "Switch to light mode";
}

updateThemeLabel();

themeToggle.addEventListener("click", () => {
  const nextTheme = root.dataset.theme === "light" ? "dark" : "light";
  root.dataset.theme = nextTheme;
  localStorage.setItem("joshua-theme", nextTheme);
  updateThemeLabel();
});

// Gallery filtering
filters.forEach((button) => {
  button.addEventListener("click", () => {
    filters.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    const selected = button.dataset.filter;

    galleryItems.forEach((item) => {
      const show = selected === "all" || item.dataset.category === selected;
      item.classList.toggle("is-hidden", !show);
    });
  });
});

// Back to top
toTop.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});

// Subtle pointer parallax for the ambient background.
const ambient = document.querySelector(".ambient");

window.addEventListener("pointermove", (event) => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const x = (event.clientX / window.innerWidth - 0.5) * 2;
  const y = (event.clientY / window.innerHeight - 0.5) * 2;

  ambient.style.transform = `translate(${x * 5}px, ${y * 4}px)`;
});
