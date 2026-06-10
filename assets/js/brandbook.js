const menuToggle = document.querySelector("[data-menu-toggle]");
const sidebar = document.querySelector(".docs-sidebar");

function closeNavigation() {
  document.body.classList.remove("nav-open");
  menuToggle?.setAttribute("aria-expanded", "false");
}

menuToggle?.addEventListener("click", () => {
  const willOpen = !document.body.classList.contains("nav-open");
  document.body.classList.toggle("nav-open", willOpen);
  menuToggle.setAttribute("aria-expanded", String(willOpen));
});

sidebar?.addEventListener("click", (event) => {
  if (event.target.closest("a")) closeNavigation();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeNavigation();
});

document.querySelectorAll("[data-copy]").forEach((button) => {
  button.addEventListener("click", async () => {
    const value = button.getAttribute("data-copy");
    try {
      await navigator.clipboard.writeText(value);
      const label = button.querySelector("span");
      const original = label?.textContent || button.textContent;
      if (label) label.textContent = "Copiado";
      else button.textContent = "Copiado";
      window.setTimeout(() => {
        if (label) label.textContent = original;
        else button.textContent = original;
      }, 1200);
    } catch {
      window.prompt("Copie o valor:", value);
    }
  });
});

const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}
