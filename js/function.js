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
  $("#menu").slicknav({label: "", prependTo: ".responsive-menu"});
  if ($("a[href='#top']").length) {
    $(document).on("click", "a[href='#top']", function () {
      $("html, body").animate({scrollTop: 0}, "slow");
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
    const swiperEl = document.querySelector(".testimonial-slider .swiper");
    const slideCount = swiperEl.querySelectorAll(".swiper-slide").length;
    const testimonial_slider = new Swiper(swiperEl, {slidesPerView: 2.5, speed: 1000, spaceBetween: 30, loop: slideCount > 4, autoplay: {delay: 5000}, navigation: {nextEl: ".testimonial-next-btn", prevEl: ".testimonial-prev-btn"}, breakpoints: {0: {slidesPerView: 1, spaceBetween: 12}, 800: {slidesPerView: 2, spaceBetween: 30}, 990: {slidesPerView: 2, spaceBetween: 30}, 1200: {slidesPerView: 2.5, spaceBetween: 30}}});
  }
  document.querySelectorAll(".track-btn").forEach(function (btn) {
    btn.removeEventListener("click", btn._clickHandler);
    btn._clickHandler = function () {
      const label = this.getAttribute("data-label");
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({event: "demo_button_click", event_category: "CTA", event_label: label, page_path: window.location.pathname});
    };
    btn.addEventListener("click", btn._clickHandler);
  });
  document.querySelectorAll(".track-trail-btn").forEach(function (btn) {
    btn.removeEventListener("click", btn._clickHandler);
    btn._clickHandler = function (e) {
      e.preventDefault();
      const href = this.href;
      const label = this.getAttribute("data-label");
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({event: "free_trial_button_click", event_category: "Free-Trail-CTA", event_label: label, page_path: window.location.pathname});
      setTimeout(() => {
        window.location.href = href;
      }, 500);
    };
    btn.addEventListener("click", btn._clickHandler);
  });
  if ($(".popup-video").length) {
    $(".popup-video").magnificPopup({type: "iframe", mainClass: "mfp-fade", removalDelay: 160, preloader: !1, fixedContentPos: !0});
  }
})(jQuery);
document.addEventListener("DOMContentLoaded", function () {
  const selectBoxes = [document.getElementById("agents")];
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
document.addEventListener("DOMContentLoaded", function () {
  const iosBtn = document.querySelector(".app-ios");
  const androidBtn = document.querySelector(".app-android");
  if (!iosBtn && !androidBtn) return;
  const pageName = window.location.pathname.replace(/^\/|\/$/g, "") || "Home";
  const utmSource = localStorage.getItem("utm_source") || "Website";
  const utmCampaign = localStorage.getItem("utm_campaign") || "Organic";
  function appendUTM(originalUrl) {
    const url = new URL(originalUrl);
    url.searchParams.set("page_name", pageName);
    if (utmSource) url.searchParams.set("utm_source", utmSource);
    if (utmCampaign) url.searchParams.set("utm_campaign", utmCampaign);
    return url.toString();
  }
  if (iosBtn) {
    iosBtn.href = appendUTM(iosBtn.href);
  }
  if (androidBtn) {
    androidBtn.href = appendUTM(androidBtn.href);
  }
});
let isSubmitting = false;

// ✅ IST time
function getISTTime() {
  return new Date().toLocaleString("sv-SE", {timeZone: "Asia/Kolkata"}).replace(" ", "T");
}

// ✅ Logging API
function sendLogToSheet(type, status, response, formData) {
  try {
    const logData = {
      time: getISTTime(),
      type,
      status,
      response: typeof response === "string" ? response : JSON.stringify(response),
      page: window.location.href,
      phone: formData?.your_phone || formData?.phone || "",
      name: formData?.your_name || ""
    };

    fetch("https://script.google.com/macros/s/AKfycbxZk-ATNxy0qX_AhZtBdTVBoxH2l6I_Xeyae2TSIFtHqj5d0VyLEUD2il8LX-6IvWvQjQ/exec", {
      method: "POST",
      headers: {"Content-Type": "text/plain"},
      body: JSON.stringify(logData),
      keepalive: true
    });
  } catch (e) {
    console.error("Logging failed:", e);
  }
}

// ✅ MAIN FORM
function submitForm(formId, formData, formToken) {
  if (isSubmitting) return; // 🚫 prevent duplicate clicks
  isSubmitting = true;

  const $form = $(`#${formId}`);
  const $btn = $form.find("button[type='submit']");
  const $spinner = $btn.find(".spinner-border");
  const $btnText = $btn.find(".btn-text");
  const defaultText = $btnText.text();

  $(".text-danger").addClass("d-none");

  $btn.prop("disabled", true);
  $spinner.removeClass("d-none");
  $btnText.text("Submitting...");

  const timestamp = getISTTime();

  const utmSource = localStorage.getItem("utm_source");
  const utmCampaign = localStorage.getItem("utm_campaign");

  formData.custom_source = "Website Enquiry- IB";
  formData.custom_status = "Api Allocation";

  if (utmSource) formData["custom_utm source"] = utmSource;
  if (utmCampaign) formData["custom_utm campaign"] = utmCampaign;

  // ✅ Phone validation
  const rawPhone = String(formData.your_phone || formData.phone || "");

  const fixedPhone = rawPhone.startsWith("+") ? rawPhone : "+" + rawPhone;

  // ✅ Sheet (lead backup)
  const sheetData = {
    Name: formData.your_name || "",
    Email: formData.your_email || "",
    Phone: fixedPhone,
    Company: formData.your_company || "",
    Team_Size: formData["custom_Sales/Calling Team Size"] || "",
    Know_Runo: formData["custom_We entered source"] || "",
    UTM_Source: utmSource,
    UTM_Campaign: utmCampaign,
    Timestamp: timestamp,
    Page_URL: window.location.href
  };

  // 🔹 Fire & forget lead backup (Apps Script 1)
  try {
    fetch("https://script.google.com/macros/s/AKfycbxeQE1e7xl4PITbWcS_Wspv75jKo4-cJlf3VVJxknGGZU0I6ypcefmDGX4wf1X2p5I/exec", {
      method: "POST",
      mode: "no-cors",
      body: JSON.stringify(sheetData),
      keepalive: true
    });
  } catch (e) {
    console.error("Sheet backup error", e);
  }

  // 🔹 CRM API (main)
  // ✅ Log BEFORE sending
  sendLogToSheet("REQUEST_SENT", "INIT", formData, formData);

  $.ajax({
    type: "POST",
    url: `https://api-call-crm.runo.in/integration/webhook/wb/5d70a2816082af4daf1e377e/${formToken}`,
    data: JSON.stringify(formData),
    contentType: "application/json",
    timeout: 30000
  })

    .done(function (data, textStatus, xhr) {
      console.log("CRM SUCCESS:", data);

      // ✅ Full response log
      sendLogToSheet(
        "SUCCESS",
        xhr.status,
        {
          response: data,
          statusText: textStatus
        },
        formData
      );

      $form[0].reset();

      const $modal = $form.closest(".modal");
      if ($modal.length) $modal.modal("hide");

      $("#thankYouModal").modal("show");
    })

    .fail(function (xhr, status, error) {
      console.error("CRM ERROR:", status, error, xhr.responseText);

      // ✅ Full error log
      sendLogToSheet(
        "ERROR",
        xhr.status || status,
        {
          error: error,
          status: status,
          response: xhr.responseText
        },
        formData
      );

      alert("Oops! Something went wrong while submitting the form.");
    })

    .always(function () {
      isSubmitting = false;

      $btn.prop("disabled", false);
      $spinner.addClass("d-none");
      $btnText.text(defaultText);
    });
}
