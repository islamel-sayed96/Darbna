// البيان للتسويق الرقمي - سكربت خفيف بدون مكتبات خارجية
(function () {
  "use strict";

  // 1) قائمة الجوال
  var toggle = document.querySelector(".menu-toggle");
  var nav = document.getElementById("main-nav");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "إغلاق القائمة" : "فتح القائمة");
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // 2) سنة حقوق النشر تتحدث تلقائياً
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // 3) حركة ظهور الأقسام عند التمرير
  var items = document.querySelectorAll(".card, .content, figure, details, .contact-info, .map");
  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    items.forEach(function (el) {
      el.classList.add("reveal");
      observer.observe(el);
    });
  }

  // 4) نموذج التواصل: يرسل الرسالة عبر واتساب
  var form = document.getElementById("contact-form");
  var WHATSAPP_NUMBER = "971500000000"; // غيّر الرقم إلى رقم الشركة

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;

      var data = new FormData(form);
      var text =
        "مرحباً البيان، أرغب في تحليل SEO مجاني.\n" +
        "الاسم: " + data.get("name") + "\n" +
        "الجوال: " + data.get("phone") + "\n" +
        (data.get("website") ? "الموقع: " + data.get("website") + "\n" : "") +
        (data.get("message") ? "الرسالة: " + data.get("message") : "");

      window.open("https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(text), "_blank", "noopener");
    });
  }
})();
