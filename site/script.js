/* MineAnvil static site JS
   Responsibilities:
   - mobile nav toggle
   - smooth scrolling
   - basic form validation + mailto building
*/

(function () {
  "use strict";

  const header = document.querySelector("[data-header]");
  const nav = document.querySelector("[data-nav]");
  const navToggle = document.querySelector("[data-nav-toggle]");
  const scrollLinks = document.querySelectorAll("[data-scroll-to]");

  function closeNav() {
    if (!nav || !navToggle) return;
    nav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  }

  function openNav() {
    if (!nav || !navToggle) return;
    nav.classList.add("is-open");
    navToggle.setAttribute("aria-expanded", "true");
  }

  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      const isOpen = nav.classList.contains("is-open");
      if (isOpen) closeNav();
      else openNav();
    });

    // Close if you click outside (mobile menu popover).
    document.addEventListener("click", function (e) {
      if (!nav.classList.contains("is-open")) return;
      const target = e.target;
      if (!(target instanceof Element)) return;
      if (nav.contains(target) || navToggle.contains(target)) return;
      closeNav();
    });

    // Close on Escape.
    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      closeNav();
    });
  }

  function scrollToHash(hash) {
    if (!hash || hash === "#") return;
    const id = hash.replace("#", "");
    const el = document.getElementById(id);
    if (!el) return;

    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // Smooth scrolling for nav/footer links.
  scrollLinks.forEach(function (link) {
    link.addEventListener("click", function (e) {
      const href = link.getAttribute("href") || "";
      if (!href.startsWith("#")) return;
      e.preventDefault();
      closeNav();
      scrollToHash(href);
      history.replaceState(null, "", href);
    });
  });

  // Also smooth-scroll any in-page anchor clicks for consistency.
  document.addEventListener("click", function (e) {
    const target = e.target;
    if (!(target instanceof Element)) return;
    const a = target.closest("a[href^='#']");
    if (!a) return;
    const href = a.getAttribute("href");
    if (!href) return;
    e.preventDefault();
    closeNav();
    scrollToHash(href);
    history.replaceState(null, "", href);
  });

  // Footer year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Contact form -> mailto
  const form = document.querySelector("[data-contact-form]");
  const statusEl = document.querySelector("[data-form-status]");

  function setStatus(message, isError) {
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.classList.toggle("is-error", Boolean(isError));
  }

  function setInvalid(el, isInvalid) {
    el.setAttribute("aria-invalid", isInvalid ? "true" : "false");
  }

  function isValidEmail(value) {
    // Intentionally simple: enough to catch obvious mistakes.
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function encodeLine(s) {
    return encodeURIComponent(String(s).trim());
  }

  if (form instanceof HTMLFormElement) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      setStatus("");

      const nameEl = form.querySelector("#name");
      const emailEl = form.querySelector("#email");
      const messageEl = form.querySelector("#message");

      if (!(nameEl instanceof HTMLInputElement)) return;
      if (!(emailEl instanceof HTMLInputElement)) return;
      if (!(messageEl instanceof HTMLTextAreaElement)) return;

      const name = nameEl.value.trim();
      const email = emailEl.value.trim();
      const message = messageEl.value.trim();

      let ok = true;

      if (!name) {
        ok = false;
        setInvalid(nameEl, true);
      } else {
        setInvalid(nameEl, false);
      }

      if (!email || !isValidEmail(email)) {
        ok = false;
        setInvalid(emailEl, true);
      } else {
        setInvalid(emailEl, false);
      }

      if (!message) {
        ok = false;
        setInvalid(messageEl, true);
      } else {
        setInvalid(messageEl, false);
      }

      if (!ok) {
        setStatus("Please fill in the required fields (name, email, message).", true);
        const firstInvalid = form.querySelector('[aria-invalid="true"]');
        if (firstInvalid instanceof HTMLElement) firstInvalid.focus();
        return;
      }

      const to = "hello@mineanvil.com";
      const subject = encodeLine("MineAnvil updates request");
      const body = encodeLine(
        [
          "Hello MineAnvil,",
          "",
          message,
          "",
          "---",
          "Name: " + name,
          "Email: " + email,
          "Sent from: " + window.location.href
        ].join("\n")
      );

      const mailto = "mailto:" + encodeURIComponent(to) + "?subject=" + subject + "&body=" + body;

      setStatus("Opening your email app…", false);
      window.location.href = mailto;
    });
  }
})();


