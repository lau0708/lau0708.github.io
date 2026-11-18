(function () {
  var root = document.documentElement;

  // Scroll reveal (opt-in so content stays visible without JS)
  root.classList.add("js-anim");
  var revealables = document.querySelectorAll(".frag, .card, .pr-row, .pulse-cell, .pagehead, .work");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealables.forEach(function (el) { io.observe(el); });
  } else {
    revealables.forEach(function (el) { el.classList.add("in"); });
  }

  // Data center: honest timestamp
  var timeEl = document.getElementById("pulse-time");
  if (timeEl) {
    var pad = function (n) { return String(n).padStart(2, "0"); };
    var now = new Date();
    timeEl.textContent =
      now.getFullYear() + "-" + pad(now.getMonth() + 1) + "-" + pad(now.getDate()) +
      " " + pad(now.getHours()) + ":" + pad(now.getMinutes());
  }
})();
