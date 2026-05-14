document.addEventListener("DOMContentLoaded", function () {
  const content = document.querySelector(".blog-content");
  const desktopToc = document.getElementById("tocDesktop");
  const mobileToc = document.getElementById("tocMobile");
  const mobileWrap = document.querySelector(".toc-mobile-wrap");
  const mobileBtn = document.getElementById("tocMobileBtn");

  if (!content || !desktopToc) return;

  const headings = Array.from(content.querySelectorAll("h2"));
  if (!headings.length) {
    desktopToc.innerHTML = '<div class="text-muted small">No headings found.</div>';
    if (mobileToc) mobileToc.innerHTML = '<div class="text-muted small">No headings found.</div>';
    return;
  }

  desktopToc.innerHTML = "";
  if (mobileToc) mobileToc.innerHTML = "";

  const usedIds = new Set();
  const allLinks = [];

  function slugify(text) {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  function makeUniqueId(base) {
    let id = base || "section";
    let counter = 1;

    while (usedIds.has(id) || document.getElementById(id)) {
      id = `${base}-${counter++}`;
    }

    usedIds.add(id);
    return id;
  }

  function updateMobileStickyTop() {
    const header = document.querySelector(".header-sticky.active");
    const headerHeight = header ? Math.ceil(header.getBoundingClientRect().height) : 0;
    document.documentElement.style.setProperty("--mobile-toc-top", `${headerHeight + 6}px`);
  }

  function getHeaderOffset() {
    const header = document.querySelector(".header-sticky.active");
    const headerHeight = header ? Math.ceil(header.getBoundingClientRect().height) : 0;
    return headerHeight + 12;
  }

  function scrollToTarget(target) {
    const y = target.getBoundingClientRect().top + window.pageYOffset - getHeaderOffset();
    window.scrollTo({
      top: Math.max(0, y),
      behavior: "smooth"
    });
  }

  function setActiveLink(id) {
    document.querySelectorAll(".toc-link").forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
    });
  }

  function updateActiveHeading() {
    const offset = getHeaderOffset() + 5;
    let currentId = headings[0] ? headings[0].id : "";

    for (const heading of headings) {
      const top = heading.getBoundingClientRect().top;
      if (top - offset <= 0) {
        currentId = heading.id;
      } else {
        break;
      }
    }

    if (currentId) setActiveLink(currentId);
  }

  function closeMobilePanel(callback) {
    if (!mobileWrap || !mobileWrap.classList.contains("open")) {
      callback();
      return;
    }

    mobileWrap.classList.remove("open");
    setTimeout(callback, 150);
  }

  if (mobileBtn) {
    mobileBtn.addEventListener("click", function () {
      mobileWrap.classList.toggle("open");
    });
  }

  function createLink(heading, index) {
    const text = heading.textContent.replace(/\s+/g, " ").trim();
    const baseId = heading.id ? heading.id : slugify(text || `section-${index}`);
    const id = makeUniqueId(baseId);

    heading.id = id;

    const link = document.createElement("a");
    link.href = `#${id}`;
    link.className = "toc-link";
    link.textContent = text || `Section ${index + 1}`;

    link.addEventListener("click", function (e) {
      e.preventDefault();

      const target = document.getElementById(id);
      if (!target) return;

      closeMobilePanel(() => {
        scrollToTarget(target);
        history.replaceState(null, "", `#${id}`);
        setActiveLink(id);
      });
    });

    return link;
  }

  headings.forEach((heading, index) => {
    const desktopLink = createLink(heading, index);
    allLinks.push(desktopLink);
    desktopToc.appendChild(desktopLink);

    if (mobileToc) {
      const mobileLink = desktopLink.cloneNode(true);

      mobileLink.addEventListener("click", function (e) {
        e.preventDefault();

        const id = mobileLink.getAttribute("href").replace("#", "");
        const target = document.getElementById(id);
        if (!target) return;

        closeMobilePanel(() => {
          scrollToTarget(target);
          history.replaceState(null, "", `#${id}`);
          setActiveLink(id);
        });
      });

      mobileToc.appendChild(mobileLink);
      allLinks.push(mobileLink);
    }
  });

  let ticking = false;
  window.addEventListener(
    "scroll",
    function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          updateActiveHeading();
          ticking = false;
        });
        ticking = true;
      }
    },
    {passive: true}
  );

  window.addEventListener("resize", function () {
    updateMobileStickyTop();
    updateActiveHeading();
  });

  window.addEventListener("load", function () {
    updateMobileStickyTop();
    updateActiveHeading();
  });

  window.addEventListener("hashchange", updateActiveHeading);

  updateMobileStickyTop();
  updateActiveHeading();
});

function updateMobileTocTop() {
  const header = document.querySelector(".header-sticky.active");
  const headerHeight = header ? Math.ceil(header.getBoundingClientRect().height) : 0;
  document.documentElement.style.setProperty("--mobile-toc-top", `${headerHeight}px`);
}

document.addEventListener("DOMContentLoaded", function () {
  updateMobileTocTop();
  window.addEventListener("resize", updateMobileTocTop);
  window.addEventListener("load", updateMobileTocTop);
});
