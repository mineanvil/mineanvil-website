/* MineAnvil static site JS
   Responsibilities:
   - mobile nav toggle
   - smooth scrolling
   - contact email helpers (copy + mailto links)
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

  // Contact card
  const contactCard = document.querySelector("[data-contact-email]");
  const copyStatusEl = document.querySelector("[data-copy-status]");

  function setCopyStatus(message, isError) {
    if (!copyStatusEl) return;
    copyStatusEl.textContent = message;
    copyStatusEl.classList.toggle("is-error", Boolean(isError));
    copyStatusEl.classList.toggle("is-success", Boolean(message) && !isError);
  }

  function copyTextFallback(value) {
    const input = document.createElement("input");
    input.type = "text";
    input.value = value;
    input.setAttribute("readonly", "true");
    input.style.position = "fixed";
    input.style.left = "-9999px";
    input.style.top = "0";
    document.body.appendChild(input);
    input.select();
    input.setSelectionRange(0, input.value.length);

    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch (err) {
      ok = false;
    }

    document.body.removeChild(input);
    return ok;
  }

  async function copyToClipboard(value) {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
      try {
        await navigator.clipboard.writeText(value);
        return true;
      } catch (err) {
        // Fall back to the older execCommand approach below.
      }
    }
    return copyTextFallback(value);
  }

  if (contactCard instanceof HTMLElement) {
    const email = contactCard.getAttribute("data-contact-email") || "";
    const emailLink = contactCard.querySelector("[data-email-link]");
    const openEmailClientLink = contactCard.querySelector("[data-open-email-client]");
    const copyBtn = contactCard.querySelector("[data-copy-email]");
    const footerEmailLink = document.querySelector("[data-footer-email-link]");

    if (emailLink instanceof HTMLAnchorElement) {
      emailLink.textContent = email;
      emailLink.href = "mailto:" + email;
      emailLink.setAttribute("aria-label", "Email MineAnvil at " + email);
    }

    if (openEmailClientLink instanceof HTMLAnchorElement) {
      openEmailClientLink.href = "mailto:" + email;
      openEmailClientLink.setAttribute("aria-label", "Open your email client to message " + email);
    }

    if (footerEmailLink instanceof HTMLAnchorElement) {
      footerEmailLink.textContent = email;
      footerEmailLink.href = "mailto:" + email;
      footerEmailLink.setAttribute("aria-label", "Email MineAnvil at " + email);
    }

    if (copyBtn instanceof HTMLButtonElement) {
      copyBtn.addEventListener("click", async function () {
        setCopyStatus("");
        try {
          const ok = await copyToClipboard(email);
          if (ok) setCopyStatus("Copied.", false);
          else setCopyStatus("Copy failed. You can copy the address manually.", true);
        } catch (err) {
          setCopyStatus("Copy failed. You can copy the address manually.", true);
        }
      });
    }
  }
})();


