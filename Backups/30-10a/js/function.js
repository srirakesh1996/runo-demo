(function ($) {
  "use strict";
  var $window = $(window);
  var $body = $("body");
  $window.on("load", function () {
    $(".preloader").fadeOut(400);
  });
  if ($(".active-sticky-header").length) {
    $window.on("resize", function () {
      setHeaderHeight();
    });
    function setHeaderHeight() {
      $("header.main-header").css("height", $("header .header-sticky").outerHeight());
    }
    $window.on("scroll", function () {
      var fromTop = $(window).scrollTop();
      setHeaderHeight();
      var headerHeight = $("header .header-sticky").outerHeight();
      $("header .header-sticky").toggleClass("hide", fromTop > headerHeight + 100);
      $("header .header-sticky").toggleClass("active", fromTop > 600);
    });
  }
  $("#menu").slicknav({ label: "", prependTo: ".responsive-menu" });
  if ($("a[href='#top']").length) {
    $(document).on("click", "a[href='#top']", function () {
      $("html, body").animate({ scrollTop: 0 }, "slow");
      return !1;
    });
  }
  document.addEventListener("DOMContentLoaded", function () {
    const helloBar = document.getElementById("helloBar");
    const closeBtn = document.querySelector(".close-hello");
    const storageKey = "helloBarClosed";
    const oneDay = 24 * 60 * 60 * 1000;
    if (!helloBar) return;
    const closedTime = localStorage.getItem(storageKey);
    if (closedTime) {
      const now = Date.now();
      if (now - parseInt(closedTime, 10) < oneDay) {
        helloBar.style.display = "none";
      } else {
        localStorage.removeItem(storageKey);
      }
    }
    if (closeBtn) {
      closeBtn.addEventListener("click", function () {
        helloBar.style.display = "none";
        localStorage.setItem(storageKey, Date.now());
      });
    }
  });
  if ($(".testimonial-slider").length) {
    const testimonial_slider = new Swiper(".testimonial-slider .swiper", {
      slidesPerView: 2.5,
      speed: 1000,
      spaceBetween: 30,
      loop: !0,
      autoplay: { delay: 5000 },
      navigation: { nextEl: ".testimonial-next-btn", prevEl: ".testimonial-prev-btn" },
      breakpoints: { 0: { slidesPerView: 1, spaceBetween: 12 }, 800: { slidesPerView: 2, spaceBetween: 30 }, 990: { slidesPerView: 2, spaceBetween: 30 }, 1200: { slidesPerView: 2.5, spaceBetween: 30 } },
    });
  }
  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".track-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const label = this.getAttribute("data-label");
        const pagePath = window.location.pathname;
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ event: "button_click", event_category: "CTA", event_label: label, page_path: pagePath });
      });
    });
  });
  if ($(".popup-video").length) {
    $(".popup-video").magnificPopup({ type: "iframe", mainClass: "mfp-fade", removalDelay: 160, preloader: !1, fixedContentPos: !0 });
  }
})(jQuery);
document.addEventListener("DOMContentLoaded", function () {
  const selectBoxes = [document.getElementById("agents"), document.getElementById("know_runo")];
  selectBoxes.forEach((select) => {
    const defaultOption = select.querySelector("option[disabled]");
    select.addEventListener("mousedown", function () {
      defaultOption.hidden = !0;
    });
    select.addEventListener("blur", function () {
      if (!select.value) {
        defaultOption.hidden = !1;
      }
    });
    select.addEventListener("change", function () {
      defaultOption.hidden = !0;
    });
  });
});
document.addEventListener("DOMContentLoaded", function () {
  const interval = setInterval(() => {
    const buttons = document.querySelectorAll(".runo-web-crm");
    if (buttons.length > 0) {
      clearInterval(interval);
      const pageName = window.location.pathname.replace(/^\/|\/$/g, "") || "Home";
      const utmSource = localStorage.getItem("utm_source");
      const utmCampaign = localStorage.getItem("utm_campaign");
      const baseUrl = "https://web.runo.in";
      const params = new URLSearchParams();
      params.append("page_name", pageName);
      if (utmSource) params.append("utm_source", utmSource);
      if (utmCampaign) params.append("utm_campaign", utmCampaign);
      const finalUrl = `${baseUrl}?${params.toString()}`;
      buttons.forEach((btn) => {
        btn.href = finalUrl;
        btn.addEventListener("click", function (e) {
          e.preventDefault();
          window.location.href = finalUrl;
        });
      });
    }
  }, 100);
});
function submitForm(formId, formData, formToken) {
  const $form = $(`#${formId}`);
  const $btn = $form.find("button[type='submit']");
  const $spinner = $btn.find(".spinner-border");
  const $btnText = $btn.find(".btn-text");
  const defaultText = $btnText.text();
  $(".text-danger").addClass("d-none");
  $btn.prop("disabled", !0);
  $spinner.removeClass("d-none");
  $btnText.text("Submitting...");
  const utmSource = localStorage.getItem("utm_source");
  const utmCampaign = localStorage.getItem("utm_campaign");
  formData.custom_source = "Website Enquiry- IB";
  formData.custom_status = "Api Allocation";
  if (utmSource) formData["custom_utm source"] = utmSource;
  if (utmCampaign) formData["custom_utm campaign"] = utmCampaign;
  $.ajax({ type: "POST", url: `https://api-call-crm.runo.in/integration/webhook/wb/5d70a2816082af4daf1e377e/${formToken}`, data: JSON.stringify(formData), contentType: "application/json", headers: { "Content-Type": "application/json" } })
    .done(function (data) {
      $form[0].reset();
      const $modal = $form.closest(".modal");
      if ($modal.length) {
        $modal.modal("hide");
      }
      $("#thankYouModal").modal("show");
    })
    .fail(function () {
      alert("Oops! Something went wrong.");
    })
    .always(function () {
      $btn.prop("disabled", !1);
      $spinner.addClass("d-none");
      $btnText.text(defaultText);
    });
}
