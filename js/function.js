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

function submitForm(formId, formData, formToken) {
  const $form = $(`#${formId}`);
  const $btn = $form.find("button[type='submit']");
  const $spinner = $btn.find(".spinner-border");
  const $btnText = $btn.find(".btn-text");
  const defaultText = $btnText.text();

  $(".text-danger").addClass("d-none");

  $btn.prop("disabled", true);
  $spinner.removeClass("d-none");
  $btnText.text("Submitting...");

  const timestamp = new Date().toLocaleString("sv-SE", {timeZone: "Asia/Kolkata"}).replace(" ", "T");

  const utmSource = localStorage.getItem("utm_source") || "";
  const utmCampaign = localStorage.getItem("utm_campaign") || "";

  let websiteSubSource = "Demo";
  if (formId === "contact-form") {
    websiteSubSource = "Contact";
  } else if (formId === "partnersForm") {
    websiteSubSource = "Partners";
  }

  formData.custom_source = "Website Enquiry- IB";
  formData.custom_status = "Api Allocation";
  formData["custom_website sub source"] = websiteSubSource;

  if (utmSource) formData["custom_utm source"] = utmSource;
  if (utmCampaign) formData["custom_utm campaign"] = utmCampaign;

  const whatsappOptIn = $("#policyCheck").is(":checked");

  const rawPhone = String(formData.your_phone || formData.phone || "").trim();
  const fixedPhone = rawPhone.startsWith("+") ? rawPhone : `+${rawPhone}`;

  const fullName = String(formData.your_name || formData.name || "").trim();
  const nameParts = fullName.split(/\s+/).filter(Boolean);
  const firstname = nameParts[0] || "";
  const lastname = nameParts.slice(1).join(" ") || "";

  const email = String(formData.your_email || formData.email || "").trim();
  const company = String(formData.your_company || formData.company || "").trim();
  const message = String(formData.your_notes || formData.message || "").trim();
  const agents = String(formData["custom_Sales/Calling Team Size"] || "").trim();

  const sheetData = {
    Name: fullName,
    Email: email,
    Phone: fixedPhone,
    Company: company,
    Team_Size: agents,
    Know_Runo: formData["custom_We entered source"] || "",
    UTM_Source: utmSource,
    UTM_Campaign: utmCampaign,
    WhatsApp_OptIn: whatsappOptIn,
    Timestamp: timestamp,
    Page_URL: window.location.href,
    Sub_Source: websiteSubSource
  };

  // Google Sheet
  try {
    fetch("https://script.google.com/macros/s/AKfycbxa1aOvqO7KuY1c2WK01ybl998PwKoVcwQVm_rwFw5JrJo3XfuSKg4cqBSAdeaTVEYI/exec", {
      method: "POST",
      mode: "no-cors",
      body: JSON.stringify(sheetData),
      keepalive: true
    });
  } catch (e) {}

  // HubSpot
  let hubspotFormGuid = "";
  let hubspotPayload = {};

  if (formId === "demo-form") {
    hubspotFormGuid = "bf1da384-b3a2-4ed5-895d-d234d34eb62b";
    hubspotPayload = {
      fields: [
        {name: "firstname", value: firstname},
        {name: "lastname", value: lastname},
        {name: "email", value: email},
        {name: "phone", value: fixedPhone},
        {name: "Company", value: company},
        {name: "number_of_calling_agents", value: agents}
      ],
      submittedAt: Date.now(),
      context: {
        pageUri: window.location.href,
        pageName: document.title
      },
      legalConsentOptions: {
        consent: {
          consentToProcess: whatsappOptIn,
          text: "I agree to the Privacy Policy and consent to receive communication via WhatsApp."
        }
      }
    };
  } else if (formId === "contact-form") {
    hubspotFormGuid = "fa1e2876-5302-4247-8420-da84184f098d";
    hubspotPayload = {
      fields: [
        {name: "firstname", value: firstname},
        {name: "lastname", value: lastname},
        {name: "email", value: email},
        {name: "phone", value: fixedPhone},
        {name: "message", value: message}
      ],
      submittedAt: Date.now(),
      context: {
        pageUri: window.location.href,
        pageName: document.title
      },
      legalConsentOptions: {
        consent: {
          consentToProcess: whatsappOptIn,
          text: "I agree to the Privacy Policy and consent to receive communication via WhatsApp."
        }
      }
    };
  } else if (formId === "partnersForm") {
    hubspotFormGuid = "fc02dd50-64a6-4f1e-a3b7-46572a3630bc";
    hubspotPayload = {
      fields: [
        {name: "firstname", value: firstname},
        {name: "lastname", value: lastname},
        {name: "email", value: email},
        {name: "phone", value: fixedPhone},
        {name: "message", value: message}
      ],
      submittedAt: Date.now(),
      context: {
        pageUri: window.location.href,
        pageName: document.title
      }
    };
  }

  if (hubspotFormGuid) {
    fetch(`https://api.hsforms.com/submissions/v3/integration/submit/245018807/${hubspotFormGuid}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(hubspotPayload)
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(data.message || "HubSpot submission failed");
        }
        console.log("HubSpot Submission Successful:", data);
      })
      .catch((error) => {
        console.error("HubSpot Submit Failed:", error);
      });
  }

  // Existing CRM submit
  $.ajax({
    type: "POST",
    url: `https://api-call-crm.runo.in/integration/webhook/wb/5d70a2816082af4daf1e377e/${formToken}`,
    data: JSON.stringify(formData),
    contentType: "application/json",
    dataType: "json"
  })
    .done(function (res) {
      if (res.statusCode === 0) {
        $form[0].reset();

        const $modal = $form.closest(".modal");
        if ($modal.length) {
          $modal.modal("hide");
        }

        $("#thankYouModal").modal("show");
      } else {
        alert(res.message || "Please try again.");
      }
    })
    .fail(function () {
      alert("Oops! Something went wrong while submitting the form. Please try again.");
    })
    .always(function () {
      $btn.prop("disabled", false);
      $spinner.addClass("d-none");
      $btnText.text(defaultText);
    });
}
